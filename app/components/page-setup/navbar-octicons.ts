import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import PageSetup from 'explorviz-frontend/services/page-setup';

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
export default class NavbarOcticons extends Component {
  @service("page-setup")
  pageSetupService!: PageSetup;
}
