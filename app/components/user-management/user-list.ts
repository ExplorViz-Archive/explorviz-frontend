import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from "@ember/service";
import { all } from 'rsvp';

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import DS from 'ember-data';
import CurrentUser from 'explorviz-frontend/services/current-user';
import { action, computed } from '@ember/object';
import User from 'explorviz-frontend/models/user';
import RouterService from '@ember/routing/router-service';
import { addObserver, removeObserver } from '@ember/object/observers';
import Transition from '@ember/routing/-private/transition';

interface Args {
  refreshUsers(): Transition,
  users: DS.RecordArray<User>|null|undefined,
  page: number,
  size: number
}

export default class UserList extends Component<Args> {

  @service('store') store!: DS.Store;
  @service('router') router!: RouterService;

  @service('current-user') currentUser!: CurrentUser;

  @tracked
  selected:{[userId: string]: boolean} = {};

  @tracked
  showDeleteUsersDialog:boolean = false;

  pageSizes:number[] = [5, 10, 25, 50];

  // needs to be a computed property.
  // Otherwise the observer won't work
  @computed('args.users')
  get users() {
    return this.args.users;
  }

  constructor(owner:any, args:any) {
    super(owner, args);

    addObserver(this, 'users', this.resetTable);
    this.resetCheckboxes();
  }

  get showDeleteUsersButton() {
    return Object.values(this.selected).some(Boolean);
  }

  get allSelected() {
    return Object.values(this.selected).every(Boolean);
  }

  resetTable() {
    const tableElement = document.querySelector('#user-list-table-div');
    if(tableElement !== null) {
      tableElement.scrollTo(0, 0);
    }
    this.resetCheckboxes();
  }

  resetCheckboxes() {
    // init checkbox values
    let selectedNew:{[userId: string]: boolean} = {};
    const { users } = this.args;
    if(users instanceof DS.RecordArray) {
      let userArray = users.toArray();
      for(let user of userArray) {
        if(this.currentUser.user !== user)
          selectedNew[user.id] = false;
      }
    }
    this.selected = selectedNew;
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
      this.updateUserList.perform();
      this.showDeleteUsersDialog = false;
    });

  });

  @action
  selectCheckbox(userId:string) {
    let selectedNew = { ...this.selected };
    selectedNew[userId] = !selectedNew[userId];
    this.selected = selectedNew;
  }

  @action
  selectAllCheckboxes() {
    let value = !this.allSelected;
    let selectedNew:{[userId: string]: boolean} = {...this.selected};
    for(const [id] of Object.entries(selectedNew)) {
      selectedNew[id] = value;
    }
    this.selected = selectedNew;
  }

  @task({ drop: true })
  updateUserList = task(function * (this: UserList) {
    yield this.args.refreshUsers();
  });

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
      this.updateUserList.perform();
    } catch(reason) {
      this.showReasonErrorAlert(reason);
    }
  });

  showReasonErrorAlert(reason:any) {
    const {title, detail} = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

  willDestroy() {
    removeObserver(this, 'users', this.resetTable);
  }

}