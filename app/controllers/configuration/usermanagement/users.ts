import Controller from '@ember/controller';
import { action } from "@ember/object";
import User from 'explorviz-frontend/models/user';
import { all, reject } from 'rsvp';

export default class ConfigurationUsermanagementUsers extends Controller {
  queryParams = ['page', 'size'];
  page = 0;
  size = 10;

  pageSizes:number[] = [5, 10, 25, 50];

  @action
  async deleteUsers(users: User[]) {
    if(users.length <= 0)
      return reject({
        errors: [{
          title: 'Invalid selection',
          detail: 'No users selected for deletion'
        }]
      });

    let settingsPromiseArray:Promise<User>[] = [];
    users.forEach((user) => {
      settingsPromiseArray.push(user.destroyRecord());
    });
    return all(settingsPromiseArray).finally(() => {
      this.send('refreshRoute');
    });
  }

  @action
  changePageSize(size: number) {
    if(size > 0)
      this.set('size', size);
  }

  @action
  goToPage(page: number) {
    if(page >= 0 && page <= this.model.meta.pagination.last.number)
      this.set('page', page);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'configuration/usermanagement/users': ConfigurationUsermanagementUsers;
  }
}
