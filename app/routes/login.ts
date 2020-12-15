import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Auth from 'explorviz-frontend/services/auth';

/**
* TODO
*
* @class Login-Route
* @extends Ember.Route
*/
export default class LoginRoute extends Route {
  @service session: any;

  @service
  auth!: Auth;

  beforeModel() {
    this.auth.login();
  }
}
