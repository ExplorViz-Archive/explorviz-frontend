import BaseRoute from './base-route';
import AuthenticatedRouteMixin from
 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
* TODO
* 
* @class Visualization-Route
* @extends Ember.Route
*/
export default BaseRoute.extend(AuthenticatedRouteMixin, {

  actions: {

    // @Override BaseRoute
  	resetRoute() {
      this.controller.send('resetView');
      this.controller.set('landscapeRepo.latestApplication', null);
  	},

    didTransition() {
      this.controller.showTimeline();
    }
  }
  
});
