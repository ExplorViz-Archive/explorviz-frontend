import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

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
      this.showAlertifyMessage("Visualization paused!");
    }
    else {
      this.showAlertifyMessage("Visualization resumed!");
    }
  }

});