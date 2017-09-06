import Ember from 'ember';
import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

const {Route, inject} = Ember;

/**
* TODO
* 
* @class Application-Route
* @extends Ember.Route
*/
export default Route.extend(ApplicationRouteMixin, {

navbarService: inject.service('navbar-labels'),

actions: {
    logout() {
      this.get('session').invalidate({message: "Logout successful"});
    }
  }

});