import RenderingCore from './rendering-core';
import Ember from 'ember';
import Raycaster from '../utils/raycaster';
import applyCityLayout from '../utils/city-layouter';
import HammerInteraction from '../utils/hammer-interaction';

 /**
 * Renderer for application visualization.
 *
 * @class Application-Rendering
 * @extends Rendering-Core
 */
export default RenderingCore.extend({

  store: Ember.inject.service('store'),

  application3D: null,

  applicationID: null,

  hammerManager: null,

  raycaster: null,
  interactionHandler: null,

  // @Override  
  initRendering() {
    this._super(...arguments);

    this.debug("init application rendering");
    
    this.get('camera').position.set(0, 0, 100);

    // dummy object for raycasting
    this.set('application3D', new THREE.Object3D());

    if (!this.get('raycaster')) {
      this.set('raycaster', Raycaster.create());
    }

    if (!this.get('interactionHandler')) {
      this.set('interactionHandler', HammerInteraction.create());
    }

    this.initInteraction();

    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.get('scene').add(spotLight);

    const light = new THREE.AmbientLight(
    new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);
  },


  // @Override
  cleanup() {
    this._super(...arguments);

    this.debug("cleanup application rendering");

    this.set('applicationID', null);    
    this.set('application3D', null);  

    this.get('hammerManager').off();
    this.set('hammerManager', null);

  },


  // @Override
  cleanAndUpdateScene() {
    this._super(...arguments);

    this.debug("populate application rendering");

    const application = this.get('entity');

    // remove foundation for re-rendering
    
    const foundation = application.get('components').objectAt(0);

    if(foundation.get('foundation')) {
      application.set('components', foundation.get('children'));
      application.get('components').objectAt(0).set('parentComponent', null);
      this.get('store').unloadRecord(foundation);
    }

    this.populateScene();
  },


  // @Override
  preProcessEntity() {
    const application = this.get('store').peekRecord('application', 
      this.get('applicationID'));
    this.set('entity', application);
  },


  // @Override
  populateScene() {
    this._super(...arguments);

    const emberApplication = this.get('entity');

    this.set('applicationID', emberApplication.id);

    const self = this;

    const foundation = createFoundation();

    applyCityLayout(emberApplication);

    self.set('application3D', new THREE.Object3D());
    self.set('application3D.userData.model', emberApplication);

    // update raycasting children, because of new entity
    this.get('interactionHandler').set('raycastObjects', self.get('application3D').children);

    const viewCenterPoint = calculateAppCenterAndZZoom(emberApplication);

    addComponentToScene(foundation, 0xCECECE);

    self.scene.add(self.get('application3D'));
    self.resetRotation();

    // Helper functions    
    
    function createFoundation() {
      const idTest = parseInt(Math.random() * (20000 - 10000) + 10000);
      const foundation = self.get('store').createRecord('component', {
        id: idTest,
        synthetic: false,
        foundation: true,
        children: [emberApplication.get('components').objectAt(0)],
        clazzes: [],
        belongingApplication: emberApplication,
        opened: true,
        name: emberApplication.get('name'),
        fullQualifiedName: emberApplication.get('name'),
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        width: 0,
        height: 0,
        depth: 0
      });

      emberApplication.get('components').objectAt(0).set('parentComponent', foundation);
      emberApplication.set('components', [foundation]);

      return foundation;
    }

    function addComponentToScene(component, color) {

      const grey = 0xCECECE;
      const lightGreen = 0x00BB41;
      const darkGreen = 0x169E2B;
      const clazzColor = 0x3E14A0;
      const redHighlighted = 0xFF0000;

      createBox(component, color);

      component.set('color', color);

      const clazzes = component.get('clazzes');
      const children = component.get('children');

      clazzes.forEach((clazz) => {
        if (component.get('opened')) {
          if (clazz.get('highlighted')) {
             createBox(clazz, redHighlighted);
          } else {
             createBox(clazz, clazzColor);
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



    function createBox(component, color) {

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
    const raycastObjects = this.get('application3D').children;
    const camera = this.get('camera');
    const webglrenderer = this.get('webglrenderer');
    const raycaster = this.get('raycaster');
    raycaster.set('objectCatalog', 'applicationObjects');

    this.get('interactionHandler').setupInteractionHandlers(canvas, 
      raycastObjects, camera, webglrenderer, raycaster);

    this.get('interactionHandler').on('cleanup', function() {
      self.cleanAndUpdateScene();
    });


  } // END initInteraction
  
});
