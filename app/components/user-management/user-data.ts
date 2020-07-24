import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Role from 'explorviz-frontend/models/role';
import User from 'explorviz-frontend/models/user';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface IArgs {
  user: User|null|undefined;
}

export default class UserData extends Component<IArgs> {
  @service('store') store!: DS.Store;

  @tracked
  idChange = '';

  @tracked
  usernameChange = '';

  @tracked
  passwordChange = '';

  @tracked
  roles: string[]|null = null;

  @tracked
  rolesChange: string[]|null = null;

  @task({ drop: true })
  // eslint-disable-next-line
  saveUserChanges = task(function* (this: UserData) {
    const { usernameChange, passwordChange, rolesChange } = this;

    const { user } = this.args;

    function clearInputFields(this: UserData) {
      this.passwordChange = '';
    }

    if (user) {
      // check for valid input
      if (!usernameChange || usernameChange.length === 0) {
        AlertifyHandler.showAlertifyWarning('Username cannot be empty.');
        return;
      }
      if (!rolesChange || rolesChange.length === 0) {
        AlertifyHandler.showAlertifyWarning('User needs at least 1 role.');
        return;
      }

      if (user.username !== usernameChange) {
        set(user, 'username', usernameChange);
      }

      if (passwordChange && passwordChange !== '') {
        set(user, 'password', passwordChange);
      }

      set(user, 'roles', rolesChange);

      try {
        yield user.save();
        AlertifyHandler.showAlertifySuccess('User updated.');
        clearInputFields.bind(this)();
      } catch (reason) {
        UserData.showReasonErrorAlert(reason);
      }
    } else {
      AlertifyHandler.showAlertifyError('User not found.');
    }
  });

  @task
  // eslint-disable-next-line
  getRoles = task(function* (this: UserData) {
    const roles: DS.RecordArray<Role> = yield this.store.findAll('role', { reload: true });
    this.roles = roles.toArray().map((role: Role) => role.id);
  });

  constructor(owner: any, args: IArgs) {
    super(owner, args);

    this.initFields();
  }

  initFields(this: UserData) {
    const { user } = this.args;

    if (user) {
      this.idChange = user.id;
      this.usernameChange = user.username;
      this.rolesChange = [...user.roles];
    }
  }

  @action
  updateRoleSelection(roles: string[]) {
    this.rolesChange = roles;
  }

  static showReasonErrorAlert(reason: any) {
    const { title, detail } = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }
}
