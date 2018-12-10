import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),

  // rather request a list of roles from backend?
  roles: null,
  users: null,
  page: null,

  init(){
    this._super(...arguments);
    this.set('roles', []);
    this.set('page', 'main');
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
        const {title, detail} = reason.errors[0];
        this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
        userRecord.deleteRecord();
        this.updateUserList();
      });
    },

    saveMultipleUsers() {
      const userData = this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');

      const numberOfUsers = parseInt(userData.numberofusers);

      let usersSuccess = [];
      let usersNoSuccess = [];
      for(let i = 1; i <= numberOfUsers; i++) {
        const username = `${userData.usernameprefix}_${i}`;
        const password = "test123";
        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles: userData.roles_selected_multiple
        });

        userRecord.save().then(() => { // success
          usersSuccess.push(i);
          if(usersSuccess.length === numberOfUsers) {
            const message = `All <b>${numberOfUsers}</b> users were successfully created.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
            this.actions.openMainPage.bind(this)();
          } else if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
          }
        }, () => { // failure
          usersNoSuccess.push(i);
          userRecord.deleteRecord();
          if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
          }
        });
      }
    },

    saveUserChanges() {
      const userData = this.getProperties('id_change', 'username_change', 'password_change', 'roles_change');

      const user = this.get('users').find( user => user.get('id') == userData.id_change);

      if(user) {
        if(user.get('username') !== userData.username_change)
          user.set('username', userData.username_change);
        
        if(userData.password_change !== null && userData.password_change !== '')
          user.set('password', userData.password_change);
  
        user.set('roles', userData.roles_change);
  
        user.save()
          .then(()=> {
            const message = `User updated.`;
            this.showAlertifyMessage(message);
            this.actions.openMainPage.bind(this)();
          }, (reason) => {
            const {title, detail} = reason.errors[0];
            this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
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
          const {title, detail} = reason.errors[0];
          this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
          this.updateUserList();
        }
        );
    }
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })

});