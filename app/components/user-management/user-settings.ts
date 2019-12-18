import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency-decorators';
import { all } from 'rsvp';

import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import DS from 'ember-data';
import UserSettings from 'explorviz-frontend/services/user-settings';
import User from 'explorviz-frontend/models/user';
import { set } from '@ember/object';
import Setting from 'explorviz-frontend/models/setting';

type Settings = {
  [origin: string]: {
    [settingsype:string]: [[string, any]]|[]
  }
};

export default class UserManagementUserSettings extends Component {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;
  @service('session') session!: any;
  @service('user-settings') userSettings!: UserSettings;

  // set through hb template
  user:User|null = null;

  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  settings:Settings = {};

  /*
    {
      origin1: boolean1,
      origin2: boolean2
      ...
    }
  */
  useDefaultSettings:{[origin:string]: boolean} = {};

  init() {
    super.init();

    set(this, 'useDefaultSettings', {});

    this.initSettings.perform();
  }

  @task
  initSettings = task(function * (this:UserManagementUserSettings) {
    if(this.user === null) {
      return;
    }
    // load all settings from store
    let settingTypes = [...this.userSettings.types];
    let allSettings:Setting[] = [];
    for (const type of settingTypes) {
      let settings = yield this.store.peekAll(type);
      allSettings.pushObjects(settings.toArray());
    }

    let origins = [...new Set(allSettings.mapBy('origin'))];
    let preferences = yield this.store.query('userpreference', { userId: this.user.id });

    // stores settings by origin and type
    let settingsByOrigin:Settings = {};

    for(let i = 0; i < origins.length; i++) {
      this.useDefaultSettings[origins[i]] = true;
      let settingsWithOrigin = allSettings.filterBy('origin', origins[i]);

      // use default settings for settings of origin if there are no user preferences for it
      for(let j = 0; j < preferences.get('length'); j++) {
        if(settingsWithOrigin.filterBy('id', preferences.objectAt(j).get('settingId')).length > 0) {
          this.useDefaultSettings[origins[i]] = false;
          break;
        }
      }

      // initialize settings object for origin containing arrays for every type
      settingsByOrigin[origins[i]] = {};
      for (const type of settingTypes) {
        settingsByOrigin[origins[i]][type] = [];
      }
    }

    // copy all settings to settingsByOrigin
    // use default if no perefenrece exists for user, else use preference value
    for(let i = 0; i < allSettings.length; i++) {
      let setting = allSettings[i];
      let preference = preferences.findBy('settingId', setting.get('id'));
      let value;
      if(preference !== undefined)
        value = preference.get('value');
      else
        value = setting.get('defaultValue');

      // @ts-ignore
      settingsByOrigin[setting.origin][setting.constructor.modelName].push([setting.id, value]);
    }

    set(this, 'settings', settingsByOrigin);
  });

  @task({ drop: true })
  saveSettings = task(function * (this:UserManagementUserSettings) {
    if(this.user === null) {
      return;
    }
    let userId = this.user.id;

    const settings = Object.entries(this.settings);
    
    let settingsPromiseArray = [];

    for (const [origin, settingsGroupedByType] of settings) {
      let allSettings = [...Object.values(settingsGroupedByType)].flat();

      // patch, create or delete preference based on whether the default button for
      // the corresponding origin is enabled or not and whether or not a prefenrece already exists
      for(let i = 0; i < allSettings.length; i++) {
        let settingId = allSettings[i][0];
        let preferenceValueNew = allSettings[i][1];

        let oldRecord = this.userSettings.getUserPreference(userId, settingId);

        if(oldRecord) {
          // delete preference if user wants default settings
          if(this.useDefaultSettings[origin]) {
            settingsPromiseArray.push(oldRecord.destroyRecord());
          } else { // edit preference if user does not want default settings
            set(oldRecord, 'value', preferenceValueNew);
            settingsPromiseArray.push(oldRecord.save());
          }
        } else if(!this.get('useDefaultSettings')[origin]) { // create preference if user used default settings before
          const preferenceRecord = this.store.createRecord('userpreference', {
            userId,
            settingId,
            value: preferenceValueNew
          });
          settingsPromiseArray.push(preferenceRecord.save());
        }
      }
    }

    // wait for all records to be saved. Give out error if one fails
    yield all(settingsPromiseArray).then(()=>{
      AlertifyHandler.showAlertifySuccess('Settings saved.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
    });
  });
}
