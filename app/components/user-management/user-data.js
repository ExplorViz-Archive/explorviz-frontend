import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),

  showSpinner: null,

  user: null,
  roles: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('roles', []);
    const user = this.get('user');
    if(user) {
      this.setProperties({
        id_change: user.id,
        username_change: user.username,
        roles_change: user.roles
      });
    }
  },

  saveUserChanges: task(function * () {
    const userData = this.getProperties('username_change', 'password_change', 'roles_change');

    const user = this.get('user');

    if(user) {
      // check for valid input
      if(!userData.username_change || userData.username_change.length === 0) {
        this.showAlertifyWarning('Username cannot be empty.');
        return;
      } else if(!userData.roles_change || userData.roles_change.length === 0) {
        this.showAlertifyWarning('User needs at least 1 role.');
        return;
      }

      if(user.get('username') !== userData.username_change)
        user.set('username', userData.username_change);

      if(userData.password_change && userData.password_change !== '')
        user.set('password', userData.password_change);

      user.set('roles', userData.roles_change);

      try {
        yield user.save();
        this.showAlertifySuccess(`User updated.`);
        clearInputFields.bind(this)();
      } catch(reason) {
        this.showReasonErrorAlert(reason);
      }
    } else {
      this.showAlertifyError(`User not found.`);
    }

    function clearInputFields() {
      this.set('password_change', '');
    }
  }).drop(),

  showReasonErrorAlert(reason) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyError(`<b>${title}:</b> ${detail}`);
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })
});
