import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  store: service(),

  actions: {
    saveUser() {
      const userData = this.getProperties('username', 'password');

      const userRecord = this.get('store').createRecord('user', {
        id: "-1",
        username: userData.username,
        password: userData.password,
        roles: ["admin"]
      });

      userRecord.save();
    }  
  },

});