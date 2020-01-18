 import Controller from '@ember/controller';
 import {inject as service} from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';

/**
* TODO
*
* @class ConfigurationController
* @extends Ember.Controller
*
* @module explorviz
* @submodule settings
*/
export default class ConfigurationController extends Controller {

  // used in template to add extension tabs
  @service('configuration') configurationService!: Configuration;

  @service('current-user') currentUser!: CurrentUser;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'configurationController': ConfigurationController;
  }
}
