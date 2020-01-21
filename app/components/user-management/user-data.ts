import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import DS from 'ember-data';
import { set } from '@ember/object';
import User from 'explorviz-frontend/models/user';
import Role from 'explorviz-frontend/models/role';

interface Args {
  user: User|null|undefined
}

export default class UserData extends Component<Args> {

  @service('store') store!: DS.Store;

  @tracked
  id_change = '';

  @tracked
  username_change = '';

  @tracked
  password_change = '';

  @tracked
  roles:string[]|null = null;

  @tracked
  roles_change:string[]|null = null;

  constructor(owner:any, args:Args) {
    super(owner, args);

    this.initFields();
  }

  initFields(this:UserData) {
    const user = this.args.user;

    if(user) {
      this.id_change = user.id;
      this.username_change = user.username;
      this.roles_change = [...user.roles];
    }
  }

  @task({ drop: true })
  saveUserChanges = task(function * (this:UserData) {
    const { username_change, password_change, roles_change } = this;

    const user = this.args.user;

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
      this.password_change = '';
    }
  });

  showReasonErrorAlert(reason:any) {
    const { title, detail } = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

  @task
  getRoles = task(function * (this:UserData) {
    let roles:DS.RecordArray<Role> = yield this.store.findAll('role', { reload: true });
    this.roles = roles.toArray().map((role:Role) => role.id);
  });
}
