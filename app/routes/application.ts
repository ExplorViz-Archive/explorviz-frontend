import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { perform } from 'ember-concurrency-ts';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
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
    await perform((this.controllerFor('application') as ApplicationController).loadUserAndSettings);
  }

  async sessionAuthenticated() {
    await perform((this.controllerFor('application') as ApplicationController).loadUserAndSettings);

    super.sessionAuthenticated(...arguments);
  }

  @action
  logout() {
    this.session.invalidate({ message: 'Logout successful' });
  }
}
