import RenderingCore from './rendering-core';
import Ember from 'ember';
import Hammer from "npm:hammerjs";

 /**
 * Renderer for landscape visualization.
 *
 * @class Landscape-Rendering
 * @extends Rendering-Core
 */
export default RenderingCore.extend({

  hammerManager: null,

  klayLayouter: Ember.inject.service("klay-layouter"),

  centerPoint : null,

  logos: {},

  // @Override
  initRendering() {
    this._super(...arguments);

    this.initInteraction();

    var dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.get('scene').add(dirLight);
  },

  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup landscape rendering");

    this.get('hammerManager').off();
    this.set('hammerManager', null);
  },

  // @Override
  cleanAndUpdateScene(emberLandscape) {
    this._super(...arguments);

    this.debug("clean and populate landscape rendering");

    this.populateScene(emberLandscape);
  },

  // @Override
  populateScene(emberLandscape) {

    this.get('klayLayouter').applyLayout(emberLandscape);

    this._super(...arguments);

    const self = this;

    const systems = emberLandscape.get('systems');

    const scaleFactor = {
      width: 0.5,
      height: 0.5
    };

    let isRequestObject = false;

    if (systems) {

      if(!this.get('centerPoint')) {
        this.set('centerPoint', calculateLandscapeCenterAndZZoom(emberLandscape));
      }      

      var centerPoint = this.get('centerPoint'); 

      systems.forEach(function(system) {

        isRequestObject = false;

        if (!isRequestObject && system.get('name') === "Requests") {
          isRequestObject = true;
        }

        if (!isRequestObject) {

          const {
            x,
            y,
            z
          } = system.get('backgroundColor');

          var extensionX = system.get('width') * scaleFactor.width;
          var extensionY = system.get('height') * scaleFactor.height;

          var centerX = system.get('positionX') + extensionX - centerPoint.x;
          var centerY = system.get('positionY') - extensionY - centerPoint.y;

          var systemMesh = addPlane(centerX, centerY, system.get('positionZ'), system.get('width'),
            system.get('height'), new THREE.Color(x, y, z), null, null, self.get('scene'), system);

          system.set('threeJSModel', systemMesh);

        }

        const nodegroups = system.get('nodegroups');

        nodegroups.forEach(function(nodegroup) {

          if (!isRequestObject) {

            const {
              x,
              y,
              z
            } = nodegroup.get('backgroundColor');

            extensionX = nodegroup.get('width') * scaleFactor.width;
            extensionY = nodegroup.get('height') * scaleFactor.height;

            centerX = nodegroup.get('positionX') + extensionX - centerPoint.x;
            centerY = nodegroup.get('positionY') - extensionY - centerPoint.y;

            var nodegroupMesh = addPlane(centerX, centerY, nodegroup.get('positionZ') + 0.01, nodegroup.get('width'),
              nodegroup.get('height'), new THREE.Color(x, y, z), null, null, self.get('scene'), nodegroup);

            nodegroup.set('threeJSModel', nodegroupMesh);

          }

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            if (!isRequestObject) {

              const {
                x,
                y,
                z
              } = node.get('color');

              extensionX = node.get('width') * scaleFactor.width;
              extensionY = node.get('height') * scaleFactor.height;

              centerX = node.get('positionX') + extensionX - centerPoint.x;
              centerY = node.get('positionY') - extensionY - centerPoint.y;

              var nodeMesh = addPlane(centerX, centerY, node.get('positionZ') + 0.02, node.get('width'),
                node.get('height'), new THREE.Color(x, y, z), null, null, self.get('scene'), node);

              node.set('threeJSModel', nodeMesh);

            }

            const applications = node.get('applications');

            applications.forEach(function(application) {

              extensionX = application.get('width') * scaleFactor.width;
              extensionY = application.get('height') * scaleFactor.width;

              centerX = application.get('positionX') + extensionX - centerPoint.x;
              centerY = application.get('positionY') - extensionY - centerPoint.y;

              if (!isRequestObject) {

                const {
                  x,
                  y,
                  z
                } = application.get('backgroundColor');

                var applicationMesh = addPlane(centerX, centerY, application.get('positionZ') + 0.03,
                  application.get('width'), application.get('height'), new THREE.Color(x, y, z), new THREE.Color(0x6D4FB4), null,
                  self.get('scene'), application);

                application.set('threeJSModel', applicationMesh);

                // create logos       

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
                  'database2' : application.get('programmingLanguage').toLowerCase();

                addPlane(logoPos.x, logoPos.y, logoPos.z,
                  logoSize.width, logoSize.height, new THREE.Color(1, 0, 0), null,
                  texturePartialPath, applicationMesh, "label");

                // create labels

                const font = self.get('font');

                let padding = {
                  left: 0.0,
                  right: -logoRightPadding,
                  top: 0.0,
                  bottom: 0.0
                };
                let labelMesh = createLabel(font, 0.2, null, applicationMesh,
                  padding, 0xffffff, logoSize, "center", application);

                applicationMesh.add(labelMesh);

                padding = {
                  left: 0.0,
                  right: 0.0,
                  top: 0.0,
                  bottom: 0.2
                };

                labelMesh = createLabel(font, 0.15, node.getDisplayName(), nodeMesh,
                  padding, 0xffffff, {
                    width: 0.0,
                    height: 0.0
                  }, "min", node);

                nodeMesh.add(labelMesh);

                padding = {
                  left: 0.0,
                  right: 0.0,
                  top: -0.4,
                  bottom: 0.0
                };
                labelMesh = createLabel(font, 0.2, null, systemMesh,
                  padding, 0x00000, {
                    width: 0.0,
                    height: 0.0
                  }, "max", system);

                systemMesh.add(labelMesh);



              } else {
                // draw request logo
                addPlane(centerX, centerY, 0,
                  1.6, 1.6, new THREE.Color(1, 0, 0), null,
                  "requests", self.get('scene'), "label");
              }

            });

          });

        });

      });
    } // END if(systems)

    const appCommunication = emberLandscape.get('applicationCommunication');

    const communicationsAccumulated = [];

    var accum;

    if (appCommunication) {
      appCommunication.forEach((communication) => {

        var points = communication.get('points');

        if (points.length !== 0) {

          const {
            x,
            y,
            z
          } = communication.get('pipeColor');

          accum = {
            tiles: [],
            pipeColor: new THREE.Color(x, y, z)
          };
          communicationsAccumulated.push(accum);

          for (var i = 1; i < points.length; i++) {

            var lastPoint = points[i - 1];
            var thisPoint = points[i];

            var tile = seekOrCreateTile(lastPoint, thisPoint, communicationsAccumulated, 0.02);
            tile.communications.push(appCommunication);
            tile.requestsCache = tile.requestsCache + communication.get('requests');

            accum.tiles.push(tile);
          }

        }

      });

      addCommunicationLineDrawing(communicationsAccumulated, self.get('scene'));

    }


    // Helper functions //

    function addCommunicationLineDrawing(communicationsAccumulated, parent) {

      const requestsList = [];    

      communicationsAccumulated.forEach((accum) => {

        accum.tiles.forEach((tile) => {
               
          requestsList.push(tile.requestsCache);

          });
      });

      const categories = getCategories(requestsList, true);

      communicationsAccumulated.forEach((accum) => {        
        for (var i = 0; i < accum.tiles.length; i++) {
          var tile = accum.tiles[i];
          tile.lineThickness = 0.07 * categories[tile.requestsCache] + 0.01;
        }

        createAccumLine(accum, parent);

      });


   


      ///
      

      function getCategories(list, linear) {
        const result = [];

        if (list.length === 0) {
          return result;
        }

        list.sort();

        if (linear) {
          const listWithout0 = [];

          list.forEach((entry) => {
            if (entry !== 0){
              listWithout0.push(entry);
            }
          });

          if (listWithout0.length === 0) {
            result.push({0: 0.0});
            return result;
          }        
          useLinear(listWithout0, list, result);
        } 
        else {
          const listWithout0And1 = [];

          let outsideCounter = 0;
          let insideCounter = 0;

          list.forEach((entry) => {
            outsideCounter++;
            if (entry !== 0 && entry !== 1){
              listWithout0And1.push(entry);
              insideCounter++;
            }
          });

          if (listWithout0And1.length === 0) {
            result.push({0: 0.0});
            result.push({1: 1.0});
            return result;
          }

          useThreshholds(listWithout0And1, list, result);
        }

        return result;



        // inner helper functions

        function useThreshholds(listWithout0And1, list, result) {
          let max = 1;

          listWithout0And1.forEach((value) => {
            if (value > max) {
              max = value;
            }
          });

          const oneStep = max / 3.0;

          const t1 = oneStep;
          const t2 = oneStep * 2;

          list.forEach((entry) => {
            let categoryValue = getCategoryFromValues(entry, t1, t2);
            result[entry] = categoryValue;
          });

        }


        function getCategoryFromValues(value, t1, t2) {
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


        function useLinear(listWithout0, list, result) {
          let max = 1;
          let secondMax = 1;

          listWithout0.forEach((value) => {
            if (value > max) {
              secondMax = max;
              max = value;
            }
          });   

          const oneStep = secondMax / 4.0;

          const t1 = oneStep;
          const t2 = oneStep * 2;
          const t3 = oneStep * 3;

          list.forEach((entry) => {
            const categoryValue = getCategoryFromLinearValues(entry, t1, t2, t3);
            result[entry] = categoryValue;
          }); 

        }


        function getCategoryFromLinearValues(value, t1, t2, t3) {
          if (value <= 0) {
            return 0;
          } else if (value <= t1) {
            return 1.5;
          } else if (value <= t2) {
            return 2.5;
          } else if (value <= t3) {
            return 4.0;
          } else {
            return 6.5;
          }
        }



      } // END getCategories

      ///
      
    }


    function checkEqualityOfPoints(p1, p2) {
      var x = p1.x === p2.x;
      var y = p1.y === p2.y;
      var z = p1.z === p2.z;

      return x && y && z;
    }


    function seekOrCreateTile(start, end,
      communicationAccumulated, lineZvalue) {

      communicationAccumulated.forEach((accum) => {

        accum.tiles.forEach((tile) => {

          if (checkEqualityOfPoints(tile.startPoint, start) &&
            checkEqualityOfPoints(tile.endPoint, end)) {
            //console.log("old tile");
            return tile;
          }

        });

      });

      //console.log("new tile");
      var tile = {
        startPoint: start,
        endPoint: end,
        positionZ: lineZvalue,
        requestsCache: 0,
        communications: []
      };
      return tile;
    }


    function createAccumLine(accum, parent) {

      if (accum.tiles.length !== 0) {

        var firstTile = accum.tiles[0];

        const material = new MeshLineMaterial({
          color: accum.pipeColor,
          lineWidth: firstTile.lineThickness * 0.4
        });

        const geometry = new THREE.Geometry();

        geometry.vertices.push(
          new THREE.Vector3(firstTile.startPoint.x - centerPoint.x,
            firstTile.startPoint.y - centerPoint.y, firstTile.positionZ + 0.001)
        );

        accum.tiles.forEach((tile) => {
          geometry.vertices.push(
            new THREE.Vector3(tile.endPoint.x - centerPoint.x,
              tile.endPoint.y - centerPoint.y, tile.positionZ + 0.001)
          );
        });

        const line = new MeshLine();
        line.setGeometry(geometry);

        var lineMesh = new THREE.Mesh(line.geometry, material);

        parent.add(lineMesh);

      }
    }


    function createLabel(font, size, textToShow, parent, padding, color,
      logoSize, yPosition, model) {

      const text = textToShow ? textToShow :
        parent.userData.model.get('name');

      let labelGeo = new THREE.TextGeometry(
        text, {
          font: font,
          size: size,
          height: 0
        }
      );

      labelGeo.computeBoundingBox();
      var bboxLabel = labelGeo.boundingBox;
      var labelWidth = bboxLabel.max.x - bboxLabel.min.x;

      //console.log("label", text);

      //console.log("labelMax", bboxLabel.max.x);
      //console.log("labelMin", bboxLabel.min.x);
      //console.log("labelWidth", labelWidth);

      parent.geometry.computeBoundingBox();
      const bboxParent = parent.geometry.boundingBox;

      var boxWidth = Math.abs(bboxParent.max.x) +
        Math.abs(bboxParent.min.x);

      //console.log("pre-boxwidth", boxWidth);

      boxWidth = boxWidth - logoSize.width + padding.left + padding.right;

      //console.log("boxwidth", boxWidth);

      // We can't set the size of the labelGeo. Hence we need to scale it.

      // upper scaling factor
      var i = 1.0;

      // scale until text fits into parent bounding box
      while ((labelWidth > boxWidth) && (i > 0.1)) {
        // TODO time complexity: linear -> Do binary search alike approach?                        
        i -= 0.05;
        labelGeo.scale(i, i, i);
        // update the boundingBox
        labelGeo.computeBoundingBox();
        bboxLabel = labelGeo.boundingBox;
        labelWidth = bboxLabel.max.x - bboxLabel.min.x;
        if (text === "PostgreSQL") {
          //console.log("boxWidth", boxWidth);
          //console.log("labelWidth", labelWidth);
        }
      }

      const labelHeight = bboxLabel.max.y - bboxLabel.min.y;

      if (text === "PostgreSQL") {
        //console.log(labelHeight);
      }
      //console.log("labelHeight", labelHeight);

      let posX = (-labelWidth / 2.0) + padding.left + padding.right;

      let posY = padding.bottom + padding.top;

      if (yPosition === "max") {
        posY += bboxParent.max.y;
      } else if (yPosition === "min") {
        posY += bboxParent.min.y;
      } else if (yPosition === "center") {
        posY -= (labelHeight / 2.0);
      }

      const material = new THREE.MeshBasicMaterial({
        color: color
      });

      const labelMesh = new THREE.Mesh(labelGeo, material);

      labelMesh.position.set(posX, posY, 0.005);

      labelMesh.userData['type'] = 'label';
      labelMesh.userData['model'] = model;

      return labelMesh;
    }


    function addPlane(x, y, z, width, height, color1, color2, textureName, parent, model) {
      
      if (textureName) {

        if(self.get('logos')[textureName]) {

          const material = new THREE.MeshBasicMaterial({
            map: self.get('logos')[textureName],
            transparent: true
          });

          const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
              material);
          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;

        } 
        else {

          new THREE.TextureLoader().load('images/logos/' + textureName + '.png', (texture) => {

            self.get('logos')[textureName] = texture;

            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true
            });
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
              material);
            plane.position.set(x, y, z);
            parent.add(plane);
            plane.userData['model'] = model;
            return plane;
          });

        }

      } 
      // regular plane (one color or color gradient)
      else {

        if(!color2) {
          const material = new THREE.MeshBasicMaterial({
            color: color1
          });
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
            material);
          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;
        } 
        else {

          // create gradient texture
          const canvas = document.createElement( 'canvas' );
          canvas.width = 16;
          canvas.height = 16;

          const ctx = canvas.getContext("2d");

          const grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
          grd.addColorStop(0.2, 'rgba(72,26,180,1)');
          grd.addColorStop(1, 'rgba(101,68,180,1)');

          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const gradientTexture = new THREE.Texture(canvas);
          gradientTexture.needsUpdate = true;
          gradientTexture.minFilter = THREE.LinearFilter;

          // apply texture too material and create mesh
          const geometry = new THREE.PlaneGeometry(width, height);

          const material = new THREE.MeshBasicMaterial({      
            map: gradientTexture
          });

          const plane = new THREE.Mesh(geometry, material);

          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;

        }

      } 

    }

    function calculateLandscapeCenterAndZZoom(emberLandscape) {

      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;

      const rect = getLandscapeRect(emberLandscape);
      const SPACE_IN_PERCENT = 0.02;

      let requiredWidth = Math.abs(rect.get(MAX_X) - rect.get(MIN_X));
      requiredWidth += requiredWidth * SPACE_IN_PERCENT;

      let requiredHeight = Math.abs(rect.get(MAX_Y) - rect.get(MIN_Y));
      requiredHeight += requiredHeight * SPACE_IN_PERCENT;

      const viewPortSize = self.get('webglrenderer').getSize();

      let viewportRatio = viewPortSize.width / viewPortSize.height;

      const newZ_by_width = requiredWidth / viewportRatio;
      const newZ_by_height = requiredHeight;

      const center = new THREE.Vector3(rect.get(MIN_X) + ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
        rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0), 0);

      const camera = self.get('camera');

      camera.position.z = Math.max(Math.max(newZ_by_width, newZ_by_height), 10.0);
      camera.updateProjectionMatrix();

      return center;

    }


    function getLandscapeRect(emberLandscape) {

      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;

      let rect = [];
      rect.push(Number.MAX_VALUE);
      rect.push(-Number.MAX_VALUE);
      rect.push(Number.MAX_VALUE);
      rect.push(-Number.MAX_VALUE);

      const systems = emberLandscape.get('systems');

      if (systems.length === 0) {
        rect[MIN_X] = 0.0;
        rect[MAX_X] = 1.0;
        rect[MIN_Y] = 0.0;
        rect[MAX_Y] = 1.0;
      } else {
        systems.forEach((system) => {
          getMinMaxFromQuad(system, rect);

          const nodegroups = system.get('nodegroups');
          nodegroups.forEach((nodegroup) => {

            const nodes = nodegroup.get('nodes');
            nodes.forEach((node) => {
              getMinMaxFromQuad(node, rect);
            });

          });

        });
      }

      return rect;

    }


    function getMinMaxFromQuad(drawnodeentity, rect) {

      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;


      const curX = drawnodeentity.get('positionX');
      const curY = drawnodeentity.get('positionY');

      if (curX < rect[MIN_X]) {
        rect[MIN_X] = curX;
      }
      if (rect[MAX_X] < curX + drawnodeentity.get('width')) {
        rect[MAX_X] = curX + drawnodeentity.get('width');
      }
      if (curY > rect[MAX_Y]) {
        rect[MAX_Y] = curY;
      }
      if (rect[MIN_Y] > curY - drawnodeentity.get('height')) {
        rect[MIN_Y] = curY - drawnodeentity.get('height');
      }

    }


  }, // END populateScene

  initInteraction() {

    const self = this;

    let cameraTranslateX, cameraTranslateY = 0;

    const canvas = self.get('canvas');

    this.set('hammerManager', new Hammer.Manager(canvas, {}));

    const hammer = this.get('hammerManager');

    const singleTap = new Hammer.Tap({
      event: 'singletap',
      interval: 250
    });

    const doubleTap = new Hammer.Tap({
      event: 'doubletap',
      taps: 2,
      interval: 250
    });

    const pan = new Hammer.Pan({
      event: 'pan'
    });

    hammer.add([doubleTap, singleTap, pan]);

    doubleTap.recognizeWith(singleTap);
    singleTap.requireFailure(doubleTap);

    hammer
      .on(
        'doubletap',
        function(evt) {

          var mouse = {};

          const renderer = self.get('webglrenderer');

          const event = evt.srcEvent;

          mouse.x = ((event.clientX - 15) / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -((event.clientY - 75) / renderer.domElement.clientHeight) * 2 + 1;

          const intersectedViewObj = raycasting(null, mouse, true);

          if(intersectedViewObj) {

            const emberModel = intersectedViewObj.object.userData.model;
            const emberModelName = emberModel.constructor.modelName;

            self.debug("Name of raycasting goal: ", emberModelName);

            if(emberModelName === "application"){
              console.log(intersectedViewObj);
              // open application rendering
              self.sendAction("showApplication", emberModel);
            } 
            else if (emberModelName === "nodegroup" || emberModelName === "system"){
              emberModel.setOpenedStatus(!emberModel.get('opened'));
              self.cleanAndUpdateScene(self.get('entity'));          
            } 
          }
    });

    hammer.on('panstart', function(evt) {
      const event = evt.srcEvent;

      cameraTranslateX = event.clientX;
      cameraTranslateY = event.clientY;
    });

    hammer.on('panmove', function(evt) {

      const event = evt.srcEvent;

      const renderer = self.get('webglrenderer');
      const camera = self.get('camera');

      var deltaX = event.clientX - cameraTranslateX;
      var deltaY = event.clientY - cameraTranslateY;

      var distanceXInPercent = (deltaX /
        parseFloat(renderer.domElement.clientWidth)) * 100.0;

      var distanceYInPercent = (deltaY /
        parseFloat(renderer.domElement.clientHeight)) * 100.0;

      var xVal = camera.position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(camera.position.z) / 4.0);

      var yVal = camera.position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(camera.position.z) / 4.0);

      camera.position.x = xVal;
      camera.position.y = yVal;

      cameraTranslateX = event.clientX;
      cameraTranslateY = event.clientY;
    });

    // zoom handler

    canvas.addEventListener('mousewheel', onMouseWheelStart, false);

    function onMouseWheelStart(evt) {

      const camera = self.get('camera');

      var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));

      // zoom in
      if (delta > 0) {
        camera.position.z -= delta * 1.5;
      }
      // zoom out
      else {
        camera.position.z -= delta * 1.5;
      }
    }


    // raycasting

    const raycaster = new THREE.Raycaster();

    function raycasting(origin, direction, fromCamera) {

      if (fromCamera) {
        // direction = mouse
        raycaster.setFromCamera(direction, self.get('camera'));
      } else if (origin) {
        raycaster.set(origin, direction);
      }

      // calculate objects intersecting the picking ray (true => recursive)
      const intersections = raycaster.intersectObjects(self.get('scene').children,
        true);
      
      if (intersections.length > 0) {

        const result = intersections.filter(function(obj) {
          if (obj.object.userData.model) {
            const modelName = obj.object.userData.model.constructor.modelName;
            console.log(modelName);
            return (modelName === 'node' ||
              modelName === 'system' ||
              modelName === 'nodegroup' ||
              modelName === 'application');
          }
        });
        if (result.length <= 0) {
          return;
        }

        // debug //

        self.addPlane(result[0].point.x, result[0].point.y, 0, 0.5,
          0.5, new THREE.Color(1, 0, 0), null, null, self.get('scene'), null);

        // end debug //

        return result[0];

      }
    }

  }, // END initInteraction


  // ONLY FOR DEBUGGIN OF RAYCASTING, REMOVE WHEN RAYCASTING IS FIXED
  addPlane(x, y, z, width, height, color1, color2, texture, parent, model) {

      // Invisible plane with logo texture
      if (texture) {

        new THREE.TextureLoader().load('images/logos/' + texture + '.png', (texture) => {
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
          });
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
            material);
          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;
        });


      } 
      // regular plane (one color or gradient)
      else {

        if(!color2) {
          const material = new THREE.MeshBasicMaterial({
            color: color1
          });
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
            material);
          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;
        } 
        else {

          // create gradient texture
          const canvas = document.createElement( 'canvas' );
          canvas.width = 16;
          canvas.height = 16;

          const ctx = canvas.getContext("2d");

          const grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
          grd.addColorStop(0.2, 'rgba(72,26,180,1)');
          grd.addColorStop(1, 'rgba(101,68,180,1)');

          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const gradientTexture = new THREE.Texture(canvas);
          gradientTexture.needsUpdate = true;
          gradientTexture.minFilter = THREE.LinearFilter;

          // apply texture too material and create mesh
          const geometry = new THREE.PlaneGeometry(width, height);

          const material = new THREE.MeshBasicMaterial({      
            map: gradientTexture
          });

          const plane = new THREE.Mesh(geometry, material);

          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['model'] = model;
          return plane;

        }



      }      


    }





});