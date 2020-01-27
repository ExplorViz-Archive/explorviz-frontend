import { action } from '@ember/object';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseRoute from 'explorviz-frontend/routes/base-route';

export default class UserManagementNewRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  @action
  goBack(this: UserManagementNewRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }

  @action
  // eslint-disable-next-line class-methods-use-this
  resetRoute() {}
}
