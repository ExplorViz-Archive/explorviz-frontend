import BaseRoute from 'explorviz-frontend/routes/base-route';
import UnauthenticatedRouteMixin from
 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import { action } from '@ember/object';

/**
* TODO
* 
* @class Login-Route
* @extends Ember.Route
*/
export default class LoginRoute extends BaseRoute.extend(UnauthenticatedRouteMixin) {
  routeIfAlreadyAuthenticated = 'visualization';

  // @Override BaseRoute
  @action
  resetRoute() {
  }
}
