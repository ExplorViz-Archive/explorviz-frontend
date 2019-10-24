import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import { action } from '@ember/object';

export default class EventOpener extends Component {

  // No Ember generated container
  tagName = '';

  @service('additional-data') additionalData!: AdditionalData;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @action
  showEvents() {
    const latestLandscape = this.landscapeRepo.latestLandscape;
    if(latestLandscape !== null) {
      if (latestLandscape.events.length === 0){
        AlertifyHandler.showAlertifyMessage("No events found!");
        return;
      }
      this.additionalData.addComponent("visualization/page-setup/sidebar/event-viewer");
      this.additionalData.openAdditionalData();
    }
  }

}

