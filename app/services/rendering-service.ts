import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import THREE from 'three';

export interface RenderingContext {
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
}

export default class RenderingService extends Service.extend(Evented) {
  reSetupScene() {
    // Redraws and repositions scene to default
    this.trigger('reSetupScene');
  }

  redrawScene() {
    // Only redraws
    this.trigger('redrawScene');
  }

  /**
   * Triggers camera to move to a specified ember model
   * @param {*} emberModel Model which the camera should focus on
   */
  moveCameraTo(emberModel: Clazz | DrawableClazzCommunication | ClazzCommunication) {
    this.trigger('moveCameraTo', emberModel);
  }
}

declare module '@ember/service' {
  interface Registry {
    'rendering-service': RenderingService;
  }
}
