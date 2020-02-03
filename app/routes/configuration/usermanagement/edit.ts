import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

import { inject as service } from "@ember/service";
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';
import { action } from '@ember/object';

export default class UserManagementEditRoute extends Route.extend(AuthenticatedRouteMixin) {

  @service('store')
  store!: DS.Store;

  model(this: UserManagementEditRoute, { user_id }: { user_id: string }) {
    return this.get('store').findRecord('user', user_id, { reload: true }).then((user: User) => {
      return {
        user
      };
    }, () => {
      AlertifyHandler.showAlertifyWarning('User was not found.');
      this.transitionTo('configuration.usermanagement');
    });
  }

  @action
  goBack(this: UserManagementEditRoute) {
    this.transitionTo('configuration.usermanagement');
  }
}
