import Component from '@glimmer/component';
import UserSettings, { FlagSettings, RangeSettings } from 'explorviz-frontend/services/user-settings';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  isLandscapeView: boolean;
  flagSettings: FlagSettings;
  rangeSettings: RangeSettings;
  updateHighlighting?(): void;
  updateColors?(): void;
  redrawCommunication?(): void;
}

export default class Settings extends Component<Args> {
  @service('user-settings')
  userSettings!: UserSettings;

  @action
  updateFlagSetting(name: keyof FlagSettings, value: boolean) {
    this.userSettings.updateFlagSetting(name, value);
  }

  @action
  updateRangeSetting(name: keyof RangeSettings, event: Event) {
    const input = event.target as HTMLInputElement;

    try {
      this.userSettings.updateRangeSetting(name, input.valueAsNumber);
    } catch (e) {
      AlertifyHandler.showAlertifyError(e.message);
    }

    switch (name) {
      case 'appVizTransparencyIntensity':
        if (this.args.updateHighlighting) {
          this.args.updateHighlighting();
        }
        break;
      case 'appVizCommArrowSize':
        if (this.args.redrawCommunication && this.args.updateHighlighting) {
          this.args.redrawCommunication();
          this.args.updateHighlighting();
        }
        break;
      case 'appVizCurvyCommHeight':
        if (this.args.redrawCommunication && this.args.updateHighlighting) {
          this.args.redrawCommunication();
          this.args.updateHighlighting();
        }
        break;
      default:
        break;
    }
  }
}
