import Ember from 'ember';
import UnauthenticatedRouteMixin from
 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { Route } = Ember;

/**
* TODO
* 
* @class Login-Route
* @extends Ember.Route
*/
export default Route.extend(UnauthenticatedRouteMixin);
