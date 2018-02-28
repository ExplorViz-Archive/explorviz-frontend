import Ember from 'ember';
import RenderingCore from './rendering-core';

import THREE from "npm:three";

import applyCityLayout from
'explorviz-frontend/utils/application-rendering/city-layouter';
import Interaction from
'explorviz-frontend/utils/application-rendering/interaction';
import Labeler from
'explorviz-frontend/utils/application-rendering/labeler';
import CalcCenterAndZoom from
'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import FoundationBuilder from
'explorviz-frontend/utils/application-rendering/foundation-builder';


const {inject} = Ember;


/**
* Renderer for application visualization.
*
* @class Application-Rendering-Component
* @extends Rendering-Core-Component
*
* @module explorviz
* @submodule visualization.rendering
*/
export default RenderingCore.extend({

  store: inject.service('store'),

  application3D: null,

  applicationID: null,

  interactionHandler: null,
  labeler: null,

  oldRotation: {x: 0, y: 0},
  initialSetupDone: false,

  interaction: null,
  centerAndZoomCalculator: null,
  foundationBuilder: null,

  // @Override
  initRendering() {
  this._super(...arguments);

  this.debug("init application rendering");

  this.onReSetupScene = function() {
  this.resetRotation();
  this.set('centerAndZoomCalculator.centerPoint', null);
  this.get('camera.position').set(0, 0, 100);
  this.cleanAndUpdateScene();
  };

  this.onUpdated = function() {
  if(this.get('initDone')) {
  this.preProcessEntity();
  this.cleanAndUpdateScene();
  }
  };

  this.onResized = function() {
  this.set('centerAndZoomCalculator.centerPoint', null);
  this.cleanAndUpdateScene();
  };

  this.get('camera').position.set(0, 0, 100);

  // dummy object for raycasting
  this.set('application3D', new THREE.Object3D());

  if (!this.get('labeler')) {
  this.set('labeler', Labeler.create());
  }

  if (!this.get('foundationBuilder')) {
  this.set('foundationBuilder', FoundationBuilder.create());
  }

  if (!this.get('interaction')) {
  // owner necessary to inject service into util
  this.set('interaction', Interaction.create(Ember.getOwner(this).ownerInjection()));
  }

  if (!this.get('centerAndZoomCalculator')) {
  this.set('centerAndZoomCalculator', CalcCenterAndZoom.create());
  }

  this.initInteraction();

  const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
  spotLight.position.set(100, 100, 100);
  spotLight.castShadow = false;
  this.get('scene').add(spotLight);

  const light = new THREE.AmbientLight(
  new THREE.Color(0.65, 0.65, 0.65));
  this.scene.add(light);

  this.set('centerAndZoomCalculator.centerPoint', null);
  },


  // @Override
  cleanup() {
  this._super(...arguments);

  this.debug("cleanup application rendering");

  // remove foundation for re-rendering
  this.get('foundationBuilder').removeFoundation(this.get('store'));

  this.set('applicationID', null);
  this.set('application3D', null);

  this.get('renderingService').off('redrawScene');

  // clean up landscapeRepo for visualization template
  this.set('landscapeRepo.latestApplication', null);

  this.get('interaction').removeHandlers();
  },


  // @Override
  /**
  * TODO
  *
  * @method cleanAndUpdateScene
  */
  cleanAndUpdateScene() {
  this.debug("clean application rendering");

  // save old rotation
  this.set('oldRotation', this.get('application3D').rotation);

  // remove foundation for re-rendering
  this.get('foundationBuilder').removeFoundation(this.get('store'));

  this._super(...arguments);
  },


  // @Override
  /**
  * TODO
  *
  * @method preProcessEntity
  */
  preProcessEntity() {
  const application = this.get('store').peekRecord('application',
  this.get('applicationID'));
  this.set('landscapeRepo.latestApplication', application);
  },


  // @Override
  /**
  * TODO
  *
  * @method populateScene
  */
  populateScene() {
  this._super(...arguments);
  this.debug("populate application rendering");

  const emberApplication = this.get('landscapeRepo.latestApplication');

  if(!emberApplication) {
  return;
  }

  this.set('applicationID', emberApplication.id);

  const self = this;

  const foundation = this.get('foundationBuilder').createFoundation(emberApplication, this.get('store'));

  applyCityLayout(emberApplication);

  this.set('application3D', new THREE.Object3D());
  this.set('application3D.userData.model', emberApplication);

  // update raycasting children, because of new entity
  this.get('interaction').updateEntities(this.get('application3D'));

  // apply (possible) highlighting
  this.get('interaction').applyHighlighting();

  if(!this.get('centerAndZoomCalculator.centerPoint')) {
  this.get('centerAndZoomCalculator')
  .calculateAppCenterAndZZoom(emberApplication);
  }

  const viewCenterPoint = this.get('centerAndZoomCalculator.centerPoint');

  const accuCommunications =
  emberApplication.get('communicationsAccumulated');

  accuCommunications.forEach((commu) => {
  if (commu.source.content !== commu.target.content) {
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

      const pipe = this.cylinderMesh(start, end, material, thickness);

      pipe.userData.model = commu;

      self.get('application3D').add(pipe);

    }
  }
  });

  this.addComponentToScene(foundation, 0xCECECE);

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
  },

  // Helper functions
  cylinderMesh(pointX, pointY, material, thickness) {
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
  },

  addComponentToScene(component, color) {

    const grey = 0xCECECE;
    const lightGreen = 0x00BB41;
    const darkGreen = 0x169E2B;
    const clazzColor = 0x3E14A0;
    const redHighlighted = 0xFF0000;

    this.createBox(component, color, false);

    component.set('color', color);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz) => {
      if (component.get('opened')) {
        if (clazz.get('highlighted')) {
          this.createBox(clazz, redHighlighted, true);
        } else {
          this.createBox(clazz, clazzColor, true);
        }
      }
    });

    children.forEach((child) => {
      if (component.get('opened')) {
        if (child.get('opened')) {
          if(child.get('highlighted')) {
            this.addComponentToScene(child, redHighlighted);
          }
          else if(component.get('color') === grey) {
            this.addComponentToScene(child, lightGreen);
          }
          else if(component.get('color') === darkGreen) {
            this.addComponentToScene(child, lightGreen);
          } else {
            this.addComponentToScene(child, darkGreen);
          }
        }
        else {
          if(child.get('highlighted')) {
            this.addComponentToScene(child, redHighlighted);
          }
          else if(component.get('color') === grey) {
            this.addComponentToScene(child, lightGreen);
          }
          else if(component.get('color') === darkGreen) {
            this.addComponentToScene(child, lightGreen);
          } else {
            this.addComponentToScene(child, darkGreen);
          }
        }
      }
    });
  }, // END addComponentToScene



  createBox(component, color, isClass) {
    const self = this;
    let centerPoint = new THREE.Vector3(component.get('positionX') +
    component.get('width') / 2.0, component.get('positionY') +
    component.get('height') / 2.0,
    component.get('positionZ') + component.get('depth') / 2.0);

    const material = new THREE.MeshLambertMaterial();
    material.color = new THREE.Color(color);

    centerPoint.sub(this.get('centerAndZoomCalculator.centerPoint'));

    centerPoint.multiplyScalar(0.5);

    const extension = new THREE.Vector3(component.get('width') / 2.0,
    component.get('height') / 2.0, component.get('depth') / 2.0);

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

  } ,// END createBox


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

    // init interaction objects

    this.get('interaction').setupInteraction(canvas, camera, webglrenderer,
      this.get('application3D'));

      // set listeners

      this.get('renderingService').on('redrawScene', function() {
        self.cleanAndUpdateScene();
      });



    }, // END initInteraction

  });
