import BaseRoute from './base-route';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';
 import Ember from 'ember';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  renderingService: Ember.inject.service("rendering-service"),
  reloadHandler: Ember.inject.service("reload-handler"),
  viewImporter: Ember.inject.service("view-importer"),

  actions: {

    // @Override BaseRoute
  	resetRoute() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.controller.set('landscapeRepo.replayApplication', null);
  	},

    didTransition() {
      this.controller.set('landscapeRepo.replayApplication', null);
      this.controller.set('landscapeRepo.replayLandscape', null);
      this.set('renderingService.showTimeline', false);
      this.set('renderingService.showVersionbar', true);
    }
  }
});
