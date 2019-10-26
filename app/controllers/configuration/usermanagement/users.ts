import Controller from '@ember/controller';
import { observes } from '@ember-decorators/object';

export default class ConfigurationUsermanagementUsers extends Controller {
  queryParams = ['page', 'size'];
  page = 0;
  size = 10;

  // If page would be empty, redirect to valid page
  // Could happen if on last page and all users are delted
  @observes('page', 'size', 'model')
  updateInvalidPage() {
    if(this.model) {
      let maxPage = this.model.meta.pagination.last.number;
      if(this.page > maxPage) {
        this.transitionToRoute('configuration.usermanagement.users', { queryParams: { page: maxPage }});
      } else if(this.page < 0) {
        this.transitionToRoute('configuration.usermanagement.users', { queryParams: { page: 0 }});
      }
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'configuration/usermanagement/users': ConfigurationUsermanagementUsers;
  }
}
