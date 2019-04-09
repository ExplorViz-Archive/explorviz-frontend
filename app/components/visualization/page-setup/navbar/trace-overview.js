import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  additionalData: service(),
  landscapeRepo: service('repos/landscape-repository'),
  landscapeListener: service("landscape-listener"),
  
  actions: {
    showTraces() {
      if (this.get("landscapeRepo.latestApplication.traces.length") === 0){
        this.showAlertifyMessage("No Traces found!");
        return;
      }      
      this.set('landscapeListener.pauseVisualizationReload', true);
      this.showAlertifyMessage("Visualization paused!");
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/trace-selection");
      this.get('additionalData').openAdditionalData();
    }
  }
});
