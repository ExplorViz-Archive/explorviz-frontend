import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface VrTogglerArgs {
  switchToVR: () => void;
}

export default class VrToggler extends Component<VrTogglerArgs> {
  @tracked
  xrActive: Boolean;

  @tracked
  tooltip: string;

  constructor(owner: any, args: VrTogglerArgs) {
    super(owner, args);

    this.xrActive = false;
    this.tooltip = 'WEBXR NOT AVAILABLE';

    if ('xr' in navigator) {
      // @ts-ignore
      navigator.xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        if (supported) {
          this.xrActive = true;
          this.tooltip = 'Switch to Virtual Reality';
        }
      });
    }
  }

  @action
  openVrMode() {
    if (this.xrActive) {
      this.args.switchToVR();
    }
  }
}
