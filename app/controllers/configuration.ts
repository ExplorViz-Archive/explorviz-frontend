 import Controller from '@ember/controller';
 import {inject as service} from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import CurrentUser from 'explorviz-frontend/services/current-user';
import { set } from '@ember/object';

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

  @service('rendering-service') renderingService!: RenderingService;
  @service('current-user') currentUser!: CurrentUser;

  hideTimeline() {
    set(this.renderingService, 'showTimeline', false);
    set(this.renderingService, 'showVersionbar', false);
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'configurationController': ConfigurationController;
  }
}
