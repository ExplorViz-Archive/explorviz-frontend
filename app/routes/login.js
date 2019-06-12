import BaseRoute from 'explorviz-frontend/routes/base-route';
import UnauthenticatedRouteMixin from
 'ember-simple-auth/mixins/unauthenticated-route-mixin';

/**
* TODO
* 
* @class Login-Route
* @extends Ember.Route
*/
export default BaseRoute.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'visualization',

  // @Override BaseRoute
  actions: {
    resetRoute() {
    }
  }
});
