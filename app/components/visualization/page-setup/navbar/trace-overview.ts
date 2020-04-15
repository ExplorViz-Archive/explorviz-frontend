import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface Args {
  addComponent(componentPath: string): void
}

export default class TraceOverview extends Component<Args> {
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @action
  showTraces() {
    const { latestApplication } = this.landscapeRepo;

    if (latestApplication !== null) {
      if (latestApplication.traces.length === 0) {
        AlertifyHandler.showAlertifyMessage('No Traces found!');
        return;
      }
      set(this.landscapeListener, 'pauseVisualizationReload', true);
      AlertifyHandler.showAlertifyMessage('Visualization paused!');
      this.args.addComponent('trace-selection');
    }
  }
}
