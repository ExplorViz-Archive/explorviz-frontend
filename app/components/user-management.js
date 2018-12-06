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
    this.set('page', 'createSingleUser');
    this.updateUserList();
  },

  updateUserList() {
    this.set('users', []);
    this.get('store').findAll('user')
      .then(users => {
        this.propertyWillChange('users');
        users.forEach(user => {
          this.get('users').push(user);
        });
        this.propertyDidChange('users');
      })
  },

  actions: {
    saveUser() {
      const userData = this.getProperties('username', 'password', 'roles_selected_single');

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: userData.roles_selected_single
      });

      userRecord.save().then(() => {
        const message = "User <b>" + userData.username + "</b> was created.";
        this.showAlertifyMessage(message);
        this.updateUserList();
      }, () => {
        const message = "User " + userData.username + " could <b>not</b> be created.";
        this.showAlertifyMessage(message);
      });
    },

    saveMultipleUsers() {
      const {'usernameprefix': userNamePrefix, numberofusers, 'roles_selected_multiple': roles} = 
        this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');

      const numberOfUsers = parseInt(numberofusers);

      let usersSuccess = [];
      let usersNoSuccess = [];
      for(let i = 1; i <= numberOfUsers; i++) {
        const username = `${userNamePrefix}_${i}`;
        const password = "test123";
        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles
        });
        userRecord.save().then(() => { // success
          usersSuccess.push(i);
          if(usersSuccess.length === numberOfUsers) {
            const message = `All <b>${numberOfUsers}</b> users were successfully created.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
          } else if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
          }
        }, () => { // failure
          usersNoSuccess.push(i);
          if(usersSuccess.length + usersNoSuccess.length === numberOfUsers) {
            const message = `<b>${usersSuccess.length}</b> users were created.<br><b>${usersNoSuccess.length}</b> failed.`;
            this.showAlertifyMessage(message);
            this.updateUserList();
          }
        });
      }
    }  
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })

});