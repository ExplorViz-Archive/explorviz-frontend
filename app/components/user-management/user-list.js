import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency';
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
    this.get('updateUserList').perform(true);
  },

  updateUserList: task(function * (reload) {
    this.set('users', []);
    try {
      let users;
      if(reload) {
        users = yield this.get('store').findAll('user', { reload: true });
      } else {
        users = yield this.get('store').peekAll('user');
      }
      let userList = users.toArray();
      // sort by id
      userList.sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1);
      this.set('users', userList);
    } catch(reason) {
      this.showAlertifyMessage('Could not load users!');
    }
  }).enqueue(),

  openUserCreation: task(function * () {
    yield this.get('router').transitionTo('configuration.usermanagement.new');
  }).drop(),

  openUserEdit: task(function * (userId) {
    yield this.get('router').transitionTo('configuration.usermanagement.edit', userId);
  }).drop(),

  deleteUser: task(function * (user) {
    try {
      let username = user.get('username');
      yield user.destroyRecord();
      const message = `User <b>${username}</b> deleted.`;
      this.showAlertifyMessage(message);
      yield this.get('updateUserList').perform(false);
    } catch(reason) {
      this.showReasonErrorAlert(reason);
      yield this.get('updateUserList').perform(true);
    }
  }).enqueue()

});