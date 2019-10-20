import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import DS from 'ember-data';
import { Router } from '@ember/routing';
import CurrentUser from 'explorviz-frontend/services/current-user';
import { action, set } from '@ember/object';
import User from 'explorviz-frontend/models/user';
// @ts-ignore
import { waitForProperty } from 'ember-concurrency';
import { observes } from '@ember-decorators/object';
import $ from 'jquery';

export default class UserList extends Component {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;
  @service('router') router!: Router;

  @service('current-user') currentUser!: CurrentUser;

  users: DS.RecordArray<User>|null = null;

  refreshUsers !: Function;

  allSelected:boolean = false;
  selected:{[userId: string]: boolean} = {};

  showDeleteUsersButton:boolean = false;
  showDeleteUsersDialog:boolean = false;

  showNewUsers:boolean = false;

  pageSizes:number[] = [5, 10, 25, 50];

  init() {
    super.init();
    
    this.resetCheckboxes();
  }

  @observes('users')
  resetTable() {
    if(this.users !== null) {
      $("#user-list-table-div").animate({ scrollTop: 0 }, "fast");
      this.resetCheckboxes();
    }
  }

  resetCheckboxes() {
    // init checkbox values
    set(this, 'allSelected', false);
    set(this, 'selected', {});
    const users = this.users;
    if(users !== null) {
      users.forEach(user => {
        if(this.currentUser.user !== user)
          this.selected[user.id] = false;
      });
    }
    set(this, 'showDeleteUsersButton', false);
  }

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
      AlertifyHandler.showAlertifySuccess('All users successfully deleted.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
    }).finally(() => {
      this.updateUserList();
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

  @action
  updateUserList() {
    set(this, 'users', null);
    this.refreshUsers();
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
      AlertifyHandler.showAlertifyMessage(message);
      this.updateUserList();
    } catch(reason) {
      this.showReasonErrorAlert(reason);
    }
  });

  showReasonErrorAlert(reason:any) {
    const {title, detail} = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

}