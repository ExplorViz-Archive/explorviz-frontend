import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import CurrentUser from 'explorviz-frontend/services/current-user';
import RouterService from '@ember/routing/router-service';

export default class ConfigurationUserManagementRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  @service('current-user') currentUser!: CurrentUser;
  @service('router') router!: RouterService;

  beforeModel() {
    // restrict route and sub-routes to admin only
    if(!this.currentUser.user.hasRole('admin'))
      this.router.transitionTo('configuration.settings');
  }
}
