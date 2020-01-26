import Controller from '@ember/controller';
import { action } from '@ember/object';
import User from 'explorviz-frontend/models/user';
import { all, reject } from 'rsvp';

export default class ConfigurationUsermanagementUsers extends Controller {
  queryParams = ['page', 'size'];
  page = 0;
  size = 10;

  // tslint:disable-next-line: no-magic-numbers
  pageSizes: number[] = [5, 10, 25, 50];

  @action
  async deleteUsers(users: User[]) {
    if (users.length <= 0) {
      return reject({
        errors: [{
          detail: 'No users selected for deletion',
          title: 'Invalid selection',
        }],
      });
    }

    const settingsPromiseArray: Array<Promise<User>> = [];
    users.forEach((user) => {
      settingsPromiseArray.push(user.destroyRecord());
    });
    return all(settingsPromiseArray).finally(() => {
      this.send('refreshRoute');
    });
  }

  @action
  changePageSize(size: number) {
    if (size > 0) {
      this.set('size', size);
    }
  }

  @action
  goToPage(page: number) {
    if (page >= 0 && page <= this.model.meta.pagination.last.number) {
      this.set('page', page);
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'configuration/usermanagement/users': ConfigurationUsermanagementUsers;
  }
}
