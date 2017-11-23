import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  showTimeline: true,

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
