import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

/**
* TODO
*
* @class Login-Route
* @extends Ember.Route
*/
export default class LoginRoute extends Route.extend(UnauthenticatedRouteMixin) {
  routeIfAlreadyAuthenticated = 'visualization';
}
