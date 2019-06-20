import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  router: service(),

  currentUser: service(),

  users: null,

  allSelected: null,
  selected: null,

  showDeleteUsersButton: null,
  showDeleteUsersDialog: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('roles', []);
    this.set('showNewUsers', false);

    this.set('allSelected', false);
    this.set('selected', {});
    this.set('showDeleteUsersButton', false);
    this.set('showDeleteUsersDialog', false);

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
      // init checkbox values
      this.set('allSelected', false);
      this.set('selected', {});
      for(const user of userList) {
        if(this.get('currentUser.user') !== user)
          this.set(`selected.${user.get('id')}`, false);
      }
      this.set('showDeleteUsersButton', false);
    } catch(reason) {
      this.showAlertifyMessage('Could not load users!');
    }
  }).enqueue(),

  deleteUsers: task(function * () {
    // delete all selected users
    let settingsPromiseArray = [];
    for(const [id, bool] of Object.entries(this.get('selected'))) {
      if(bool) {
        let user = this.get('store').peekRecord('user', id);
        settingsPromiseArray.push(user.destroyRecord());
      }
    }

    // should do an all settled here to make sure all promises are resolved
    // and only then update the user list
    yield new all(settingsPromiseArray).then(()=>{
      this.showAlertifySuccess('All users successfully deleted.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      this.showAlertifyError(`<b>${title}:</b> ${detail}`);
    }).finally(() => {
      this.get('updateUserList').perform();
      this.set('showDeleteUsersDialog', false);
    });

  }).enqueue(),

  actions: {
    selectCheckbox(userId) {
      this.toggleProperty(`selected.${userId}`);
      let allTrue = Object.values(this.get('selected')).every(Boolean);
      this.set('allSelected', allTrue);
      this.set('showDeleteUsersButton', Object.values(this.get('selected')).some(Boolean));
    },
    selectAllCheckboxes() {
      this.toggleProperty('allSelected');
      let value = this.get('allSelected');
      for(const [id] of Object.entries(this.get('selected'))) {
        this.set(`selected.${id}`, value);
      }
      this.set('showDeleteUsersButton', Object.values(this.get('selected')).some(Boolean));
    }
  },

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