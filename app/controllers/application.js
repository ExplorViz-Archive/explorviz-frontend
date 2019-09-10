import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

/**
* TODO
*
* @class Application-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule page
*/
export default Controller.extend({
  
  session: service(),
  currentUser: service(),
  userSettings: service(),

  loadUserAndSettings: task(function * () {
    this._loadCurrentUser();
    yield this._loadCurrentUserPreferences();
    yield this._loadSettingsAndTypes();
  }),

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate({ message: 'User could not be loaded' }));
  },

  async _loadCurrentUserPreferences() {
    let userId = this.get('session').get('session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      await this.store.query('userpreference', { userId }).catch(() => this.get('session').invalidate({message: 'User preferences could not be loaded'}));
    } else {
      this.get('session').invalidate({ message: 'Session invalid' });
    }
  },

  async _loadSettingsAndTypes() {
    try {
      // request all settings and load into store
      let settings = await this.get('store').query('settingsinfo', 1);
      // get all setting types and save them for future access
      let types = new Set();
      for (let i = 0; i < settings.get('length'); i++) {
        types.add(settings.objectAt(i).constructor.modelName);
      }
      this.get('userSettings').set('types', types);
    } catch(e) {
      this.get('session').invalidate({ message: 'Settings could not be loaded' });
    }
  }

});
