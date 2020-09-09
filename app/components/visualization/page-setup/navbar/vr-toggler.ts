import { action } from '@ember/object';
import Component from '@glimmer/component';

interface VrTogglerArgs {
  switchToVR: () => void;
}

export default class VrToggler extends Component<VrTogglerArgs> {
  @action
  openVrMode() {
    this.args.switchToVR();
  }
}
