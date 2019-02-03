import Component from '@ember/component';
import { inject as service } from "@ember/service";

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  router: service(),

  users: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('roles', []);
    this.set('showNewUsers', false);
    this.updateUserList(true);
  },

  updateUserList(reload) {
    this.set('users', []);
    this.set('showSpinner', true);
    this.get('store').findAll('user', { reload })
      .then(users => {
        let userList = users.toArray();
        // sort by id
        userList.sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1);
          this.set('users', userList);
      });
  },

  actions: {
    openUserCreation() {
      this.get('router').transitionTo('configuration.usermanagement.new');
    },

    openUserEdit(userId) {
      this.get('router').transitionTo('configuration.usermanagement.edit', userId);
    },

    deleteUser(user) {
      user.destroyRecord()
        .then(() => { // success
          const message = `User <b>${user.username}</b> deleted.`;
          this.showAlertifyMessage(message);
          this.updateUserList(false);
        }, (reason) => { // failure
          this.showReasonErrorAlert(reason);
          this.updateUserList(true);
        });
    }
  }

});