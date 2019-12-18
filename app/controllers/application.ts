import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency-decorators';
import { isEmpty } from '@ember/utils';
import CurrentUser from 'explorviz-frontend/services/current-user';
import UserSettings from 'explorviz-frontend/services/user-settings';
import { get, set } from '@ember/object';

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

  @task
  loadUserAndSettings = task(function * (this:ApplicationController) {
    yield this._loadCurrentUser();
    if(this.session.isAuthenticated) {
      yield this._loadCurrentUserPreferences();
      yield this._loadSettingsAndTypes();
    }
  });

  async _loadCurrentUser() {
    return await this.currentUser.load().catch(() => this.session.invalidate({ message: 'User could not be loaded' }));
  }

  async _loadCurrentUserPreferences() {
    let userId = get(this.session, 'session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      await this.store.query('userpreference', { userId }).catch(() => {
        this.session.invalidate({ message: 'User preferences could not be loaded' })
      });
    } else {
      this.session.invalidate({ message: 'Session invalid' });
    }
  }

  async _loadSettingsAndTypes() {
    try {
      // request all settings and load into store
      let settings = await this.store.query('settingsinfo', {});
      // get all setting types and save them for future access
      let types:Set<string> = new Set();
      for (let i = 0; i < settings.get('length'); i++) {
        // @ts-ignore
        types.add(settings.objectAt(i).constructor.modelName);
      }
      set(this.userSettings, 'types', types);
    } catch(e) {
      this.session.invalidate({ message: 'Settings could not be loaded' });
    }
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'applicationController': ApplicationController;
  }
}

