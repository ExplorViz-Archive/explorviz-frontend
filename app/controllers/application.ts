import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency-decorators';
import CurrentUser from 'explorviz-frontend/services/current-user';
import UserSettings from 'explorviz-frontend/services/user-settings';
import Auth from 'explorviz-frontend/services/auth';

/**
 * TODO
 *
 * @class Application-Controller
 * @extends Ember.Controller
 *
 * @module explorviz
 * @submodule page
 */
export default class ApplicationController extends Controller {
  @service('session') session!: any;

  @service('current-user') currentUser!: CurrentUser;

  @service('user-settings') userSettings!: UserSettings;

  @service('auth') auth!: Auth;

  @service('router') router!: any;

  @task
  // eslint-disable-next-line
  loadUserAndSettings = task(function* (this: ApplicationController) {
    yield this.loadCurrentUser();
/*     if (this.session.isAuthenticated) {
      yield this.loadCurrentUserPreferences();
      yield this.loadSettingsAndTypes();
    } */
  });

  async loadCurrentUser() {
    return this.currentUser.load().catch(() => this.session.invalidate({ message: 'User could not be loaded' }));
  }

  async loadCurrentUserPreferences() {
    const userId = get(this.session, 'session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      await this.store.query('userpreference', { userId }).catch(() => {
        this.session.invalidate({ message: 'User preferences could not be loaded' });
      });
    } else {
      this.session.invalidate({ message: 'Session invalid' });
    }
  }

  async loadSettingsAndTypes() {
    try {
      // request all settings and load into store
      const settings = await this.store.query('settingsinfo', {});
      // get all setting types and save them for future access
      const types: Set<string> = new Set();
      for (let i = 0; i < settings.get('length'); i++) {
        // @ts-ignore
        types.add(settings.objectAt(i).constructor.modelName);
      }
      set(this.userSettings, 'types', types);
    } catch (e) {
      this.session.invalidate({ message: 'Settings could not be loaded' });
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'applicationController': ApplicationController;
  }
}
