import Ember from 'ember';
import RenderingCore from './rendering-core';

import Raycaster from '../utils/raycaster';
import THREE from "npm:three";

import applyCityLayout from '../utils/application-rendering/city-layouter';
import Interaction from '../utils/application-rendering/interaction';
import Labeler from '../utils/application-rendering/labeler';
import {createFoundation, removeFoundation} from 
  '../utils/application-rendering/foundation-builder';


 /**
 * Renderer for application visualization.
 *
 * @class Application-Rendering
 * @extends Rendering-Core
 */
export default RenderingCore.extend({

  store: Ember.inject.service('store'),
  landscapeRepo: Ember.inject.service("repos/landscape-repository"),

  application3D: null,

  applicationID: null,

  viewCenterPoint: null,

  raycaster: null,
  interactionHandler: null,
  labeler: null,

  oldRotation: {x: 0, y: 0},
  initialSetupDone: false,

  interaction: null,

  // @Override  
  initRendering() {
    this._super(...arguments);

    const self = this;

    this.debug("init application rendering");
    
    this.get('camera').position.set(0, 0, 100);

    // dummy object for raycasting
    this.set('application3D', new THREE.Object3D());

    if (!this.get('labeler')) {
      this.set('labeler', Labeler.create());
    }

    if (!this.get('interaction')) {
      this.set('interaction', Interaction.create());
    }

    if (!this.get('raycaster')) {
      this.set('raycaster', Raycaster.create());
      this.set('raycaster.objectCatalog', 'applicationObjects');
    }

    // init landscape exchange
    this.get('landscapeRepo').on("updated", function() {
      if(self.get('initDone')) {
        self.preProcessEntity();
        self.cleanAndUpdateScene();
      }
    });

    this.initInteraction();

    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.get('scene').add(spotLight);

    const light = new THREE.AmbientLight(
    new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);

    // handle window resize
    this.on('resized', function () {
      self.set('viewCenterPoint', null);
      self.cleanAndUpdateScene();
    });
  },


  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup application rendering");

    // remove foundation for re-rendering
    removeFoundation(this.get('landscapeRepo.latestApplication'), this.get('store'));

    this.set('applicationID', null);    
    this.set('application3D', null);  

    this.get('interaction').removeHandlers();

    this.get('landscapeRepo').off("updated");
  },


  // @Override
  cleanAndUpdateScene() {
    this._super(...arguments);

    this.debug("clean application rendering");

    // save old rotation
    this.set('oldRotation', this.get('application3D').rotation);

    // remove foundation for re-rendering
    removeFoundation(this.get('landscapeRepo.latestApplication'), this.get('store'));

    this.populateScene();
  },


  // @Override
  preProcessEntity() {
    const application = this.get('store').peekRecord('application', 
      this.get('applicationID'));
    this.set('landscapeRepo.latestApplication', application);
  },


  // @Override
  populateScene() {
    this._super(...arguments);
    this.debug("populate application rendering");

    const emberApplication = this.get('landscapeRepo.latestApplication');

    if(!emberApplication) {
      return;
    }

    this.set('applicationID', emberApplication.id);

    const self = this;

    const foundation = createFoundation(emberApplication, this.get('store'));

    applyCityLayout(emberApplication);

    this.set('application3D', new THREE.Object3D());
    this.set('application3D.userData.model', emberApplication);

    // update raycasting children, because of new entity  
    this.get('interaction').updateEntities(this.get('application3D'));  

    // apply (possible) highlighting
    this.get('interaction').applyHighlighting();

    if(!this.get('viewCenterPoint')) {
      this.set('viewCenterPoint', calculateAppCenterAndZZoom(emberApplication));
    }

    const viewCenterPoint = this.get('viewCenterPoint');

    const accuCommunications = emberApplication.get('communicationsAccumulated');

    accuCommunications.forEach((commu) => {
      if (commu.source !== commu.target) {
        if (commu.startPoint && commu.endPoint) {

          const start = new THREE.Vector3();
          start.subVectors(commu.startPoint, viewCenterPoint);
          start.multiplyScalar(0.5);
          
          const end = new THREE.Vector3();
          end.subVectors(commu.endPoint, viewCenterPoint);
          end.multiplyScalar(0.5);

          if(start.y >= end.y) {
            end.y = start.y;
          } else {
            start.y = end.y;
          }

          let transparent = false;
          let opacityValue = 1.0;

          if(commu.state === "TRANSPARENT") {
            transparent = true;
            opacityValue = 0.4;
          }

          const material = new THREE.MeshBasicMaterial({
            color : new THREE.Color(0xf49100),
            opacity : opacityValue,
            transparent : transparent
          });

          const thickness = commu.pipeSize * 0.3;

          const pipe = cylinderMesh(start, end, material, thickness);

          pipe.userData.model = commu;

          self.get('application3D').add(pipe);

        }
      }
    });

    function cylinderMesh(pointX, pointY, material, thickness) {
      const direction = new THREE.Vector3().subVectors(pointY, pointX);
      const orientation = new THREE.Matrix4();
      orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
      orientation.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1,
          0, 0, -1, 0, 0, 0, 0, 0, 1));
      const edgeGeometry = new THREE.CylinderGeometry(thickness, thickness,
          direction.length(), 20, 1);
      const pipe = new THREE.Mesh(edgeGeometry, material);
      pipe.applyMatrix(orientation);

      pipe.position.x = (pointY.x + pointX.x) / 2.0;
      pipe.position.y = (pointY.y + pointX.y) / 2.0;
      pipe.position.z = (pointY.z + pointX.z) / 2.0;
      return pipe;
    }

    addComponentToScene(foundation, 0xCECECE);

    self.scene.add(self.get('application3D'));

    if(self.get('initialSetupDone')) {
      // apply old rotation
      self.set('application3D.rotation.x', self.get('oldRotation.x'));
      self.set('application3D.rotation.y', self.get('oldRotation.y'));
    }
    else {
      self.resetRotation();
      self.set('oldRotation.x', self.get('application3D').rotation.x);
      self.set('oldRotation.y', self.get('application3D').rotation.y);
      self.set('initialSetupDone', true);
    }

    // Helper functions   


    function addComponentToScene(component, color) {

      const grey = 0xCECECE;
      const lightGreen = 0x00BB41;
      const darkGreen = 0x169E2B;
      const clazzColor = 0x3E14A0;
      const redHighlighted = 0xFF0000;

      createBox(component, color, false);

      component.set('color', color);

      const clazzes = component.get('clazzes');
      const children = component.get('children');

      clazzes.forEach((clazz) => {
        if (component.get('opened')) {
          if (clazz.get('highlighted')) {
             createBox(clazz, redHighlighted, true);
          } else {
             createBox(clazz, clazzColor, true);
          }
        }
      });

      children.forEach((child) => {
        if (component.get('opened')) {
          if (child.get('opened')) {
            if(child.get('highlighted')) {
                addComponentToScene(child, redHighlighted);
            }            
            else if(component.get('color') === grey) {
              addComponentToScene(child, lightGreen);
            }
            else if(component.get('color') === darkGreen) {
              addComponentToScene(child, lightGreen);
            } else {            
              addComponentToScene(child, darkGreen);
            }
          } 
          else {
            if(child.get('highlighted')) {
              addComponentToScene(child, redHighlighted);
            }
            else if(component.get('color') === grey) {
              addComponentToScene(child, lightGreen);
            }
            else if(component.get('color') === darkGreen) {            
              addComponentToScene(child, lightGreen);
            } else {              
              addComponentToScene(child, darkGreen);
            }
          }
        }
      });
    } // END addComponentToScene



    function createBox(component, color, isClass) {

      let centerPoint = new THREE.Vector3(component.get('positionX') + component.get('width') / 2.0, component.get('positionY') + component.get('height') / 2.0,
        component.get('positionZ') + component.get('depth') / 2.0);

      const material = new THREE.MeshLambertMaterial();
      material.color = new THREE.Color(color);

      centerPoint.sub(viewCenterPoint);

      centerPoint.multiplyScalar(0.5);

      const extension = new THREE.Vector3(component.get('width') / 2.0, component.get('height') / 2.0, component.get('depth') / 2.0);
      const cube = new THREE.BoxGeometry(extension.x, extension.y, extension.z);

      const mesh = new THREE.Mesh(cube, material);

      mesh.position.set(centerPoint.x, centerPoint.y, centerPoint.z);
      mesh.updateMatrix();

      mesh.userData.model = component;
      mesh.userData.name = component.get('name');
      mesh.userData.foundation = component.get('foundation');
      mesh.userData.type = isClass ? 'clazz' : 'package';

      mesh.userData.opened = component.get('opened');

      self.get('labeler').createLabel(mesh, self.get('application3D'), 
        self.get('font'));

      self.get('application3D').add(mesh);

    } // END createBox


    function calculateAppCenterAndZZoom(emberApplication) {

      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;
      const MIN_Z = 4;
      const MAX_Z = 5;

      const foundation = emberApplication.get('components').objectAt(0);

      const rect = [];
      rect.push(foundation.get('positionX'));
      rect.push(foundation.get('positionY') + foundation.get('width'));
      rect.push(foundation.get('positionY'));
      rect.push(foundation.get('positionY') + foundation.get('height'));
      rect.push(foundation.get('positionZ'));
      rect.push(foundation.get('positionZ') + foundation.get('depth'));

      //const SPACE_IN_PERCENT = 0.02;

      const viewCenterPoint = new THREE.Vector3(rect.get(MIN_X) + ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
        rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0),
        rect.get(MIN_Z) + ((rect.get(MAX_Z) - rect.get(MIN_Z)) / 2.0));

      /*let requiredWidth = Math.abs(rect.get(MAX_X) - rect.get(MIN_X));
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
      camera.position.x = 0;
      camera.position.y = 0;
      camera.updateProjectionMatrix();*/

      return viewCenterPoint;

    }



  }, // END populateScene


  resetRotation() {
    const rotationX = 0.65;
    const rotationY = 0.80;

    this.set('application3D.rotation.x', rotationX);
    this.set('application3D.rotation.y', rotationY);
  },


  initInteraction() {

    const self = this;

    const canvas = this.get('canvas');
    const camera = this.get('camera');
    const webglrenderer = this.get('webglrenderer');
    const raycaster = this.get('raycaster');

    // init interaction objects    

    this.get('interaction').setupInteraction(canvas, camera, webglrenderer, raycaster, 
      this.get('application3D'));

    // set listeners

    this.get('interaction').on('redrawScene', function() {
      self.cleanAndUpdateScene();
    });



  }, // END initInteraction
  
});
