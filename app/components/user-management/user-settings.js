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

  // set through hb template
  user: null,

  settings: null,

  init() {
    this._super(...arguments);

    this.get('initSettings').perform();
  },

  initSettings: task(function * () {
    yield this.get('store').findAll('settingsinfo');

    let rangeSettings = this.get('store').peekAll('rangesetting');
    let flagSettings = this.get('store').peekAll('flagsetting');

    let rangeSettingsMap = new Map();
    let flagSettingsMap = new Map();

    let preferences = yield this.get('store').query('userpreference', this.get('user').get('id'));
    for(let i = 0; i < rangeSettings.get('length'); i++) {
      let setting = rangeSettings.objectAt(i);
      rangeSettingsMap.set(setting.get('id'), setting.get('defaultValue'));
    }
    for(let i = 0; i < flagSettings.get('length'); i++) {
      let setting = flagSettings.objectAt(i);
      flagSettingsMap.set(setting.get('id'), setting.get('defaultValue'));
    }

    for(let i = 0; i < preferences.length; i++) {
      let setting = preferences.objectAt(i);
      if(setting !== undefined) {
        if(typeof setting.get('value') === 'number')
        rangeSettingsMap.set(setting.get('settingId'), setting.get('value'));
        else
        flagSettingsMap.set(setting.get('settingId'), setting.get('value'));
      }
    }

    this.set('settings', {
      rangeSettings: [...rangeSettingsMap],
      flagSettings: [...flagSettingsMap]
    });
  }),

  saveSettings: task(function * () {
    let uid = this.get('user').get('id');
    
    // group all settings
    let flagSettings = this.get('settings').flagSettings;
    let rangeSettings = this.get('settings').rangeSettings;
    let allSettings = [].concat(flagSettings, rangeSettings);
    
    let settingsPromiseArray = [];

    // Update user's preferences by removing old records
    // and saving new ones.
    for(let i = 0; i < allSettings.length; i++) {
      let oldRecord = this.getUserPreference(uid, allSettings[i][0]);
      if(oldRecord)
        oldRecord.unloadRecord();

      const preferenceRecord = this.get('store').createRecord('userpreference', {
        userId: uid,
        settingId: allSettings[i][0],
        value: allSettings[i][1]
      });
      settingsPromiseArray.push(preferenceRecord.save());
    }

    // wait for all recorsd to be saved. Give out error if one fails
    yield new all(settingsPromiseArray).then(()=>{
      this.showAlertifySuccess('Settings saved.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      this.showAlertifyError(`<b>${title}:</b> ${detail}`);
    });
  }).drop(),

  /**
   * Returns the matching user preference
   * 
   * @param {string} userId 
   * @param {string} settingId 
   */
  getUserPreference(userId, settingId) {
    // prefer a version that's already in the store
    let allPreferences = this.get('store').peekAll('userpreference');
    let userPreference = allPreferences.filterBy('userId', userId).filterBy('settingId', settingId).objectAt(0);

    if(userPreference !== undefined)
      return userPreference;
  }
});
