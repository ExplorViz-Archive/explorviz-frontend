import Ember from 'ember';

const {Controller, inject} = Ember;

/**
* TODO
*
* @class Configuration-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule settings
*/
export default Controller.extend({

  configurationService: inject.service("configuration"),
  renderingService: inject.service("rendering-service"),

  hideTimeline() {
    this.set('renderingService.showTimeline', false);
    this.set('renderingService.showVersionbar', false);
  }

});
