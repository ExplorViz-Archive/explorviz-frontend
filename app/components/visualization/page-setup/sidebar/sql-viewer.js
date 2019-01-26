import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({
  // No Ember generated container
  tagName: '',
  landscapeRepo: service("repos/landscape-repository"),
  additionalData: service('additional-data'),

  actions: {
    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/sql-viewer");
    },
  },

});
