import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  additionalData: service(),
  landscapeRepo: service('repos/landscape-repository'),

  actions: {
    showEvents() {
      if (this.get("landscapeRepo.latestLandscape.events.length") === 0){
        this.showAlertifyMessage("No events found!");
        return;
      }
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/event-viewer");
      this.get('additionalData').openAdditionalData();
    },
  },

});

