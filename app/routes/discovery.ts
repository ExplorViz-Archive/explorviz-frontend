import { on } from '@ember-decorators/object';
import { set } from '@ember/object';
import DiscoveryController from 'explorviz-frontend/controllers/discovery';
import BaseRoute from './base-route';


export default class DiscoveryRoute extends BaseRoute {
  // @Override Ember-Hook
  resetController(controller: DiscoveryController, isExiting: boolean, transition: any) {
    if (isExiting && transition.targetName !== 'error') {
      this.cleanupController(controller);
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  cleanupController(controller: DiscoveryController) {
    set(controller, 'procezzForDetailView', null);
    set(controller, 'agentForDetailView', null);

    // stop first, there might be an old service instance running
    // this.get("agentReload").stopUpdate();
    // this.get("agentReload").startUpdate();
  }

  @on('activate')
  setupProcessView() {
    (this.controllerFor('discovery') as DiscoveryController).setup();
  }
}
