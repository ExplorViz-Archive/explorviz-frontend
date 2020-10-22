import { action } from '@ember/object';
import Component from '@glimmer/component';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import { inject as service } from '@ember/service';

interface VrTogglerArgs {
  switchToVR: () => void;
}

export default class VrToggler extends Component<VrTogglerArgs> {
  @service('landscape-listener')
  landscapeListener!: LandscapeListener;

  @action
  openVrMode() {
    if (this.landscapeListener.landscapeRepo.latestLandscape) {
      this.landscapeListener.stopVisualizationReload();
      this.args.switchToVR();
    }
  }
}
