import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';

type Setting = 'rangesetting' | 'flagsetting';

export default class UserSettings extends Service {

  @service('store') store!: DS.Store;

  types = new Set<string>();

  /**
   * Returns the matching user preference, if existent.
   * 
   * @param {string} userId - The user's id
   * @param {string} settingId - The settings's id
   * @memberof UserSettings
   */
  getUserPreference(this: UserSettings, userId:string, settingId:string) {
    let allPreferences = this.store.peekAll('userpreference');
    let userPreference = allPreferences.filterBy('userId', userId).filterBy('settingId', settingId).objectAt(0);
      
    return userPreference;
  }

  /**
   * Returns the value of the matching user preference, if existent, or the default value as fallback.
   * 
   * @param {string} userId - The user's id
   * @param {Setting} type - The preferences type, currently 'rangesetting' or 'flagsetting'
   * @param {string} settingId - The settings's id
   * @memberof UserSettings
   */
  getUserPreferenceOrDefaultValue(this: UserSettings, userId:string, type: Setting, settingId:string) : number|boolean|undefined {
    let userPreference = this.getUserPreference(userId, settingId);

    if(userPreference !== undefined)
      return userPreference.value;

    let settings = this.store.peekAll(type);

    for(let i = 0; i < settings.length; i++) {
      let setting = settings.objectAt(i);
      if(setting !== undefined) {
        let id = setting.id;
        if(settingId === id) {
          return setting.defaultValue;
        }
      }
    }

    return undefined;
  }
}

declare module '@ember/service' {
  interface Registry {
    'user-settings': UserSettings;
  }
}
