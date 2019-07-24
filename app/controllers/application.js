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

  init(){
    this._super();
    localStorage.setItem('debug', '*');
    let l = logger(this._debugContainerKey)
    l.warn("A warning message")
  }

});
