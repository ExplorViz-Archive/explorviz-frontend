import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface Args {
  addComponent(componentPath: string): void
}

export default class EventOpener extends Component<Args> {
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @action
  showEvents() {
    const { latestLandscape } = this.landscapeRepo;
    if (latestLandscape !== null) {
      if (latestLandscape.events.length === 0) {
        AlertifyHandler.showAlertifyMessage('No events found!');
        return;
      }
      this.args.addComponent('visualization/page-setup/sidebar/event-viewer');
    }
  }
}
