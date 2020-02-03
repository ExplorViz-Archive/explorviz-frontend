import Route from '@ember/routing/route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';

export default class UserManagementNewRoute extends Route.extend(AuthenticatedRouteMixin) {

  @action
  goBack(this:UserManagementNewRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }
}
