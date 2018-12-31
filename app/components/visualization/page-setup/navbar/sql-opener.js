import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  additionalData: service(),

  actions: {
    showSql() {
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/sql-viewer");
      this.get('additionalData').openAdditionalData();
    },
  },

});
