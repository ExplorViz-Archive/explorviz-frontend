import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

export default class PauseReload extends Component {
  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @action
  toggleVisualizationReload() {
    const pauseReload = this.landscapeListener.pauseVisualizationReload;

    this.handleMessageForUser(pauseReload);
    this.landscapeListener.toggleVisualizationReload();
  }

  handleMessageForUser(pauseReload: boolean) {
    if (!pauseReload) {
      AlertifyHandler.showAlertifyMessage('Visualization paused!');
    } else {
      AlertifyHandler.showAlertifyMessage('Visualization resumed!');
    }
  }
}
