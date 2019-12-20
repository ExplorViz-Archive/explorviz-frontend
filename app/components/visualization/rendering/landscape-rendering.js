import RenderingCore from './rendering-core';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

import THREE from 'three';

import applyKlayLayout from
  'explorviz-frontend/utils/landscape-rendering/klay-layouter';
import Interaction from
  'explorviz-frontend/utils/landscape-rendering/interaction';
import Labeler from
  'explorviz-frontend/utils/landscape-rendering/labeler';
import CalcCenterAndZoom from
  'explorviz-frontend/utils/landscape-rendering/center-and-zoom-calculator';
import EntityRendering from
  'explorviz-frontend/utils/landscape-rendering/entity-rendering'
import CommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering'

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

  interaction: null,
  labeler: null,
  imageLoader: null,

  renderingService: service("rendering-service"),

  // There's already a property 'listener' in superclass RenderingCore
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
      this.get('camera.position').set(0, 0, 0);
      this.cleanAndUpdateScene();
    };

    this.onUpdated = function () {
      if (this.get('initDone')) {
        this.cleanAndUpdateScene();
      }
    };

    this.onResized = function () {
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

    const backgroundColor = this.get('configuration.landscapeColors.background');
    this.set('scene.background', new THREE.Color(backgroundColor));

    this.initInteraction();

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.get('scene').add(dirLight);
  },

  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup landscape rendering");

    this.set('imageLoader.logos', {});

    this.removeListeners();

    this.get('interaction').removeHandlers();
  },

  removeListeners() {
    // Unsubscribe from all services
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
    // Landscape is passed via the template, e.g., for the replay mode
    if (this.get('landscape') != null | undefined) {
      return this.get('landscape');
    }
    // The visualization route needs to get the landscape directly from the landscapeRepo to work correctly
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

    const emberLandscape = this.getLandscape();

    if (!emberLandscape || !this.get('font')) {
      return;
    }

    applyKlayLayout(emberLandscape);

    let centerPoint = this.updateCameraAndCenterPoint(emberLandscape, this.get('camera'));
    let systems = emberLandscape.get('systems');

    if (systems) {
      // Draw boxes for systems
      systems.forEach((system) => {

        this.renderSystem(system, centerPoint);

        const nodegroups = system.get('nodegroups');

        // Draw boxes for nodegroups
        nodegroups.forEach((nodegroup) => {

          if (!nodegroup.get('visible')) {
            return;
          }

          this.renderNodeGroup(nodegroup, centerPoint);

          const nodes = nodegroup.get('nodes');

          // Draw boxes for nodes
          nodes.forEach((node) => {

            if (!node.get('visible')) {
              return;
            }

            this.renderNode(node, centerPoint);

            const applications = node.get('applications');

            // Draw boxes for applications
            applications.forEach((application) => {

              this.renderApplication(application, centerPoint);
            });

          });

        });

      });
    } // END if(systems)

    const appCommunications = emberLandscape.get('totalApplicationCommunications');

    if (appCommunications) {
      const color = this.get('configuration.landscapeColors.communication');
      const tiles = CommunicationRendering.computeCommunicationTiles(appCommunications, color);

      CommunicationRendering.addCommunicationLineDrawing(tiles, this.get('scene'), centerPoint);
    }

    this.debug("Landscape loaded");
  }, // END populateScene


  renderSystem(system, centerPoint) {
    let isRequestObject = system.get('name') === "Requests";

    if (!isRequestObject) {
      let systemColor = new THREE.Color(this.get('configuration.landscapeColors.system'));
      let labelColor = new THREE.Color(this.get('configuration.landscapeColors.systemText'));

      let centerX = system.get('positionX') + system.get('width') / 2 - centerPoint.x;
      let centerY = system.get('positionY') - system.get('height') / 2 - centerPoint.y;

      let systemMesh = EntityRendering.createPlane(system, systemColor);
      systemMesh.position.set(centerX, centerY, system.get('positionZ'));
      this.get('scene').add(systemMesh);
      system.set('threeJSModel', systemMesh);

      this.get('labeler').drawCollapseSymbol(systemMesh, this.font, labelColor);
      this.get('labeler').drawSystemTextLabel(systemMesh, this.font, labelColor);
    }
  },


  renderNodeGroup(nodegroup, centerPoint) {
    let nodes = nodegroup.get('nodes');

    // Add box for nodegroup if it contains more than one node
    if (nodes.content.length < 2) {
      return;
    }

    let nodegroupMesh;

    let centerX = nodegroup.get('positionX') + nodegroup.get('width') / 2 - centerPoint.x;
    let centerY = nodegroup.get('positionY') - nodegroup.get('height') / 2 - centerPoint.y;

    let nodeGroupColor = new THREE.Color(this.get('configuration.landscapeColors.nodegroup'));
    let labelColor = new THREE.Color(this.get('configuration.landscapeColors.nodeText'));

    nodegroupMesh = EntityRendering.createPlane(nodegroup, nodeGroupColor);
    nodegroupMesh.position.set(centerX, centerY,
      nodegroup.get('positionZ') + 0.001);

    nodegroup.set('threeJSModel', nodegroupMesh);
    this.get('labeler').drawCollapseSymbol(nodegroupMesh, this.get('font'), labelColor);
    this.get('scene').add(nodegroupMesh);
  },


  renderNode(node, centerPoint) {
    let centerX = node.get('positionX') + node.get('width') / 2 - centerPoint.x;
    let centerY = node.get('positionY') - node.get('height') / 2 - centerPoint.y;

    let nodeColor = new THREE.Color(this.get('configuration.landscapeColors.node'));
    let labelColor = new THREE.Color(this.get('configuration.landscapeColors.nodeText'));

    var nodeMesh = EntityRendering.createPlane(node, nodeColor);
    nodeMesh.position.set(centerX, centerY, node.get('positionZ') + 0.002);

    node.set('threeJSModel', nodeMesh);
    this.get('labeler').drawNodeTextLabel(nodeMesh, this.get('font'), labelColor);
    this.get('scene').add(nodeMesh);
  },


  renderApplication(application, centerPoint) {
    let centerX = application.get('positionX') + application.get('width') / 2 -
      centerPoint.x;
    let centerY = application.get('positionY') - application.get('height') / 2 -
      centerPoint.y;

    let applicationColor = new THREE.Color(this.get('configuration.landscapeColors.application'));
    let labelColor = new THREE.Color(this.get('configuration.landscapeColors.applicationText'));

    if (application.get('name') !== "Requests") {

      var applicationMesh = EntityRendering.createPlane(application, applicationColor);

      applicationMesh.position.set(centerX, centerY,
        application.get('positionZ') + 0.003);

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

      this.get('imageLoader').createPicture(logoPos.x, logoPos.y,
        logoPos.z, logoSize.width, logoSize.height,
        texturePartialPath, applicationMesh, "label");

      // Create text labels
      this.get('labeler').drawApplicationTextLabel(applicationMesh, this.get('font'), labelColor);

      this.get('scene').add(applicationMesh);

    } else {
      // Draw request logo
      this.get('imageLoader').createPicture((centerX + 0.47), centerY, 0,
        1.6, 1.6, "requests", this.get('scene'), "label");
    }
  },


  updateCameraAndCenterPoint(emberLandscape, camera) {
    // Calculate new center and update zoom
    let center = CalcCenterAndZoom
      .calculateLandscapeCenterAndZZoom(emberLandscape, this.get('webglrenderer'));

    // Update zoom if camera is at initial position
    if (camera.position.z === 0){
      camera.position.z, center.z;
      camera.updateProjectionMatrix();
    }

    return center;
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

    // Start subscriptions
    this.get('listeners2').forEach(([service, event, listenerFunction]) => {
      this.get(service).on(event, listenerFunction);
    });

  },

});
