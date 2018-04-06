import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {

  showTimeline: true,
  showVersionbar: true,

  reSetupScene() {
    // redraws and repositions scene to default
    this.trigger('reSetupScene');
  },

  redrawScene() {
    // only redraws
    this.trigger('redrawScene');
  },

  focusEntity(emberEntitiy) {
    this.trigger('focusEntity', emberEntitiy);
  }

});
