import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import { action } from '@ember/object';

export default class UserManagementNewRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {

  @service('store')
  store!: DS.Store;

  model(this:UserManagementNewRoute) {
    return this.get('store').queryRecord('usersetting', {});
  }

  @action
  goBack(this:UserManagementNewRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }
}
