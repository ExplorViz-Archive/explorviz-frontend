import Component from '@ember/component';
import { inject as service } from "@ember/service";

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),

  showSpinner: null,

  // set through hb template, else is set to logged-in user
  user: null,

  init() {
    this.set('showSpinner', true);
    this._super(...arguments);
    this.set('showSpinner', false);
  },

  actions: {
    // saves the changes made to the actual model and backend
    saveSettings() {
      this.set('showSpinner', true);

      this.get('user').save().then(() => {
        this.set('showSpinner', false);
        this.showAlertifyMessage('Settings saved.');
      }, reason => {
        const {title, detail} = reason.errors[0];
        this.set('showSpinner', false);
        this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
        // reload model and rollback the properties
        this.get('user').reload();
      });
    }
  },

  willDestroyElement() {
    this.get('user').reload();
    this._super(...arguments);
  }

});
