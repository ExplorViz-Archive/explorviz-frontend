import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  landscapeListener: service("landscape-listener"),
  
  actions: {
    toggleVisualizationReload() {
      const self = this;
      
      const pauseReload = this.get('landscapeListener').pauseVisualizationReload;
      
      self.handleMessageForUser(pauseReload);
      self.get('landscapeListener').toggleVisualizationReload();
    }
  },

  handleMessageForUser(pauseReload) {
    if(!pauseReload) {
      AlertifyHandler.showAlertifyMessage("Visualization paused!");
    }
    else {
      AlertifyHandler.showAlertifyMessage("Visualization resumed!");
    }
  }

});