import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),

  // set through hb template, else is set to logged-in user
  user: null,

  settings: null,

  init() {
    this._super(...arguments);

    this.initSettings();
  },

  initSettings() {
    this.set('settings', {
      booleanAttributes: {},
      numericAttributes: {},
      stringAttributes: {},
    });

    this.get('copySettings').perform('booleanAttributes');
    this.get('copySettings').perform('numericAttributes');
    this.get('copySettings').perform('stringAttributes');
  },

  copySettings: task( function * (type) {
    yield Object.entries(this.get(`user.settings.${type}`)).forEach(
      ([key, value]) => {
        this.get(`settings.${type}`)[key] = value;
      }
    );
  }),

  saveSettings: task(function * () {
    let success = false;

    try {
      this.get('copySettingsToUser').perform('booleanAttributes');
      this.get('copySettingsToUser').perform('numericAttributes');
      this.get('copySettingsToUser').perform('stringAttributes');
      yield this.get('user').save();
      this.showAlertifyMessage('Settings saved.');
      success = true;
    } catch(reason) {
      const {title, detail} = reason.errors[0];
      this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
    } finally {
      if(!success)
        this.get('reloadUser').perform();
    }
  }).drop(),

  copySettingsToUser: task(function *(type) {
    yield Object.entries(this.get(`settings.${type}`)).forEach(
      ([key, value]) => {
        this.set(`user.settings.${type}.${key}`, value);
      }
    );
  }),

  reloadUser: task(function * () {
    const user = this.get('user');
    yield user.reload();
  }),

  willDestroyElement() {
    this.get('reloadUser').perform();
    this._super(...arguments);
  }
});
