import Component from '@ember/component';
import {inject as service} from '@ember/service';

/**
* This component renders all components (!), that are registered in 
* {{#crossLink "Page-Setup-Service"}}{{/crossLink}}, as nav-octicons.
* 
* @class Navbar-Octicons
* @extends Ember.Component
*
* @module explorviz
* @submodule page
*/
export default Component.extend({

  // No Ember generated container
  tagName: '',

  pageSetupService: service("page-setup")
});
