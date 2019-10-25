import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import DS from 'ember-data';
import { set } from '@ember/object';
import User from 'explorviz-frontend/models/user';
import Role from 'explorviz-frontend/models/role';

export default class UserData extends Component {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;

  user:User|null = null;
  roles:string[]|null = null;

  id_change = '';
  username_change = '';
  password_change = '';
  roles_change:string[]|null = null;

  didInsertElement() {
    super.didInsertElement();

    this.initFields();
  }

  initFields(this:UserData) {
    const user = this.user;

    if(user) {
      set(this, 'id_change', user.id);
      set(this, 'username_change', user.username);
      set(this, 'roles_change', [...user.roles]);
    }
  }

  @task({ drop: true })
  saveUserChanges = task(function * (this:UserData) {
    const { username_change, password_change, roles_change } = this;

    const user = this.user;

    if(user) {
      // check for valid input
      if(!username_change || username_change.length === 0) {
        AlertifyHandler.showAlertifyWarning('Username cannot be empty.');
        return;
      } else if(!roles_change || roles_change.length === 0) {
        AlertifyHandler.showAlertifyWarning('User needs at least 1 role.');
        return;
      }

      if(user.username !== username_change)
        set(user, 'username', username_change);

      if(password_change && password_change !== '')
        set(user, 'password', password_change);

      set(user, 'roles', roles_change);

      try {
        yield user.save();
        AlertifyHandler.showAlertifySuccess(`User updated.`);
        clearInputFields.bind(this)();
      } catch(reason) {
        this.showReasonErrorAlert(reason);
      }
    } else {
      AlertifyHandler.showAlertifyError(`User not found.`);
    }

    function clearInputFields(this:UserData) {
      set(this, 'password_change', '');
    }
  });

  showReasonErrorAlert(reason:any) {
    const { title, detail } = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

  @task
  getRoles = task(function * (this:UserData) {
    let roles:DS.RecordArray<Role> = yield this.store.findAll('role', { reload: true });
    set(this, 'roles', roles.toArray().map((role:Role) => role.id));
  });
}
