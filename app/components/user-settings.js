import Component from '@ember/component';
import { typeOf } from '@ember/utils';
import { inject as service } from "@ember/service";

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),

  booleans: null,
  numbers: null,
  strings: null,
  // set through hb template, else is set to logged-in user
  user: null,

  didInsertElement() {
    this.initializeSettingsArray();
  },

  initializeSettingsArray() {
    let user = this.get('user');
    if(!user) {
      this.set('user', this.get('session.session.content.authenticated.user'));
      user = this.get('user');
    }

    const usersettings = user.settings;

    this.set('booleans', {});
    this.set('numbers', {});
    this.set('strings', {});

    Object.entries(usersettings).forEach(
      ([key, value]) => {
        if(key === 'id')
          return;

        const type = typeOf(value);

        if(type === 'boolean') {
          this.get('booleans')[key] = value;
        } else if(type === 'number') {
          this.get('numbers')[key] = value;
        } else {
          this.get('strings')[key] = value;
        }
      }
    );
  },

  actions: {
    // saves the changes made to the actual model and backend
    saveSettings() {
      Object.entries(this.get('booleans')).forEach(([key, value]) => {
        this.set(`user.settings.${key}`, value);
      });

      Object.entries(this.get('numbers')).forEach(([key, value]) => {
        // get new setting value
        const newVal = Number(value);

        // newVal might be NaN
        if(newVal) {
          this.set(`user.settings.${key}`, newVal);
        }
      });

      Object.entries(this.get('strings')).forEach(([key, value]) => {
        this.set(`user.settings.${key}`, value);
      });

      this.get('user').save().then(() => {
        this.showAlertifyMessage('Settings saved.');
      }, reason => {
        const {title, detail} = reason.errors[0];
        this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
        // reload model rollback the properties
        this.get('user').reload();
      });
    }
  },

  willDestroyElement() {
    this.set('user', null);
    this.set('settings', null);
  }

});
