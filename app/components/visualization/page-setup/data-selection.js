import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({
  // No Ember generated container
  tagName: '',

  additionalData: service('additional-data'),

  actions: {
      closeWindow() {
          this.set('additionalData.showWindow', false);
      }
    },

});
