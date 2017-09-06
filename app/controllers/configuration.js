import Ember from 'ember';

const {Controller, inject} = Ember;

/**
* TODO
*
* @class Configuration-Controller
* @extends Ember.Controller
*/
export default Controller.extend({

  configurationService: inject.service("configuration"),
  renderingService: inject.service("rendering-service"),

  hideTimeline() {
    this.set('renderingService.showTimeline', false);
  }

});
