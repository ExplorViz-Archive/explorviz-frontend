import BaseRoute from 'explorviz-frontend/routes/base-route';
import { on } from "@ember/object/evented";
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';


export default BaseRoute.extend(AuthenticatedRouteMixin, {

  actions: {
    // @Override BaseRoute
    resetRoute() {
      this.cleanupController();      
    }
  },

  // @Override Ember-Hook
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      this.cleanupController();
    }
  },

  cleanupController() {
    this.controller.set('procezzForDetailView', null);
    this.controller.set('agentForDetailView', null);

    // stop first, there might be an old service instance running
    //this.get("agentReload").stopUpdate();
    //this.get("agentReload").startUpdate();
  },


  setupProcessView: on('activate', function(){
    this.controllerFor('discovery').setup();
  })

});