import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import { isEmpty } from '@ember/utils';
import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

import { resolve, all } from 'rsvp';

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

  beforeModel() {
    return new all([
      this._loadCurrentUser(),
      this._loadCurrentUserPreferences(),
      this._loadSettings()
    ]);
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
    this._loadCurrentUserPreferences();
    this._loadSettings();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate({message: 'User could not be loaded'}));
  },

  _loadCurrentUserPreferences() {
    let userId = this.get('session').get('session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      return this.store.query('userpreference', { uid: userId }).catch(() => this.get('session').invalidate({message: 'User preferences could not be loaded'}));
    } else {
      this.get('session').invalidate({message: 'Session invalid'});
      return resolve();
    }
  },

  _loadSettings() {
    return this.get('store').findAll('settingsinfo').catch(() => this.get('session').invalidate({message: 'Settings could not be loaded'}));
  },

  actions: {
      logout() {
        this.get('session').invalidate({message: "Logout successful"});
      }
    }

});