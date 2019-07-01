import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

import { inject as service } from "@ember/service";
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';

export default class UserManagementEditRoute extends BaseRoute.extend(AuthenticatedRouteMixin, AlertifyHandler) {

  @service('store')
  store!: DS.Store;

  model(this:UserManagementEditRoute, { user_id }:{ user_id:string }) {
    return this.get('store').findRecord('user', user_id, {reload: true}).then((user:User) => {
      return {
        user
      };
    }, () => {
      this.showAlertifyWarning('User was not found.');
      this.transitionTo('configuration.usermanagement');
    });
  }

  actions = {
    // @Override BaseRoute
    resetRoute(this: UserManagementEditRoute) {
      this.transitionTo('configuration.usermanagement');
    },

    goBack(this: UserManagementEditRoute) {
      this.transitionTo('configuration.usermanagement');
    }
  }
}
