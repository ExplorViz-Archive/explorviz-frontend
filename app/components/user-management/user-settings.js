import Component from '@ember/component';
import { inject as service } from "@ember/service";

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {
  
  // No Ember generated container
  tagName: '',

  store: service(),
  session: service(),

  showSpinner: null,

  booleans: null,
  numerics: null,
  strings: null,
  // set through hb template, else is set to logged-in user
  user: null,

  // workaround for release 1.3
  // remove when usersettings descriptions are implemented
  descriptions: null,

  didInsertElement() {
    this.set('showSpinner', true);
    this.initUser();
    this.initAttributeProperties();
    this.set('showSpinner', false);

    this.set('descriptions', {});
    this.get('descriptions')["showFpsCounter"] = "'Frames Per Second' metrics in visualizations";
    this.get('descriptions')["appVizTransparency"] = "Transparency effect for selection (left click) in application visualization";
    this.get('descriptions')["enableHoverEffects"] = "Hover effect (flashing entities) for mouse cursor";
    this.get('descriptions')["keepHighlightingOnOpenOrClose"] = "Transparency effect for selection (left click) in application visualization";
    this.get('descriptions')["appVizCommArrowSize"] = "Arrow Size for selected communications in application visualization";
    this.get('descriptions')["appVizTransparencyIntensity"] = "Transparency effect intensity ('appVizTransparency' must be enabled)";
  },

  initUser() {
    if(!this.get('user')) {
      this.set('user', this.get('session.session.content.authenticated.user'));
    }
  },

  initAttributeProperties() {
    const usersettings = this.get('user').settings;

    this.set('booleans', {});
    this.set('numerics', {});
    this.set('strings', {});

    Object.entries(usersettings.booleanAttributes).forEach(
      ([key, value]) => {
        this.set(`booleans.${key}`, value);
      }
    );
    Object.entries(usersettings.numericAttributes).forEach(
      ([key, value]) => {
        this.set(`numerics.${key}`, value);
      }
    );
    Object.entries(usersettings.stringAttributes).forEach(
      ([key, value]) => {
        this.set(`strings.${key}`, value);
      }
    );
  },

  actions: {
    // saves the changes made to the actual model and backend
    saveSettings() {
      this.set('showSpinner', true);
      //Update booleans
      Object.entries(this.get('booleans')).forEach(([key, value]) => {
        this.set(`user.settings.booleanAttributes.${key}`, value);
      });

      //Update numerics
      Object.entries(this.get('numerics')).forEach(([key, value]) => {
        // get new setting value
        const newVal = Number(value);

        // newVal might be NaN
        if(newVal) {
          this.set(`user.settings.numericAttributes.${key}`, newVal);
        }
      });

      //Update strings
      Object.entries(this.get('strings')).forEach(([key, value]) => {
        this.set(`user.settings.stringAttributes.${key}`, value);
      });

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
  }

});
