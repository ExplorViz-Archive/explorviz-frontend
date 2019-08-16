import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import ApplicationRouteMixin from
  'ember-simple-auth/mixins/application-route-mixin';
import { resolve, all } from 'rsvp';
import ENV from 'explorviz-frontend/config/environment';

const { environment } = ENV;

/**
* TODO
* 
* @class Application-Route
* @extends Ember.Route
*/
export default Route.extend(ApplicationRouteMixin, {

  routeAfterAuthentication: 'visualization',
  session: service(),
  currentUser: service(),
  userSettings: service(),

  beforeModel() {
    if (environment === 'test')
      return resolve();

    return new all([
      this._loadCurrentUser(),
      this._loadCurrentUserPreferences(),
      this._loadSettingsAndTypes()
    ]);
  },

  sessionAuthenticated() {
    this._super(...arguments);

    if (environment === 'test')
      return;

    this._loadCurrentUser();
    this._loadCurrentUserPreferences();
    this._loadSettingsAndTypes();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate({ message: 'User could not be loaded' }));
  },

  _loadCurrentUserPreferences() {
    let userId = this.get('session').get('session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      return this.store.query('userpreference', { userId }).catch(() => this.get('session').invalidate({message: 'User preferences could not be loaded'}));
    } else {
      this.get('session').invalidate({ message: 'Session invalid' });
      return resolve();
    }
  },

  _loadSettingsAndTypes() {
    let settings;
    // request all settings and load into store
    settings = this.get('store').query('settingsinfo', 1);
    // get all setting types and save them for future access
    settings.then(() => {
      let types = new Set();
      for (let i = 0; i < settings.get('length'); i++) {
        types.add(settings.objectAt(i).constructor.modelName);
      }
      this.get('userSettings').set('types', types);
    }, () => {
      this.get('session').invalidate({ message: 'Settings could not be loaded' });
    });
    return resolve();
  },

  actions: {
    logout() {
      this.get('session').invalidate({ message: "Logout successful" });
    }
  }

});