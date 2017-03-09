import RenderingCore from './rendering-core';
import Ember from 'ember';

export default RenderingCore.extend({

  store: Ember.inject.service('store'),
  cityLayouter: Ember.inject.service("city-layouter"),
  application3D: null,

  // @Override
  initRendering() {
    this._super(...arguments);

    //this.initInteraction();
    
    this.get('camera').position.set(0, 0, 100);

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

    //this.get('hammerManager').off();
    //this.set('hammerManager', null);

  },


  // @Override
  cleanAndUpdateScene(application) {
    this._super(...arguments);

    this.populateScene(application);
  },

  // @Override
  populateScene(application) {
    this._super(...arguments);
    const self = this;

    /*let foundation = this.get('store').createRecord('component', {
        synthetic: false,
        foundation: true,
        children: application.get('components'),
        clazzes: [],
        parentComponent: null,
        belongingApplication: application,
        opened: true,
        name: application.get('name'),
        fullQualifiedName: application.get('name')
    });

    application.set('components', [foundation]);*/

    this.get('cityLayouter').applyLayout(application);

    self.set('application3D', new THREE.Object3D());

    const viewCenterPoint = calculateAppCenterAndZZoom(application);

    let colorCounter = 1;
    addComponentToScene(application.get('components').objectAt(0), 0xCECECE);

    self.scene.add(self.get('application3D'));
    self.resetRotation();

    // Helper functions    

    function addComponentToScene(component, color) {
      createBox(component, color);

      const clazzes = component.get('clazzes');
      const children = component.get('children');

      clazzes.forEach((clazz) => {
        if (component.get('opened')) {
          //const classCenter = clazz.centerPoint.sub(viewCenterPoint); 
          let clazzColor = 0x3E14A0;        

          if (clazz.get('highlighted')) {
            clazzColor = 0xFF0000;
          }
          
          createBox(component, clazzColor);
        }
      });

      children.forEach((child) => {
        if (child.get('opened')) {
          if(colorCounter % 2 === 1) {
            colorCounter++;
            addComponentToScene(child, 0x00BB41);
          } else {
            colorCounter++;
            addComponentToScene(child, 0x169E2B);
          }
        } 
        else {
          if (component.get('opened')) {
            if(colorCounter % 2 === 1) {
              colorCounter++;
              addComponentToScene(child, 0x00BB41);
            } else {
              colorCounter++;
              addComponentToScene(child, 0x169E2B);
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

      self.get('application3D').add(mesh);

    } // END createBox


    function calculateAppCenterAndZZoom(application) {

      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;
      const MIN_Z = 4;
      const MAX_Z = 5;

      const foundation = application.get('components').objectAt(0);

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
  }
  
});
