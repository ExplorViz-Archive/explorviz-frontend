import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  printThis: service(),

  showSpinner: null,

  createdUsers: null,
  showNewUsers: null,
  page: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('showNewUsers', false);
    this.set('page', 'createSingleUser')
  },

  actions: {
    printNewUsers() {
      const selector = '#new-user-list';
      const options = {
        printDelay: 200
      };
 
      this.get('printThis').print(selector, options);
    },

    hideNewUsersCreatedModal() {
      this.set('createdUsers', []);
      this.set('showNewUsers', false);
    },

    saveUser() {
      this.set('showSpinner', true);
      const userData = this.getProperties('username', 'password', 'roles_selected_single');

      // check for valid input
      if(!userData.username || userData.username.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Username cannot be empty.');
        return;
      } else if(!userData.password || userData.password.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Password cannot be empty.');
        return;
      } else if(!userData.roles_selected_single || userData.roles_selected_single.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('User needs at least 1 role.');
        return;
      }

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: userData.roles_selected_single,
        settings: this.get('settings')
      });

      userRecord.save().then(() => { // success
        this.set('showSpinner', false);
        const message = "User <b>" + userData.username + "</b> was created.";
        this.showAlertifySuccess(message);
        clearInputFields.bind(this)();
      }, (reason) => { // failure
        this.set('showSpinner', false);
        this.showReasonErrorAlert(reason);
        userRecord.deleteRecord();
      });

      function clearInputFields() {
        this.setProperties({
          username: "",
          password: "",
          roles_selected_single: []
        });
      }
    },

    saveMultipleUsers() {
      this.set('showSpinner', true);
      const PASSWORD_LENGTH = 8;

      const userData = this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');
      const numberOfUsers = parseInt(userData.numberofusers);

      // check for valid input
      if(!userData.usernameprefix || userData.usernameprefix.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Username prefix cannot be empty.');
        return;
      } else if(!userData.numberofusers || numberOfUsers <= 1) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('# of users must be at least 2.');
        return;
      } else if(!userData.roles_selected_multiple || userData.roles_selected_multiple.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Users need at least 1 role.');
        return;
      }

      let usersSuccess = [];
      let usersNoSuccess = [];
      for(let i = 1; i <= numberOfUsers; i++) {
        const username = `${userData.usernameprefix}_${i}`;
        const password = this.generatePassword(PASSWORD_LENGTH);
        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles: userData.roles_selected_multiple,
          settings: this.get('settings')
        });

        userRecord.save().then(() => { // success
          usersSuccess.push(userRecord);
          if(usersSuccess.length === numberOfUsers) {
            this.set('showSpinner', false);
            const message = `All <b>${numberOfUsers}</b> users were successfully created.`;
            this.showAlertifySuccess(message);
            clearInputFields.bind(this)();
            this.showCreatedUsers(usersSuccess);

          } else if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            this.set('showSpinner', false);
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyWarning(message);
            
            if(usersSuccess.length > 0) {
              this.showCreatedUsers(usersSuccess);
              clearInputFields.bind(this)();
            }
          }
        }, () => { // failure
          usersNoSuccess.push(i);
          userRecord.deleteRecord();
          if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            this.set('showSpinner', false);
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyWarning(message);

            if(usersSuccess.length > 0) {
              this.showCreatedUsers(usersSuccess);
              clearInputFields.bind(this)();
            }
          }
        });
      }

      function clearInputFields() {
        this.setProperties({
          usernameprefix: "",
          numberofusers: "",
          roles_selected_multiple: []
        });
      }
    },
  },

  generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for(let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },

  showReasonErrorAlert(reason) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyError(`<b>${title}:</b> ${detail}`);
  },

  showCreatedUsers(userList) {
    this.set('createdUsers', userList.sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1));
    this.set('showNewUsers', true);
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })
});
