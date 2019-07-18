import Controller from '@ember/controller';
import { inject as service } from "@ember/service";


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
  logger: service('LogstashLogger'),

  init(){
    this._super();
    localStorage.setItem('debug', '*');
    this.logger.logstashEnabled = true;
    this.logger.log("key", 'value');
  }

});
