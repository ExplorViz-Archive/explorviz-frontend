import { action } from '@ember/object';
// @ts-ignore
import BaseRoute from 'explorviz-frontend/routes/base-route';

export default class UserManagementNewRoute extends BaseRoute {
  @action
  goBack(this: UserManagementNewRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }
}
