import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import CurrentUser from 'explorviz-frontend/services/current-user';

export default class ConfigurationUserManagementRoute
  extends Route.extend(AuthenticatedRouteMixin) {
  @service('current-user') currentUser!: CurrentUser;

  @service('router') router!: RouterService;

  beforeModel() {
    // restrict route and sub-routes to admin only
    if (!this.currentUser.user.hasRole('admin')) {
      this.router.transitionTo('configuration.settings');
    }
  }
}
