import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';

/**
* TODO
* 
* @class Configuration-Route
* @extends Ember.Route
*/
export default BaseRoute.extend(AuthenticatedRouteMixin, {

  actions: {
    didTransition() {
      this.controller.hideTimeline();
    }
  }

});
