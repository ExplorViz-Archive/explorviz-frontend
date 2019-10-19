import Controller from '@ember/controller';

export default class ConfigurationUsermanagementUsers extends Controller {
  queryParams = ['page', 'size'];
  page = 0;
  size = 10;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'configuration/usermanagement/users': ConfigurationUsermanagementUsers;
  }
}
