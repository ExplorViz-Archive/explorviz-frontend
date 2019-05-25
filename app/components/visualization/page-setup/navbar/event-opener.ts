import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import { action } from '@ember/object';

export default class EventOpener extends Component.extend(AlertifyHandler) {

  // No Ember generated container
  tagName = '';

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @action
  showEvents() {
    const latestLandscape = this.get("landscapeRepo").get('latestLandscape');
    if(latestLandscape !== null) {
      if (latestLandscape.get('events').length === 0){
        this.showAlertifyMessage("No events found!");
        return;
      }
      this.get('additionalData').addComponent("visualization/page-setup/sidebar/event-viewer");
      this.get('additionalData').openAdditionalData();
    }
  }

}

