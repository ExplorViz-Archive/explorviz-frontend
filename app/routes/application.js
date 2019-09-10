import Route from '@ember/routing/route';
import ApplicationRouteMixin from
  'ember-simple-auth/mixins/application-route-mixin';

/**
* TODO
* 
* @class Application-Route
* @extends Ember.Route
*/
export default Route.extend(ApplicationRouteMixin, {

  routeAfterAuthentication: 'visualization',

  async beforeModel() {
    await this.controllerFor('application').get('loadUserAndSettings').perform();
  },

  async sessionAuthenticated() {
    await this.controllerFor('application').get('loadUserAndSettings').perform();

    this.transitionTo(this.routeAfterAuthentication);
  },

  actions: {
    logout() {
      this.get('session').invalidate({ message: "Logout successful" });
    }
  }

});