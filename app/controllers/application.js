import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import logger from 'explorviz-frontend/utils/logging'


/**
* TODO
*
* @class Application-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule page
*/
export default Controller.extend({
  
  session: service('session'),
  logger: logger("Applications"),

  init(){
    this._super();
    this.logger.debug("Application loaded")
  }

});
