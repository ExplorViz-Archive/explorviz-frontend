import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';
import { all } from 'rsvp';

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),
  userSettings: service(),

  // set through hb template
  user: null,

  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  settings: null,

  /*
    {
      origin1: boolean1,
      origin2: boolean2
      ...
    }
  */
  useDefaultSettings: null,

  init() {
    this._super(...arguments);

    this.set('useDefaultSettings', {});

    this.get('initSettings').perform();
  },

  initSettings: task(function * () {
    // load all settings from store
    let settingTypes = [...this.get('userSettings').get('types')];
    let allSettings = [];
    for (const type of settingTypes) {
      let settings = yield this.get('store').peekAll(type);
      allSettings.pushObjects(settings.toArray());
    }

    let origins = [...new Set(allSettings.mapBy('origin'))];
    let preferences = yield this.store.query('userpreference', { userId: this.get('user').get('id') });

    // stores settings by origin and type
    // see settings property above for structure
    let settingsByOrigin = {};

    for(let i = 0; i < origins.length; i++) {
      this.get('useDefaultSettings')[origins[i]] = true;
      let settingsWithOrigin = allSettings.filterBy('origin', origins[i]);

      // use default settings for settings of origin if there are no user preferences for it
      for(let j = 0; j < preferences.get('length'); j++) {
        if(settingsWithOrigin.filterBy('id', preferences.objectAt(j).get('settingId')).length > 0) {
          this.get('useDefaultSettings')[origins[i]] = false;
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

      settingsByOrigin[setting.origin][setting.constructor.modelName].push([setting.get('id'), value]);
    }

    this.set('settings', settingsByOrigin);
  }),

  saveSettings: task(function * () {
    let userId = this.get('user').get('id');

    const settings = Object.entries(this.get('settings'));
    
    let settingsPromiseArray = [];

    for (const [origin, settingsGroupedByType] of settings) {
      let allSettings = [].concat(...Object.values(settingsGroupedByType))

      // patch, create or delete preference based on whether the default button for
      // the corresponding origin is enabled or not and whether or not a prefenrece already exists
      for(let i = 0; i < allSettings.length; i++) {
        let settingId = allSettings[i][0];
        let preferenceValueNew = allSettings[i][1];

        let oldRecord = this.get('userSettings').getUserPreference(userId, settingId);

        if(oldRecord) {
          // delete preference if user wants default settings
          if(this.get('useDefaultSettings')[origin]) {
            settingsPromiseArray.push(oldRecord.destroyRecord());
          } else { // edit preference if user does not want default settings
            oldRecord.set('value', preferenceValueNew);
            settingsPromiseArray.push(oldRecord.save());
          }
        } else if(!this.get('useDefaultSettings')[origin]) { // create preference if user used default settings before
          const preferenceRecord = this.get('store').createRecord('userpreference', {
            userId,
            settingId,
            value: preferenceValueNew
          });
          settingsPromiseArray.push(preferenceRecord.save());
        }
      }
    }

    // wait for all records to be saved. Give out error if one fails
    yield new all(settingsPromiseArray).then(()=>{
      this.showAlertifySuccess('Settings saved.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      this.showAlertifyError(`<b>${title}:</b> ${detail}`);
    });
  }).drop()
});
