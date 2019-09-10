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
  roles:Role[]|null = null;

  id_change = '';
  username_change = '';
  password_change = '';
  roles_change:Role[]|null = null;

  didInsertElement() {
    super.didInsertElement();

    this.initFields.perform();
  }

  @task
  initFields = task(function * (this:UserData) {
    const user = this.user;

    if(user) {
      let roles:DS.ManyArray<Role> = yield user.roles;
      set(this, 'id_change', user.id);
      set(this, 'username_change', user.username);
      set(this, 'roles_change', roles.toArray());
    }
  });

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

      user.roles.setObjects(roles_change);

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
    let roles:DS.RecordArray<Role> = yield this.store.findAll('role');
    set(this, 'roles', roles.toArray());
  });
}
