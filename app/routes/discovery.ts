import Route from '@ember/routing/route';
import { on } from '@ember-decorators/object';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';
import { set } from '@ember/object';
import DiscoveryController from 'explorviz-frontend/controllers/discovery';


export default class DiscoveryRoute extends Route.extend(AuthenticatedRouteMixin) {

  // @Override Ember-Hook
  resetController(controller: DiscoveryController, isExiting: boolean, transition: any) {
    if (isExiting && transition.targetName !== 'error') {
      this.cleanupController(controller);
    }
  }

  cleanupController(controller: DiscoveryController) {
    set(controller, 'procezzForDetailView', null);
    set(controller, 'agentForDetailView', null);

    // stop first, there might be an old service instance running
    //this.get("agentReload").stopUpdate();
    //this.get("agentReload").startUpdate();
  }

  @on('activate')
  setupProcessView() {
    (this.controllerFor('discovery') as DiscoveryController).setup();
  }

}