import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Auth0Error } from 'auth0-js';
import Auth from 'explorviz-frontend/services/auth';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default class BaseRoute extends Route {
  @service
  auth!: Auth;

  async beforeModel() {
    // this is where we check if a user is authenticated
    // if not authenticated, kick them to the home page
    return new Promise<void>((resolve, reject) => {
      this.auth.checkLogin().then(() => {
        resolve();
      }).catch((e: Auth0Error) => {
        if (e.description) {
          AlertifyHandler.showAlertifyWarning(e.description);
        }
        if (e.statusCode !== 429) {
          this.auth.logout();
        }
        reject();
      });
    });
  }
}
