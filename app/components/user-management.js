import Component from '@ember/component';
import { inject as service } from "@ember/service";

import $ from 'jquery';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  store: service(),

  // rather request a list of roles from backend?
  roles: ["admin", "user"],
  roleChecked: [false, false],

  actions: {
    saveUser() {
      const userData = this.getProperties('username', 'password');

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: ["admin"]
      });

      userRecord.save();
    },

    saveMultipleUsers() {
      const userData = this.getProperties('usernameprefix', 'numberofusers');

      let userRoles = [];

      for(let i = 0; i < this.roles.length; i++) {
        if(this.roleChecked[i])
          userRoles.push(this.roles[i]);
      }

      for(let i = 1; i <= userData.numberofusers; i++) {
        const username = `${userData.usernameprefix}_${i}`;
        const password = "test123";

        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles: userRoles
        });

        userRecord.save();
      }
      
    }  
  },

});