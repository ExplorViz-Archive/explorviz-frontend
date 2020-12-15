import Service, { inject as service } from '@ember/service';
import User from 'explorviz-frontend/models/user';

import { resolve, reject } from 'rsvp';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import UserSettings from './user-settings';

type Setting = 'rangesetting' | 'flagsetting';

/**
 * This Service provides easy access to the logged-in user
 * and methods to access the user's preferences
 *
 * @class CurrentUser
 * @extends {Service}
 */
export default class CurrentUser extends Service {
  @service('session') session !: any;

  @service('store') store !: DS.Store;

  @service('user-settings') userSettings !: UserSettings;

  // application route calls load(), which sets this field
  // Thus okay to mark it as not null
  user!: User;

  get id() {
    return this.user.get('id');
  }

  get username() {
    return this.user.get('username');
  }

  /**
   * Loads user from session and sets user property accordingly
   *
   * @returns Promise
   * @memberof CurrentUser
   */
  load(this: CurrentUser) {
    const userId = this.session.get('data.authenticated.profile.sub');
    if (!isEmpty(userId)) {
      const user = this.store.peekRecord('user', userId);
      if (user !== null) {
        this.set('user', user);
        return resolve();
      }
    }
    return reject();
  }

  /**
   * Returns userpreference record for current user matching given settingId
   *
   * @param {string} settingId
   * @memberof CurrentUser
   *
   */
  getPreference(settingId: string) {
    const userId = this.id;

    if (userId === undefined) {
      return undefined;
    }

    return this.userSettings.getUserPreference(userId, settingId);
  }

  /**
   * Returns the value of a userpreference for current user matching given settingId and type.
   *
   * @param {Setting} type - {@link CurrentUser:user}
   * @param {string} settingId
   * @returns
   * @memberof CurrentUser
   */
  getPreferenceOrDefaultValue(type: Setting, settingId: string) {
    const userId = this.id;

    if (userId === undefined) {
      return undefined;
    }

    return this.userSettings.getUserPreferenceOrDefaultValue(userId, type, settingId);
  }
}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUser;
  }
}
