import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import DS from 'ember-data';
import { Router } from '@ember/routing';
import CurrentUser from 'explorviz-frontend/services/current-user';
import { action, set } from '@ember/object';
import User from 'explorviz-frontend/models/user';

export default class UserList extends Component.extend(AlertifyHandler) {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;
  @service('router') router!: Router;

  @service('current-user') currentUser!: CurrentUser;

  users:User[] = [];

  allSelected:boolean = false;
  selected:{[userId: string]: boolean} = {};

  showDeleteUsersButton:boolean = false;
  showDeleteUsersDialog:boolean = false;

  showNewUsers:boolean = false;

  didInsertElement() {
    super.didInsertElement();

    this.updateUserList.perform(true);
  }

  @task({ enqueue: true })
  updateUserList = task(function * (this: UserList, reload: boolean) {
    set(this, 'users', []);
    try {
      let users:DS.PromiseArray<User>|DS.RecordArray<User>;
      if(reload) {
        users = yield this.store.findAll('user', { reload: true });
      } else {
        users = yield this.store.peekAll('user');
      }
      let userList = users.toArray();
      // sort by id
      userList.sort((user1:User, user2:User) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1);
      set(this, 'users', userList);
      // init checkbox values
      set(this, 'allSelected', false);
      set(this, 'selected', {});
      for(const user of userList) {
        if(this.currentUser.user !== user)
          this.selected[user.id] = false;
      }
      set(this, 'showDeleteUsersButton', false);
    } catch(reason) {
      this.showAlertifyMessage('Could not load users!');
      set(this, 'allSelected', false);
      set(this, 'users', []);
      set(this, 'selected', {});
      set(this, 'showDeleteUsersButton', false);
    }
  });

  @task({ enqueue: true })
  deleteUsers = task(function * (this: UserList) {
    // delete all selected users
    let settingsPromiseArray:Promise<User>[] = [];
    for(const [id, bool] of Object.entries(this.selected)) {
      if(bool) {
        let user = this.store.peekRecord('user', id);
        if(user !== null)
          settingsPromiseArray.push(user.destroyRecord());
      }
    }

    // should do an all settled here to make sure all promises are resolved
    // and only then update the user list
    yield all(settingsPromiseArray).then(()=>{
      this.showAlertifySuccess('All users successfully deleted.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      this.showAlertifyError(`<b>${title}:</b> ${detail}`);
    }).finally(() => {
      this.updateUserList.perform();
      set(this, 'showDeleteUsersDialog', false);
    });

  });

  @action
  selectCheckbox(userId:string) {
    set(this.selected, userId, !this.selected[userId]);
    let allTrue = Object.values(this.selected).every(Boolean);
    set(this, 'allSelected', allTrue);
    set(this, 'showDeleteUsersButton', Object.values(this.selected).some(Boolean));
  }

  @action
  selectAllCheckboxes() {
    set(this, 'allSelected', !this.allSelected);
    let value = this.allSelected;
    for(const [id] of Object.entries(this.selected)) {
      set(this.selected, id, value);
    }
    set(this, 'showDeleteUsersButton', Object.values(this.selected).some(Boolean));
  }

  @task({ drop: true })
  openUserCreation = task(function * (this: UserList) {
    yield this.router.transitionTo('configuration.usermanagement.new');
  });

  @task({ drop: true })
  openUserEdit = task(function * (this: UserList, userId: string) {
    yield this.router.transitionTo('configuration.usermanagement.edit', userId);
  });

  @task({ enqueue: true })
  deleteUser = task(function * (this: UserList, user:User) {
    try {
      let username = user.username;
      yield user.destroyRecord();
      const message = `User <b>${username}</b> deleted.`;
      this.showAlertifyMessage(message);
      yield this.updateUserList.perform(false);
    } catch(reason) {
      this.showReasonErrorAlert(reason);
      yield this.updateUserList.perform(true);
    }
  });

  showReasonErrorAlert(reason:any) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

}