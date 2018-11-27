import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {

  showTimeline: true,
  showVersionbar: true,

  reSetupScene() {
    // redraws and repositions scene to default
    this.trigger('reSetupScene');
  },

  resizeCanvas() {
    this.trigger('resizeCanvas');
  },

  redrawScene() {
    // only redraws
    this.trigger('redrawScene');
  },

  toggleTimeline(){
    this.set('showTimeline', !this.get('showTimeline'));
  }

});