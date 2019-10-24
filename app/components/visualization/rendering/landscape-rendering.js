import RenderingCore from './rendering-core';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

import THREE from "three";

import applyKlayLayout from
  'explorviz-frontend/utils/landscape-rendering/klay-layouter';
import Interaction from
  'explorviz-frontend/utils/landscape-rendering/interaction';
import Labeler from
  'explorviz-frontend/utils/landscape-rendering/labeler';
import CalcCenterAndZoom from
  'explorviz-frontend/utils/landscape-rendering/center-and-zoom-calculator';

import ImageLoader from 'explorviz-frontend/utils/three-image-loader';



/**
* Renderer for landscape visualization.
*
* @class Landscape-Rendering-Component
* @extends Rendering-Core-Component
*
* @module explorviz
* @submodule visualization.rendering
*/
export default RenderingCore.extend({

  configuration: service("configuration"),

  hammerManager: null,

  interaction: null,
  labeler: null,
  imageLoader: null,
  centerAndZoomCalculator: null,

  renderingService: service("rendering-service"),

  openSymbol: null,
  closeSymbol: null,

  // there's already a property 'listener' in superclass RenderingCore
  listeners2: null,

  // @Override
  /**
   * Initialize listener functions, properties and utility objects
   *
   * @method initRendering
   */
  initRendering() {
    this._super(...arguments);

    this.debug("init landscape-rendering");

    this.onReSetupScene = function () {
      this.set('centerAndZoomCalculator.centerPoint', null);
      this.get('camera.position').set(0, 0, 0);
      this.cleanAndUpdateScene();
    };

    this.onUpdated = function () {
      if (this.get('initDone')) {
        this.cleanAndUpdateScene();
      }
    };

    this.onResized = function () {
      this.set('centerAndZoomCalculator.centerPoint', null);
      this.cleanAndUpdateScene();
    };

    if (!this.get('interaction')) {
      // Owner necessary to inject service into util
      this.set('interaction', Interaction.create(getOwner(this).ownerInjection()));
    }

    if (!this.get('imageLoader')) {
      this.set('imageLoader', ImageLoader.create());
    }

    if (!this.get('labeler')) {
      this.set('labeler', Labeler.create());
    }

    if (!this.get('centerAndZoomCalculator')) {
      this.set('centerAndZoomCalculator', CalcCenterAndZoom.create());
    }

    const backgroundColor = this.get('configuration.landscapeColors.background');
    this.set('scene.background', new THREE.Color(backgroundColor));

    this.initInteraction();

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.get('scene').add(dirLight);

    // Set default model
    this.set('imageLoader.logos', {});
    this.set('labeler.textLabels', {});
    this.set('labeler.systemTextCache', []);
    this.set('labeler.nodeTextCache', []);
    this.set('labeler.appTextCache', []);

    this.set('centerAndZoomCalculator.centerPoint', null);
  },

  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup landscape rendering");
    
    this.set('imageLoader.logos', {});
    this.set('labeler.textLabels', {});
    this.set('labeler.textCache', []);

    this.removeListeners();

    this.get('interaction').removeHandlers();
  },

  removeListeners() {
    // unsubscribe from all services
    this.get('listeners2').forEach(([service, event, listenerFunction]) => {
      this.get(service).off(event, listenerFunction);
    });
    this.set('listeners2', null);
  },


  // @Override
  /**
   * TODO
   *
   * @method cleanAndUpdateScene
   */
  cleanAndUpdateScene() {
    this._super(...arguments);

    this.debug("clean and populate landscape-rendering");

    this.set('interaction.raycastObjects', this.get('scene.children'));
  },

  /**
   * The landscape is bound in the template, e.g., landscape=landscapeRepo.latestLandscape
   */
  getLandscape() {
    // landscape is passed via the template, e.g., for the replay mode
    if (this.get('landscape') != null|undefined) {
      return this.get('landscape');
    }
    // the visualization route needs to get the landscape directly from the landscapeRepo to work correctly
    else {
      return this.get('landscapeRepo.latestLandscape');
    }
  },


  // @Override
  /**
   * TODO
   *
   * @method populateScene
   */
  populateScene() {
    this._super(...arguments);
    this.debug("populate landscape-rendering");

    const self = this;

    const emberLandscape = this.getLandscape();

    if (!emberLandscape || !this.get('font')) {
      return;
    }

    applyKlayLayout(emberLandscape);

    const systems = emberLandscape.get('systems');

    const scaleFactor = {
      width: 0.5,
      height: 0.5
    };

    // Create plus or minus, if not already done
    if (!(this.get('openSymbol') && this.get('closeSymbol')) &&
      this.get('font')) {

      createCollapseSymbols();

    }

    if (systems) {

      // Calculate new center and update zoom
      if (!this.get('centerAndZoomCalculator.centerPoint')) {
        this.get('centerAndZoomCalculator')
          .calculateLandscapeCenterAndZZoom(emberLandscape,
            this.get('webglrenderer'));

        const cameraZ = this.get('centerAndZoomCalculator.cameraZ');
        this.set('camera.position.z', cameraZ);
        this.get('camera').updateProjectionMatrix();
      }

      var centerPoint = this.get('centerAndZoomCalculator.centerPoint');

      // Draw boxes for systems
      systems.forEach(function (system) {

        let isRequestObject = system.get('name') === "Requests";

        if (!isRequestObject) {

          var extensionX = system.get('width') * scaleFactor.width;
          var extensionY = system.get('height') * scaleFactor.height;

          var centerX = system.get('positionX') + extensionX - centerPoint.x;
          var centerY = system.get('positionY') - extensionY - centerPoint.y;

          var systemMesh = self.createPlane(system);
          systemMesh.position.set(centerX, centerY, system.get('positionZ'));
          self.get('scene').add(systemMesh);
          system.set('threeJSModel', systemMesh);

          const textColor =
            self.get('configuration.landscapeColors.systemText');

          self.get('labeler').saveTextForLabeling(null, systemMesh, textColor);

          // Add respective open / close symbol
          systemMesh.geometry.computeBoundingBox();
          const bboxSystem = systemMesh.geometry.boundingBox;

          let collapseSymbol = null;

          if (system.get('opened')) {
            if (self.get('closeSymbol')) {
              collapseSymbol = self.get('closeSymbol').clone();
            }
          } else {
            if (self.get('openSymbol')) {
              collapseSymbol = self.get('openSymbol').clone();
            }
          }

          if (collapseSymbol) {
            collapseSymbol.position.x = bboxSystem.max.x - 0.35;
            collapseSymbol.position.y = bboxSystem.max.y - 0.35;
            collapseSymbol.position.z = systemMesh.position.z + 0.0001;
            systemMesh.add(collapseSymbol);
          }


        }

        const nodegroups = system.get('nodegroups');

        var nodegroupMesh;

        // Draw boxes for nodegroups
        nodegroups.forEach(function (nodegroup) {

          if (!nodegroup.get('visible')) {
            return;
          }

          if (!isRequestObject) {

            extensionX = nodegroup.get('width') * scaleFactor.width;
            extensionY = nodegroup.get('height') * scaleFactor.height;

            centerX = nodegroup.get('positionX') + extensionX - centerPoint.x;
            centerY = nodegroup.get('positionY') - extensionY - centerPoint.y;

            nodegroupMesh = self.createPlane(nodegroup);
            nodegroupMesh.position.set(centerX, centerY,
              nodegroup.get('positionZ') + 0.001);

            // Add respective open / close symbol
            nodegroupMesh.geometry.computeBoundingBox();
            const bboxNodegroup = nodegroupMesh.geometry.boundingBox;

            let collapseSymbol = null;

            if (nodegroup.get('opened')) {
              if (self.get('closeSymbol')) {
                collapseSymbol = self.get('closeSymbol').clone();
              }
            } else {
              if (self.get('openSymbol')) {
                collapseSymbol = self.get('openSymbol').clone();
              }
            }

            if (collapseSymbol) {
              collapseSymbol.position.x = bboxNodegroup.max.x - 0.35;
              collapseSymbol.position.y = bboxNodegroup.max.y - 0.35;
              collapseSymbol.position.z = nodegroupMesh.position.z + 0.0001;
              nodegroupMesh.add(collapseSymbol);
            }
          }

          const nodes = nodegroup.get('nodes');

          // Add box for nodegroup if it contains more than one node
          if (nodes.content.length > 1) {
            self.get('scene').add(nodegroupMesh);
            nodegroup.set('threeJSModel', nodegroupMesh);
          }

          // Draw boxes for nodes
          nodes.forEach(function (node) {

            if (!node.get('visible')) {
              return;
            }

            if (!isRequestObject) {

              extensionX = node.get('width') * scaleFactor.width;
              extensionY = node.get('height') * scaleFactor.height;

              centerX = node.get('positionX') + extensionX - centerPoint.x;
              centerY = node.get('positionY') - extensionY - centerPoint.y;

              var nodeMesh = self.createPlane(node);
              nodeMesh.position.set(centerX, centerY, node.get('positionZ') +
                0.002);

              self.get('scene').add(nodeMesh);
              node.set('threeJSModel', nodeMesh);

            }

            const applications = node.get('applications');

            // Draw boxes for applications
            applications.forEach(function (application) {

              extensionX = application.get('width') * scaleFactor.width;
              extensionY = application.get('height') * scaleFactor.width;

              centerX = application.get('positionX') + extensionX -
                centerPoint.x;

              centerY = application.get('positionY') - extensionY -
                centerPoint.y;

              if (!isRequestObject) {

                var applicationMesh = self.createPlane(application);

                applicationMesh.position.set(centerX, centerY,
                  application.get('positionZ') + 0.003);

                self.get('scene').add(applicationMesh);
                application.set('threeJSModel', applicationMesh);

                // Create logos

                applicationMesh.geometry.computeBoundingBox();

                const logoSize = {
                  width: 0.4,
                  height: 0.4
                };
                const appBBox = applicationMesh.geometry.boundingBox;

                const logoPos = {
                  x: 0,
                  y: 0,
                  z: 0
                };

                const logoRightPadding = logoSize.width * 0.7;

                logoPos.x = appBBox.max.x - logoRightPadding;

                const texturePartialPath = application.get('database') ?
                  'database2' : application.get('programmingLanguage')
                    .toLowerCase();

                self.get('imageLoader').createPicture(logoPos.x, logoPos.y,
                  logoPos.z, logoSize.width, logoSize.height,
                  texturePartialPath, applicationMesh, "label");

                // Create text labels

                let textColor =
                  self.get('configuration.landscapeColors.applicationText');

                self.get('labeler').saveTextForLabeling(null, applicationMesh,
                  textColor);

                textColor = self.get('configuration.landscapeColors.nodeText');
                self.get('labeler').saveTextForLabeling(node.getDisplayName(),
                  nodeMesh, textColor);

              } else {
                // Draw request logo
                self.get('imageLoader').createPicture((centerX + 0.47), centerY, 0,
                  1.6, 1.6, "requests", self.get('scene'), "label");
              }

            });

          });

        });

      });
    } // END if(systems)

    const appCommunications = emberLandscape.get('totalApplicationCommunications');

    const tiles = [];

    let tile;

    if (appCommunications) {

      const color = self.get('configuration.landscapeColors.communication');

      appCommunications.forEach((applicationCommunication) => {

        const points = applicationCommunication.get('points');

        if (points.length > 0) {

          for (var i = 1; i < points.length; i++) {

            const lastPoint = points[i - 1];
            const thisPoint = points[i];

            let tileWay = {
              startPoint: lastPoint,
              endPoint: thisPoint
            };

            let id = tiles.findIndex(isSameTile, tileWay);


            if (id !== -1) {
              tile = tiles[id];
            }
            else {
              id = tiles.length; // Gets a new index

              tile = {
                startPoint: lastPoint,
                endPoint: thisPoint,
                positionZ: 0.0025,
                requestsCache: 0,
                communications: [],
                pipeColor: new THREE.Color(color),
                emberModel: applicationCommunication
              };
              tiles.push(tile);
            }

            tile.communications.push(appCommunications);
            tile.requestsCache = tile.requestsCache +
              applicationCommunication.get('requests');

            tiles[id] = tile;
          }

        }

      });

      addCommunicationLineDrawing(tiles, self.get('scene'));

    }

    // Helper functions //

    function createCollapseSymbols() {

      const material = new THREE.MeshBasicMaterial({
        color: self.get('configuration.landscapeColors.collapseSymbol')
      });


      // Plus symbol

      const labelGeoOpen = new THREE.TextBufferGeometry("+", {
        font: self.get('font'),
        size: 0.35,
        height: 0
      });

      const labelMeshOpen = new THREE.Mesh(labelGeoOpen, material);
      self.set('openSymbol', labelMeshOpen);

      // Minus symbol

      const labelGeoClose = new THREE.TextBufferGeometry("-", {
        font: self.get('font'),
        size: 0.35,
        height: 0
      });

      const labelMeshClose = new THREE.Mesh(labelGeoClose, material);
      self.set('closeSymbol', labelMeshClose);
    }

    // This function is only neccessary to find the right index
    function isSameTile(tile) {
      return checkEqualityOfPoints(this.endPoint, tile.endPoint) &&
        checkEqualityOfPoints(this.startPoint, tile.startPoint);
    }

    function addCommunicationLineDrawing(tiles, parent) {

      const requestsList = {};

      tiles.forEach((tile) => {
        requestsList[tile.requestsCache] = 0;
      });

      const categories = getCategories(requestsList, true);

      for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        tile.lineThickness = 0.7 * categories[tile.requestsCache] + 0.1;
        self.createLine(tile, tiles, parent, centerPoint);
      }

      function getCategories(list, linear) {

        if (linear) {
          useLinear(list);
        }
        else {
          useThreshholds(list);
        }

        return list;

        // Inner helper functions

        function useThreshholds(list) {
          let max = 1;

          for (let request in list) {
            request = parseInt(request);
            max = (request > max) ? request : max;
          }

          const oneStep = max / 3.0;

          const t1 = oneStep;
          const t2 = oneStep * 2;

          for (let request in list) {
            let categoryValue = getCategoryFromValues(request, t1, t2);
            list[request] = categoryValue;
          }

        }

        function getCategoryFromValues(value, t1, t2) {
          value = parseInt(value);
          if (value === 0) {
            return 0.0;
          } else if (value === 1) {
            return 1.0;
          }

          if (value <= t1) {
            return 2.0;
          } else if (value <= t2) {
            return 3.0;
          } else {
            return 4.0;
          }
        }

        function useLinear(list) {
          let max = 1;

          for (let request in list) {
            request = parseInt(request);
            max = (request > max) ? request : max;
          }

          for (let requests in list) {
            let help = parseInt(requests);
            list[requests] = help / max;
          }

        }

      } // END getCategories

    } // END addCommunicationLineDrawing

    function checkEqualityOfPoints(p1, p2) {
      let x = Math.abs(p1.x - p2.x) <= 0.01;
      let y = Math.abs(p1.y - p2.y) <= 0.01;

      return (x && y);
    }

    this.get('labeler').drawTextLabels(self.get('font'),
      self.get('configuration'));


    this.debug("Landscape loaded");

  }, // END populateScene

  createLine(tile, tiles, parent, centerPoint) {

    let firstVector = new THREE.Vector3(tile.startPoint.x - centerPoint.x,
      tile.startPoint.y - centerPoint.y, tile.positionZ);
    let secondVector = new THREE.Vector3(tile.endPoint.x - centerPoint.x,
      tile.endPoint.y - centerPoint.y, tile.positionZ);

    // New line approach (draw planes)

    // Euclidean distance
    const lengthPlane = Math.sqrt(
      Math.pow((firstVector.x - secondVector.x), 2) +
      Math.pow((firstVector.y - secondVector.y), 2));

    const geometryPlane = new THREE.PlaneGeometry(lengthPlane,
      tile.lineThickness * 0.4);

    const materialPlane = new THREE.MeshBasicMaterial({ color: tile.pipeColor });
    const plane = new THREE.Mesh(geometryPlane, materialPlane);

    let isDiagonalPlane = false;
    const diagonalPos = new THREE.Vector3();

    // Rotate plane => diagonal plane (diagonal commu line)
    if (Math.abs(firstVector.y - secondVector.y) > 0.1) {
      isDiagonalPlane = true;

      const distanceVector = new THREE.Vector3()
        .subVectors(secondVector, firstVector);

      plane.rotateZ(Math.atan2(distanceVector.y, distanceVector.x));

      diagonalPos.copy(distanceVector).multiplyScalar(0.5).add(firstVector);
    }

    // Set plane position
    if (!isDiagonalPlane) {
      const posX = firstVector.x + (lengthPlane / 2);
      const posY = firstVector.y;
      const posZ = firstVector.z;

      plane.position.set(posX, posY, posZ);
    }
    else {
      plane.position.copy(diagonalPos);
    }

    plane.userData['model'] = tile.emberModel;

    parent.add(plane);

  }, // END createLine

  createPlane(model) {

    const emberModelName = model.constructor.modelName;

    const material = new THREE.MeshBasicMaterial({
      color: this.get('configuration.landscapeColors.' + emberModelName)
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(model.get('width'),
      model.get('height')), material);

    plane.userData['model'] = model;
    return plane;

  },

  initInteraction() {

    const canvas = this.get('canvas');
    const raycastObjects = this.get('scene').children;
    const camera = this.get('camera');
    const webglrenderer = this.get('webglrenderer');

    // Init interaction objects

    this.get('interaction').setupInteraction(canvas, camera, webglrenderer,
      raycastObjects);

    // Set listeners

    this.set('listeners2', new Set());

    this.get('listeners2').add([
      'interaction',
      'redrawScene',
      () => {
        this.cleanAndUpdateScene();
      }
    ]);

    this.get('listeners2').add([
      'interaction',
      'showApplication',
      (emberModel) => {
        this.set('landscapeRepo.latestApplication', emberModel);
        this.set('landscapeRepo.replayApplication', emberModel);
      }
    ]);

    this.get('listeners2').add([
      'renderingService',
      'redrawScene',
      () => {
        this.cleanAndUpdateScene();
      }
    ]);

    // start subscriptions
    this.get('listeners2').forEach(([service, event, listenerFunction]) => {
        this.get(service).on(event, listenerFunction);
    });

  },

});
