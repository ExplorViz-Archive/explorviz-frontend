import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';

export default class RenderingService extends Service.extend(Evented) {

  showTimeline: boolean = true;
  showVersionbar: boolean = true;

  reSetupScene() {
    // Redraws and repositions scene to default
    this.trigger('reSetupScene');
  }

  resizeCanvas() {
    this.trigger('resizeCanvas');
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

  toggleTimeline() {
    this.toggleProperty('showTimeline');
  }

}

declare module "@ember/service" {
  interface Registry {
    "rendering-service": RenderingService;
  }
}