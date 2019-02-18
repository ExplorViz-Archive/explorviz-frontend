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

  init() {
    this._super(...arguments);
  },

  saveSettings: task(function * () {
    try {
      yield this.get('user').save();
      this.showAlertifyMessage('Settings saved.');
    } catch(reason) {
      const {title, detail} = reason.errors[0];
      this.showAlertifyMessage(`<b>${title}:</b> ${detail}`);
      // reload model and rollback the properties
      this.get('user').reload();
    }
  }).drop(),

  willDestroyElement() {
    this.get('user').reload();
    this._super(...arguments);
  }

});
