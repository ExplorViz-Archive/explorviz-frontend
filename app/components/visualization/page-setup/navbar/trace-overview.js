import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',
  additionalData: service(),

  actions: {
    showTraces() {
      this.get('additionalData').addComponent("visualization/page-setup/trace-selection");
      this.get('additionalData').openAdditionalData();
    }
  }
});
