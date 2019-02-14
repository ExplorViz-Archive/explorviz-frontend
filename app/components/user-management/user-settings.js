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

  // remove later, load descriptors in user-settings-base
  descriptions: null,

  init() {
    this.set('showSpinner', true);
    this._super(...arguments);
    this.initUser();

    this.set('descriptions', {});
    this.get('descriptions')["showFpsCounter"] = "'Frames Per Second' metrics in visualizations";
    this.get('descriptions')["appVizTransparency"] = "Transparency effect for selection (left click) in application visualization";
    this.get('descriptions')["enableHoverEffects"] = "Hover effect (flashing entities) for mouse cursor";
    this.get('descriptions')["keepHighlightingOnOpenOrClose"] = "Transparency effect for selection (left click) in application visualization";
    this.get('descriptions')["appVizCommArrowSize"] = "Arrow Size for selected communications in application visualization";
    this.get('descriptions')["appVizTransparencyIntensity"] = "Transparency effect intensity ('appVizTransparency' must be enabled)";
  },

  didInsertElement() {
    this.set('showSpinner', false);
  },

  initUser() {
    if(!this.get('user')) {
      this.set('user', this.get('session.session.content.authenticated.user'));
    }
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
