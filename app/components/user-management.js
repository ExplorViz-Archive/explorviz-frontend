import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  printThis: service(),

  roles: null,
  users: null,
  page: null,
  showNewUsers: null,

  init(){
    this._super(...arguments);
    this.set('roles', []);
    this.set('page', 'main');
    this.set('showNewUsers', false);
    this.updateUserList();
  },

  updateUserList() {
    this.set('users', []);
    this.get('store').findAll('user')
      .then(users => {
        users.forEach(user => {
          this.get('users').push(user);
        });
        // sort by id
        this.get('users').sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1);
        this.notifyPropertyChange('users');
      });
  },

  actions: {
    printNewUsers() {
      const selector = '#new-user-list';
      const options = {
        printDelay: 500
      }
 
      this.get('printThis').print(selector, options);
    },

    hideNewUsersCreatedModal() {
      this.set('createdUsers', []);
      this.set('showNewUsers', false);
    },

    openCreateSingleUserPage() {
      this.set('page', 'createSingleUser');
    },

    openMainPage() {
      this.set('page', 'main');
    },

    openEditUserPage(user) {
      this.set('page', 'editUser');

      this.setProperties({
        id_change: user.id,
        username_change: user.username,
        roles_change: user.roles,
      });
    },

    saveUser() {
      const userData = this.getProperties('username', 'password', 'roles_selected_single');

      // check for valid input
      if(!userData.username || userData.username.length === 0) {
        this.showAlertifyMessage('Username cannot be empty.');
        return;
      } else if(!userData.password || userData.password.length === 0) {
        this.showAlertifyMessage('Password cannot be empty.');
        return;
      } else if(!userData.roles_selected_single || userData.roles_selected_single.length === 0) {
        this.showAlertifyMessage('User needs at least 1 role.');
        return;
      }

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: userData.roles_selected_single
      });

      userRecord.save().then(() => { // success
        const message = "User <b>" + userData.username + "</b> was created.";
        this.showAlertifyMessage(message);
        this.updateUserList();
        this.actions.openMainPage.bind(this)();
      }, (reason) => { // failure
        showReasonErrorAlert(reason);
        userRecord.deleteRecord();
        this.updateUserList();
      });
    },

    saveMultipleUsers() {
      const PASSWORD_LENGTH = 8;

      const userData = this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');
      const numberOfUsers = parseInt(userData.numberofusers);

      // check for valid input
      if(!userData.usernameprefix || userData.usernameprefix.length === 0) {
        this.showAlertifyMessage('Username prefix cannot be empty.');
        return;
      } else if(!userData.numberofusers || numberOfUsers <= 1) {
        this.showAlertifyMessage('# of users must be at least 2.');
        return;
      } else if(!userData.roles_selected_multiple || userData.roles_selected_multiple.length === 0) {
        this.showAlertifyMessage('Users need at least 1 role.');
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
          roles: userData.roles_selected_multiple
        });

        userRecord.save().then(() => { // success
          usersSuccess.push(userRecord);
          if(usersSuccess.length === numberOfUsers) {
            const message = `All <b>${numberOfUsers}</b> users were successfully created.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
            this.actions.openMainPage.bind(this)();

            this.showCreatedUsers(usersSuccess);

          } else if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
            
            if(usersSuccess.length > 0) {
              this.showCreatedUsers(usersSuccess);
            }
          }
        }, () => { // failure
          usersNoSuccess.push(i);
          userRecord.deleteRecord();
          if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();

            if(usersSuccess.length > 0) {
              this.showCreatedUsers(usersSuccess);
            }
          }
        });
      }
    },

    saveUserChanges() {
      const userData = this.getProperties('id_change', 'username_change', 'password_change', 'roles_change');

      const user = this.get('users').find( user => user.get('id') == userData.id_change);

      if(user) {
        // check for valid input
        if(!userData.username_change || userData.username_change.length === 0) {
          this.showAlertifyMessage('Username cannot be empty.');
          return;
        } else if(!userData.roles_change || userData.roles_change.length === 0) {
          this.showAlertifyMessage('User needs at least 1 role.');
          return;
        }
        
        if(user.get('username') !== userData.username_change)
          user.set('username', userData.username_change);
        
        if(userData.password_change && userData.password_change !== '')
          user.set('password', userData.password_change);
  
        user.set('roles', userData.roles_change);
  
        user.save()
          .then(()=> {
            const message = `User updated.`;
            this.showAlertifyMessage(message);
            this.actions.openMainPage.bind(this)();
          }, (reason) => {
            this.showReasonErrorAlert(reason);
          });
      } else {
        this.showAlertifyMessage(`User not found.`);
      }
    },

    deleteUser(user) {
      user.destroyRecord()
        .then(() => { // success
          const message = `User <b>${user.username}</b> deleted.`;
          this.showAlertifyMessage(message);
          this.updateUserList();
        }, (reason) => { // failure
          showReasonErrorAlert(reason);
          this.updateUserList();
        }
        );
    }
  },

  showReasonErrorAlert(reason) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
  },

  showCreatedUsers(userList) {
    this.set('createdUsers', userList.sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1));
    this.set('showNewUsers', true);
  },

  generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for(let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })

});