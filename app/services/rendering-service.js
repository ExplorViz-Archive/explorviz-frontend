import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  showTimeline: true,

  reSetupScene() {
    this.trigger('reSetupScene');
  },

  focusEntity(emberEntitiy) {
    this.trigger('focusEntity', emberEntitiy);
  }

});
