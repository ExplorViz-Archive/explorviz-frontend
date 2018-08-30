import Component from '@ember/component';
import {inject as service} from '@ember/service';

/**
* This component renders all routes (!), that are registered in 
* {{#crossLink "Page-Setup-Service"}}{{/crossLink}}, as nav-links.
* 
* @class Navbar-Routes
* @extends Ember.Component
*
* @module explorviz
* @submodule page
*/
export default Component.extend({

  tagName: "ul",
  classNames:["navbar-nav mr-auto"],

  pageSetupService: service('page-setup'),

  actions: {
    resetRoute() {
      this.sendAction("resetRoute"); // eslint-disable-line
    }
  }
});
