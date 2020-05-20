import { action } from '@ember/object';
import Route from '@ember/routing/route';
// @ts-ignore
import ApplicationRouteMixin from 'ember-simple-auth-auth0/mixins/application-route-mixin';
import ApplicationController from 'explorviz-frontend/controllers/application';
import RSVP from 'rsvp';

/**
 * TODO
 *
 * @class Application-Route
 * @extends Ember.Route
 */
// @ts-ignore
export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
  routeAfterAuthentication = 'visualization';

  beforeSessionExpired() {
    // Do custom async logic here, e.g. notify
    // the user that they are about to be logged out.

    return  RSVP.resolve()
  }

  async beforeModel() {
    if (this.session.data.authenticated.accessToken) {
      const user = {
        username: this.session.data.authenticated.profile.nickname,
        token: this.session.data.authenticated.accessToken,
        roles: ['admin'],
        id: this.session.data.authenticated.profile.sub,
      };

      this.store.createRecord('user', user);
    }

    await (this.controllerFor('application') as ApplicationController).loadUserAndSettings.perform();
  }

  async sessionAuthenticated() {
    const user = {
      username: this.session.data.authenticated.profile.nickname,
      token: this.session.data.authenticated.accessToken,
      roles: ['admin'],
      id: this.session.data.authenticated.profile.sub,
    };

    this.store.createRecord('user', user);

    await (this.controllerFor('application') as ApplicationController).loadUserAndSettings.perform();


    super.sessionAuthenticated(...arguments);
  }

  @action
  logout() {
    this.session.invalidate({ message: 'Logout successful' });
  }
}
