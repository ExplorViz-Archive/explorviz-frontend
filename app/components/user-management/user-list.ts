import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask, enqueueTask } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';
import CurrentUser from 'explorviz-frontend/services/current-user';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface IArgs {
  users: DS.RecordArray<User>|null|undefined;
  page: number;
  size: number;
  pageSizes: number;
  refreshUsers(): Transition;
  deleteUsers(users: User[]): Promise<User[]>;
  goToPage(page: number): void;
  changePageSize(size: number): void;
}

export default class UserList extends Component<IArgs> {
  @service('store') store!: DS.Store;

  @service('router') router!: RouterService;

  @service('current-user') currentUser!: CurrentUser;

  get showDeleteUsersButton() {
    return Object.values(this.selected).some(Boolean);
  }

  get allSelected() {
    return this.selectedCount !== 0 && Object.values(this.selected).every(Boolean);
  }

  get selectedCount() {
    return Object.entries(this.selected).length;
  }

  @tracked
  selected: {[userId: string]: boolean} = {};

  @tracked
  showDeleteUsersDialog: boolean = false;

  @enqueueTask*
  deleteUsers() {
    // delete all selected users
    const listOfUsersToDelete: User[] = [];
    Object.entries(this.selected).forEach(([id, bool]) => {
      if (bool) {
        const user = this.store.peekRecord('user', id);
        if (user !== null) {
          listOfUsersToDelete.push(user);
        }
      }
    });

    try {
      yield this.args.deleteUsers(listOfUsersToDelete);
      AlertifyHandler.showAlertifySuccess('All users successfully deleted.');
    } catch (reason) {
      UserList.showReasonErrorAlert(reason);
    } finally {
      this.showDeleteUsersDialog = false;
    }
  }

  @dropTask*
  // eslint-disable-next-line
  updateUserList() {
    yield this.args.refreshUsers();
  }

  @dropTask*
  openUserCreation() {
    yield this.router.transitionTo('configuration.usermanagement.new');
  }

  @dropTask*
  openUserEdit(userId: string) {
    yield this.router.transitionTo('configuration.usermanagement.edit', userId);
  }

  @enqueueTask*
  deleteUser(user: User) {
    try {
      const { username } = user;
      yield this.args.deleteUsers([user]);
      const message = `User <b>${username}</b> deleted.`;
      AlertifyHandler.showAlertifyMessage(message);
    } catch (reason) {
      UserList.showReasonErrorAlert(reason);
    }
  }

  @action
  resetTable(tableElement: HTMLDivElement) {
    tableElement.scrollTo(0, 0);
    this.resetCheckboxes();
  }

  resetCheckboxes() {
    // init checkbox values
    const selectedNew: {[userId: string]: boolean} = {};
    const { users } = this.args;
    if (users instanceof DS.RecordArray) {
      const userArray = users.toArray();
      userArray.forEach((user) => {
        if (this.currentUser.user !== user) {
          selectedNew[user.id] = false;
        }
      });
    }
    this.selected = selectedNew;
  }

  @action
  selectCheckbox(userId: string) {
    const selectedNew = { ...this.selected };
    selectedNew[userId] = !selectedNew[userId];
    this.selected = selectedNew;
  }

  @action
  selectAllCheckboxes() {
    const value = !this.allSelected;
    const selectedNew: {[userId: string]: boolean} = { ...this.selected };
    Object.entries(selectedNew).forEach(([id]) => {
      selectedNew[id] = value;
    });
    this.selected = selectedNew;
  }

  @action
  openUserDeletionDialogue() {
    this.showDeleteUsersDialog = true;
  }

  @action
  hideUserDeletionDialogue() {
    this.showDeleteUsersDialog = false;
  }

  isCurrentUser(user: User) {
    return user === this.currentUser.user;
  }

  static showReasonErrorAlert(reason: any) {
    const { title, detail } = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }
}
