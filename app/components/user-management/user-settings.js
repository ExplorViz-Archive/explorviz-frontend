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

  settings: null,

  init() {
    this._super(...arguments);

    this.get('initSettings').perform();
  },

  initSettings: task(function * () {
    let rangeSettings = this.get('store').peekAll('rangesetting');
    let flagSettings = this.get('store').peekAll('flagsetting');

    let rangeSettingsMap = new Map();
    let flagSettingsMap = new Map();

    let preferences = yield this.get('store').query('userpreference', { uid: this.get('user').get('id') });

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
      rangesettings: [...rangeSettingsMap],
      flagsettings: [...flagSettingsMap]
    });
  }),

  saveSettings: task(function * () {
    let userId = this.get('user').get('id');
    
    // group all settings
    let flagSettings = this.get('settings').flagsettings;
    let rangeSettings = this.get('settings').rangesettings;
    let allSettings = [].concat(flagSettings, rangeSettings);
    
    let settingsPromiseArray = [];

    // Update user's preferences by updating old records
    // or by creating and saving new ones.
    for(let i = 0; i < allSettings.length; i++) {
      let settingId = allSettings[i][0];
      let preferenceValueNew = allSettings[i][1];

      let oldRecord = this.get('userSettings').getUserPreference(userId, settingId);

      if(oldRecord) {
        oldRecord.set('value', preferenceValueNew);
        oldRecord.save();
      } else {
        const preferenceRecord = this.get('store').createRecord('userpreference', {
          userId,
          settingId,
          value: preferenceValueNew
        });
        settingsPromiseArray.push(preferenceRecord.save());
      }
    }

    // wait for all recorsd to be saved. Give out error if one fails
    yield new all(settingsPromiseArray).then(()=>{
      this.showAlertifySuccess('Settings saved.');
    }).catch((reason)=>{
      const {title, detail} = reason.errors[0];
      this.showAlertifyError(`<b>${title}:</b> ${detail}`);
    });
  }).drop()
});
