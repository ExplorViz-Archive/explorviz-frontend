 import Controller from '@ember/controller';
 import {inject as service} from '@ember/service';

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

  configurationService: service("configuration"),
  renderingService: service("rendering-service"),
  
  currentUser: service(),

  hideTimeline() {
    this.set('renderingService.showTimeline', false);
    this.set('renderingService.showVersionbar', false);
  }

});
