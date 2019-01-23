import RenderingCore from './rendering-core';
import {inject as service} from '@ember/service';
import { getOwner } from '@ember/application';

import THREE from "three";

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

  store: service('store'),

  session: service(),

  application3D: null,

  applicationID: null,

  interactionHandler: null,
  labeler: null,

  oldRotation: null,
  initialSetupDone: false,

  interaction: null,
  centerAndZoomCalculator: null,
  foundationBuilder: null,

  currentUser: null,

  // @Override
  initRendering() {
    this._super(...arguments);

    this.debug("init application rendering");

    this.set('oldRotation', {x: 0, y: 0});

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
      this.set('interaction', Interaction.create(getOwner(this).ownerInjection()));
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

    this.set('currentUser', this.get('session.session.content.authenticated.user'));
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

    //const emberApplication = this.get('landscapeRepo.latestApplication');
    const emberApplication = this.get('latestApplication');

    if(!emberApplication) {
      return;
    }

    this.set('applicationID', emberApplication.id);

    const self = this;

    const foundation = this.get('foundationBuilder').createFoundation(emberApplication, this.get('store'));

    emberApplication.applyDefaultOpenLayout(self.get('initialSetupDone'));

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

    const drawableClazzCommunications = emberApplication.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((drawableClazzComm) => {
      if (drawableClazzComm.get('startPoint') && drawableClazzComm.get('endPoint')) {
        const start = new THREE.Vector3();
        start.subVectors(drawableClazzComm.get('startPoint'), viewCenterPoint);
        start.multiplyScalar(0.5);

        const end = new THREE.Vector3();
        end.subVectors(drawableClazzComm.get('endPoint'), viewCenterPoint);
        end.multiplyScalar(0.5);

        // horizontal communication lines
        /*if(start.y >= end.y) {
          end.y = start.y;
        } else {
          start.y = end.y;
        }*/

        let transparent = false;
        let opacityValue = 1.0;

        if(drawableClazzComm.get('state') === "TRANSPARENT") {
          transparent = this.get('currentUser.settings.booleanAttributes.appVizTransparency');
          opacityValue = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
        }

        const material = new THREE.MeshBasicMaterial({
          color : drawableClazzComm.get('highlighted') ? new THREE.Color(0xFF0000) : new THREE.Color(0xf49100), // either red or orange, depending on highlighting status
          opacity : opacityValue,
          transparent : transparent
        });

        const thickness = drawableClazzComm.get('lineThickness') * 0.3;

        const pipe = this.cylinderMesh(start, end, material, thickness);

        pipe.userData.model = drawableClazzComm;

        // indicate communication for direction for (indirectly) highlighted communication
        if (drawableClazzComm.get('highlighted') ||
            drawableClazzComm.get('sourceClazz.highlighted') || 
            drawableClazzComm.get('targetClazz.highlighted')){

              // check for recursion
              if ( drawableClazzComm.get('sourceClazz.fullQualifiedName') == 
                   drawableClazzComm.get('targetClazz.fullQualifiedName') ){
                // TODO: draw a circular arrow or something alike
              } else {
              // keep track of drawn arrow to prevent duplicates
              let drewSecondArrow = false;

              // add arrow from in direction of source to target clazz
              let arrowThickness = this.get('currentUser.settings.numericAttributes.appVizCommArrowSize') * 4 * thickness;
              self.addCommunicationArrow(start, end, arrowThickness);

              // check for bidirectional communication
              drawableClazzComm.get('aggregatedClazzCommunications').forEach( (aggrComm) => {
                if ((drawableClazzComm.get('sourceClazz.fullQualifiedName') === aggrComm.get('targetClazz.fullQualifiedName') && !drewSecondArrow)){
                  self.addCommunicationArrow(end, start, arrowThickness);
                  drewSecondArrow = true;
                }
              });
              }
        }

        self.get('application3D').add(pipe);
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
        if(child.get('highlighted')) {
          this.addComponentToScene(child, redHighlighted);
        } else if(component.get('color') === grey) {
          this.addComponentToScene(child, lightGreen);
        } else if(component.get('color') === darkGreen) {
          this.addComponentToScene(child, lightGreen);
        } else {
          this.addComponentToScene(child, darkGreen);
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

    let transparent = false;
    let opacityValue = 1.0;

    if(component.get('state') === "TRANSPARENT") {
      transparent = this.get('currentUser.settings.booleanAttributes.appVizTransparency');
      opacityValue = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
    }

    const material = new THREE.MeshLambertMaterial({
      opacity : opacityValue,
      transparent : transparent
    });

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
      self.get('font'), transparent);

    self.get('application3D').add(mesh);

  } ,// END createBox

  /**
   * Draws an small black arrow
   * @param {*} start start vector of the associated communication
   * @param {*} end   end vector of the associated communication
   */
  addCommunicationArrow(start, end, width){

    // determine (almost the) middle
    let dir = end.clone().sub(start);
    let len = dir.length();
    // do not draw precisely in the middle to leave a small gap in case of bidirectional communication
    let halfVector = dir.normalize().multiplyScalar(len*0.51);
    let middle = start.clone().add(halfVector);

    // normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    // arrow properties
    let origin = new THREE.Vector3(middle.x, middle.y + 0.8, middle.z);
    let headWidth = Math.max(1.2, width);
    let headLength = Math.min(2 * headWidth, 0.3 * len);
    let length = headLength + 0.00001; // body of arrow not visible
    let color = 0x000000; // black

    let arrow = new THREE.ArrowHelper(dir, origin, length, color , headLength, headWidth);

    this.get('application3D').add(arrow);
  }, // END addCommunicationArrow


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
