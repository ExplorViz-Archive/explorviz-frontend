import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';
import BaseRoute from 'explorviz-frontend/routes/base-route';

export default class UserManagementEditRoute extends BaseRoute {
  @service('store')
  store!: DS.Store;

  // eslint-disable-next-line @typescript-eslint/camelcase
  model({ user_id }: { user_id: string }) {
    return this.get('store').findRecord('user', user_id, { reload: true }).then(
      (user: User) => ({ user }),
      () => {
        AlertifyHandler.showAlertifyWarning('User was not found.');
        this.transitionTo('configuration.usermanagement');
      },
    );
  }

  @action
  goBack() {
    this.transitionTo('configuration.usermanagement');
  }
}
