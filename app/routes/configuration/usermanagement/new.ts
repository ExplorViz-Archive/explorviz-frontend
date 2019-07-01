import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';

export default class UserManagementNewRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {

  @action
  goBack(this:UserManagementNewRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }
}
