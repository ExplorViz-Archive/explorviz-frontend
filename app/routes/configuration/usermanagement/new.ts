import Route from '@ember/routing/route';
import { action } from '@ember/object';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class UserManagementNewRoute extends Route.extend(AuthenticatedRouteMixin) {
  @action
  goBack() {
    this.transitionTo('configuration.usermanagement.users');
  }
}
