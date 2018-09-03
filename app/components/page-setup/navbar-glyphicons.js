import Component from '@ember/component';
import {inject as service} from '@ember/service';

/**
* This component renders all components (!), that are registered in 
* {{#crossLink "Page-Setup-Service"}}{{/crossLink}}, as nav-glyphicons.
* 
* @class Navbar-Glyphicons
* @extends Ember.Component
*
* @module explorviz
* @submodule page
*/
export default Component.extend({

  pageSetupService: service("page-setup")
});
