import Component from '@ember/component';
import { typeOf } from '@ember/utils';
import { inject as service } from "@ember/service";

export default Component.extend({
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),

  settings: null,
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
    this.set('settings', []);
    Object.entries(usersettings).forEach(
      ([key, value]) => {
        if(key === 'id')
          return;

        const type = typeOf(value);

        this.get('settings').push({
          key,
          value,
          type
        });

        this.set(`${key}_${this.get('user').id}`, value);
      }
    );
  },

  actions: {
    // saves the changes made to the actual model and backend
    // TODO: handle boolean values through properties as well
    saveSettings() {
      this.get('settings').forEach(setting => {
        // get new setting value
        const settingProperty = this.get(`${setting.key}_${this.get('user').id}`);

        if(setting.type === 'number') {
          const newVal = Number(settingProperty);
          // newVal might be NaN
          if(newVal) {
            this.set(`user.settings.${setting.key}`, newVal);
          }
        } else if(setting.type === 'string') {
          this.set(`user.settings.${setting.key}`, settingProperty);
        } else if(setting.type === 'boolean') {
          this.set(`user.settings.${setting.key}`, setting.value);
        }
      });

/*      this.get('user').save().then(function() {
        console.log('Success')
      }, function() {
        console.log('Error')
      }); */
    }
  },

  willDestroyElement() {
    this.set('user', null);
    this.set('settings', null);
  }

});
