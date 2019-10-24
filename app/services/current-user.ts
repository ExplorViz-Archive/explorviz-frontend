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

  get id(this: CurrentUser) {
    return this.get('user').get('id');
  }

  get username(this: CurrentUser) {
    return this.get('user').get('username');
  }

  /**
   * Loads user from session and sets user property accordingly
   *
   * @returns Promise
   * @memberof CurrentUser
   */
  load(this:CurrentUser) {
    let userId = this.get('session').get('session.content.authenticated.rawUserData.data.id');
    if (!isEmpty(userId)) {
      const user = this.get('store').peekRecord('user', userId);
      if(user !== null) {
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
  getPreference(this:CurrentUser, settingId:string) {
    let userId = this.get('id');

    if(userId === undefined)
      return undefined;

    return this.get('userSettings').getUserPreference(userId, settingId);
  }

  /**
   * Returns the value of a userpreference for current user matching given settingId and type.
   *
   * @param {Setting} type - {@link CurrentUser:user}
   * @param {string} settingId
   * @returns
   * @memberof CurrentUser
   */
  getPreferenceOrDefaultValue(this:CurrentUser, type: Setting, settingId:string) {
    let userId = this.get('id');

    if(userId === undefined)
      return undefined;

    return this.get('userSettings').getUserPreferenceOrDefaultValue(userId, type, settingId);
  }
}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUser;
  }
}
