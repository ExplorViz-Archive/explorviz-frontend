import Route from '@ember/routing/route';
import ApplicationRouteMixin from
  'ember-simple-auth/mixins/application-route-mixin';
import { action } from '@ember/object';
import ApplicationController from 'explorviz-frontend/controllers/application';

/**
* TODO
* 
* @class Application-Route
* @extends Ember.Route
*/
export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {

  routeAfterAuthentication = 'visualization';

  async beforeModel() {
    await (this.controllerFor('application') as ApplicationController).loadUserAndSettings.perform();
  }

  async sessionAuthenticated() {
    await (this.controllerFor('application') as ApplicationController).loadUserAndSettings.perform();

    super.sessionAuthenticated(...arguments);
  }

  @action
  logout() {
    this.session.invalidate({ message: "Logout successful" });
  }

}