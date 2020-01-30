import { action } from '@ember/object';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import BaseRoute from 'explorviz-frontend/routes/base-route';

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
  // eslint-disable-next-line class-methods-use-this
  resetRoute() {}
}
