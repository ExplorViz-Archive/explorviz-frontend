import Route from '@ember/routing/route';

export default class UserManagementIndexRoute extends Route {

  beforeModel(this:UserManagementIndexRoute) {
    this.transitionTo('configuration.usermanagement.users');
  }
}
