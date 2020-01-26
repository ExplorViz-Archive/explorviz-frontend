import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default class TraceOverview extends Component {
  @service('additional-data') additionalData!: AdditionalData;
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;
  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @action
  showTraces() {
    const latestApplication = this.landscapeRepo.latestApplication;

    if (latestApplication !== null) {
      if (latestApplication.traces.length === 0) {
        AlertifyHandler.showAlertifyMessage('No Traces found!');
        return;
      }
      set(this.landscapeListener, 'pauseVisualizationReload', true);
      AlertifyHandler.showAlertifyMessage('Visualization paused!');
      this.additionalData.addComponent('visualization/page-setup/sidebar/trace-selection');
      this.additionalData.openAdditionalData();
    }
  }
}
