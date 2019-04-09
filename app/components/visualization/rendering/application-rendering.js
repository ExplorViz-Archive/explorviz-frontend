import RenderingCore from './rendering-core';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';


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
export default RenderingCore.extend(AlertifyHandler, {

  store: service('store'),
  highlighter: service('visualization/application/highlighter'),

  session: service(),

  configuration: service("configuration"),

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

    this.set('oldRotation', { x: 0, y: 0 });

    this.onReSetupScene = function () {
      this.resetRotation();
      this.set('centerAndZoomCalculator.centerPoint', null);
      this.get('camera.position').set(0, 0, 100);
      this.cleanAndUpdateScene();
    };

    this.onUpdated = function () {
      if (this.get('initDone')) {
        this.preProcessEntity();
        this.cleanAndUpdateScene();
      }
    };

    this.onResized = function () {
      this.set('centerAndZoomCalculator.centerPoint', null);
      this.cleanAndUpdateScene();
    };

    // Move camera to specified position
    this.onMoveCameraTo = function (emberModel) {
      if (!emberModel){
        return;
      }

      let emberModelName = emberModel.get('constructor.modelName');
      // Position of object in local coordinates
      let position, zoom;

      if (emberModelName === "clazz"){
        position = new THREE.Vector3(emberModel.get('positionX'), emberModel.get('positionY'), emberModel.get('positionZ'));
        zoom = 50;
      } else {
        // Position and zoom of model not (yet) defined
        return;
      }

      // Calculate center point of application
      if (!this.get('centerAndZoomCalculator.centerPoint')) {
        this.get('centerAndZoomCalculator')
          .calculateAppCenterAndZZoom(this.get('latestApplication'));
      }

      let viewCenterPoint = this.get('centerAndZoomCalculator.centerPoint');

      position.sub(viewCenterPoint);
      position.multiplyScalar(0.5);

      let application = this.get('application3D');
      let appQuaternion = new THREE.Quaternion();

      application.getWorldQuaternion(appQuaternion);
      position.applyQuaternion(appQuaternion);

      let appPosition = new THREE.Vector3();
      application.getWorldPosition(appPosition);
      position.sub(appPosition);

      // Move camera on to given position
      this.get('camera').position.set(position.x, position.y, position.z);
      // Zoom out to allow for better overview
      this.get('camera').position.z += zoom;
    };

    this.get('camera').position.set(0, 0, 100);

    // Dummy object for raycasting
    this.set('application3D', new THREE.Object3D());

    if (!this.get('labeler')) {
      this.set('labeler', Labeler.create());
    }

    if (!this.get('foundationBuilder')) {
      this.set('foundationBuilder', FoundationBuilder.create());
    }

    if (!this.get('interaction')) {
      // Owner necessary to inject service into util
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

    // Remove foundation for re-rendering
    this.get('foundationBuilder').removeFoundation(this.get('store'));

    this.set('applicationID', null);
    this.set('application3D', null);

    this.get('renderingService').off('redrawScene');

    // Clean up landscapeRepo for visualization template
    this.set('landscapeRepo.latestApplication', null);

    this.get('interaction').removeHandlers();
  },


  // @Override
  /**
   * Persists rotation and removes foundation
   *
   * @method cleanAndUpdateScene
   */
  cleanAndUpdateScene() {
    this.debug("clean application rendering");

    // Save old rotation
    this.set('oldRotation', this.get('application3D').rotation);

    // Remove foundation for re-rendering
    this.get('foundationBuilder').removeFoundation(this.get('store'));

    this._super(...arguments);
  },


  // @Override
  /**
   * Update latest application in landscape repo
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
   * Main method for adding THREE.js objects to application
   *
   * @method populateScene
   */
  populateScene() {
    this._super(...arguments);
    this.debug("populate application rendering");

    const emberApplication = this.get('latestApplication');

    if (!emberApplication || !this.get('font')) {
      return;
    }

    this.set('applicationID', emberApplication.id);

    const self = this;

    const foundation = this.get('foundationBuilder').createFoundation(emberApplication, this.get('store'));

    emberApplication.applyDefaultOpenLayout(self.get('initialSetupDone'));

    applyCityLayout(emberApplication);

    this.set('application3D', new THREE.Object3D());
    this.set('application3D.userData.model', emberApplication);

    // Update raycasting children, because of new entity
    this.get('interaction').updateEntities(this.get('application3D'));

    // Apply (possible) highlighting
    this.get('highlighter').applyHighlighting();

    if (!this.get('centerAndZoomCalculator.centerPoint')) {
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

        let transparent = false;
        let opacityValue = 1.0;

        if (drawableClazzComm.get('state') === "TRANSPARENT") {
          transparent = this.get('currentUser.settings.booleanAttributes.appVizTransparency');
          opacityValue = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
        }

        const communicationColor = this.get('configuration.applicationColors.communication');
        const communicationHighlightedColor = this.get('configuration.applicationColors.highlightedEntity');

        const material = new THREE.MeshBasicMaterial({
          color: drawableClazzComm.get('highlighted') ? new THREE.Color(communicationHighlightedColor) : new THREE.Color(communicationColor), // either red if 'highlighted', otherwise orange
          opacity: opacityValue,
          transparent: transparent
        });

        const thickness = drawableClazzComm.get('lineThickness') * 0.3;

        const pipe = this.cylinderMesh(start, end, material, thickness);

        pipe.userData.model = drawableClazzComm;

        // Indicate communication for direction for (indirectly) highlighted communication
        if (drawableClazzComm.get('highlighted') ||
          drawableClazzComm.get('sourceClazz.highlighted') ||
          drawableClazzComm.get('targetClazz.highlighted')) {

          // Check for recursion
          if (drawableClazzComm.get('sourceClazz.fullQualifiedName') ==
            drawableClazzComm.get('targetClazz.fullQualifiedName')) {
            // TODO: draw a circular arrow or something alike
          } else {

            // Add arrow from in direction of source to target clazz
            let arrowThickness = this.get('currentUser.settings.numericAttributes.appVizCommArrowSize') * 4 * thickness;
            self.addCommunicationArrow(start, end, arrowThickness);

            // Draw second arrow for bidirectional communication, but not if only trace communication direction shall be displayed
            if (drawableClazzComm.get('isBidirectional') && !this.get('highlighter.isTrace')) {
              self.addCommunicationArrow(end, start, arrowThickness);
            }
          }
        }

        self.get('application3D').add(pipe);
      }
    });

    const foundationColor = this.get('configuration.applicationColors.foundation');
    this.addComponentToScene(foundation, foundationColor);

    self.scene.add(self.get('application3D'));

    if (self.get('initialSetupDone')) {
      // Apply old rotation
      self.set('application3D.rotation.x', self.get('oldRotation.x'));
      self.set('application3D.rotation.y', self.get('oldRotation.y'));
    }
    else {
      self.resetRotation();
      self.set('oldRotation.x', self.get('application3D').rotation.x);
      self.set('oldRotation.y', self.get('application3D').rotation.y);
      self.set('initialSetupDone', true);
    }

    this.showAlertifyMessage("Application loaded");

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

    const foundationColor = this.get('configuration.applicationColors.foundation');
    const componentOddColor = this.get('configuration.applicationColors.componentOdd');
    const componentEvenColor = this.get('configuration.applicationColors.componentEven');
    const clazzColor = this.get('configuration.applicationColors.clazz');
    const highlightedEntityColor = this.get('configuration.applicationColors.highlightedEntity');

    this.createBox(component, color, false);

    component.set('color', color);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz) => {
      if (component.get('opened')) {
        if (clazz.get('highlighted')) {
          this.createBox(clazz, highlightedEntityColor, true);
        } else {
          this.createBox(clazz, clazzColor, true);
        }
      }
    });

    children.forEach((child) => {
      if (component.get('opened')) {
        if (child.get('highlighted')) {
          this.addComponentToScene(child, highlightedEntityColor);
        } else if (component.get('color') === foundationColor) {
          this.addComponentToScene(child, componentOddColor);
        } else if (component.get('color') === componentEvenColor) {
          this.addComponentToScene(child, componentOddColor);
        } else {
          this.addComponentToScene(child, componentEvenColor);
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

    if (component.get('state') === "TRANSPARENT") {
      transparent = this.get('currentUser.settings.booleanAttributes.appVizTransparency');
      opacityValue = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
    }

    const material = new THREE.MeshLambertMaterial({
      opacity: opacityValue,
      transparent: transparent
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

  },// END createBox

  /**
   * Draws an small black arrow
   * @param {Number} start start vector of the associated communication
   * @param {Number} end end vector of the associated communication
   * @param {Number} width thickness of the arrow
   * @method addCommunicationArrow
   */
  addCommunicationArrow(start, end, width) {

    // Determine (almost the) middle
    let dir = end.clone().sub(start);
    let len = dir.length();
    // Do not draw precisely in the middle to leave a small gap in case of bidirectional communication
    let halfVector = dir.normalize().multiplyScalar(len * 0.51);
    let middle = start.clone().add(halfVector);

    // Normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    // Arrow properties
    let origin = new THREE.Vector3(middle.x, middle.y + 0.8, middle.z);
    let headWidth = Math.max(1.2, width);
    let headLength = Math.min(2 * headWidth, 0.3 * len);
    let length = headLength + 0.00001; // body of arrow not visible
    const communicationArrowColor = this.get('configuration.applicationColors.communicationArrow');

    let arrow = new THREE.ArrowHelper(dir, origin, length, communicationArrowColor, headLength, headWidth);

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

    // Init interaction objects

    this.get('interaction').setupInteraction(canvas, camera, webglrenderer,
      this.get('application3D'));

    // Set listeners

    this.get('renderingService').on('redrawScene', function () {
      self.cleanAndUpdateScene();
    });
  }, // END initInteraction

});
