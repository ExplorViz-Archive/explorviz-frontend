import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import PageSetup from 'explorviz-frontend/services/page-setup';

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
export default class NavbarRoutes extends Component {
  @service('page-setup')
  pageSetupService!: PageSetup;
}