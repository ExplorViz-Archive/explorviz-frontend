import BaseRoute from './base-route';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default BaseRoute.extend(AuthenticatedRouteMixin, {
  renderingService: service("rendering-service"),
  reloadHandler: service("reload-handler"),
  viewImporter: service("view-importer"),

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
