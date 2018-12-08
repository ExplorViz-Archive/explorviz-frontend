import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Component.extend({

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
  },

  actions: {
    saveUser() {
      const userData = this.getProperties('username', 'password', 'roles_selected_single');

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: userData.roles_selected_single
      });

      userRecord.save();
    },

    saveMultipleUsers() {
      const {'usernameprefix': userNamePrefix, 'numberofusers': numberOfUsers, 'roles_selected_multiple': roles} = 
        this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');

      for(let i = 1; i <= numberOfUsers; i++) {
        const username = `${userNamePrefix}_${i}`;
        const password = "test123";
        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles
        });
        userRecord.save();
      }
      
    }  
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })

});