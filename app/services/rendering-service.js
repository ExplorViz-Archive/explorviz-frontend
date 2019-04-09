import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {

  showTimeline: true,
  showVersionbar: true,

  reSetupScene() {
    // Redraws and repositions scene to default
    this.trigger('reSetupScene');
  },

  resizeCanvas() {
    this.trigger('resizeCanvas');
  },

  redrawScene() {
    // Only redraws
    this.trigger('redrawScene');
  },

  /**
   * Triggers camera to move to a specified ember model
   * @param {*} emberModel Model which the camera should focus on
   */
  moveCameraTo(emberModel) {
    this.trigger('moveCameraTo', emberModel);
  },

  toggleTimeline() {
    this.set('showTimeline', !this.get('showTimeline'));
  }

});