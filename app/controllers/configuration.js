import Ember from 'ember';

export default Ember.Controller.extend({

  configurationService: Ember.inject.service("configuration"),
  renderingService: Ember.inject.service("rendering-service"),

  hideTimeline() {
    this.set('renderingService.showTimeline', false);
  }

});
