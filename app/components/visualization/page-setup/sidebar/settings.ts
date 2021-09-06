import Component from '@glimmer/component';
import UserSettings, {
  ApplicationSettingId, ApplicationSettings, LandscapeHoveringSettingId, LandscapeSettingId, SettingGroup,
} from 'explorviz-frontend/services/user-settings';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  isLandscapeView: boolean;
  updateHighlighting?(): void;
  updateColors?(): void;
  redrawCommunication?(): void;
}

export default class Settings extends Component<Args> {
  @service('user-settings')
  userSettings!: UserSettings;

  get applicationSettingsSortedByGroup() {
    const { applicationSettings } = this.userSettings;

    const settingGroupToSettingIds: Record<SettingGroup, ApplicationSettingId[]> = {
      'Hover Effects': [],
      Colors: [],
      Communication: [],
      Highlighting: [],
    };

    let settingId: keyof ApplicationSettings;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (settingId in applicationSettings) {
      const setting = applicationSettings[settingId];
      settingGroupToSettingIds[setting.group].push(settingId);
    }

    let settingGroupId: SettingGroup;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (settingGroupId in settingGroupToSettingIds) {
      const settingArray = settingGroupToSettingIds[settingGroupId];
      settingArray.sort(
        (settingId1, settingId2) => applicationSettings[settingId1].orderNumber
            - applicationSettings[settingId2].orderNumber,
      );
    }

    return settingGroupToSettingIds;
  }

  @action
  updateRangeSetting(name: ApplicationSettingId | LandscapeSettingId, event: Event) {
    const input = event.target as HTMLInputElement;

    if (this.args.isLandscapeView) {
      /*       try {
        this.userSettings.updateApplicationSetting(name as ApplicationSettingId,
          input.valueAsNumber);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      } */
    } else {
      const settingId = name as ApplicationSettingId;
      try {
        this.userSettings.updateApplicationSetting(settingId,
          input.valueAsNumber);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      }

      switch (settingId) {
        case 'transparencyIntensity':
          if (this.args.updateHighlighting) {
            this.args.updateHighlighting();
          }
          break;
        case 'commArrowSize':
          if (this.args.redrawCommunication && this.args.updateHighlighting) {
            this.args.redrawCommunication();
            this.args.updateHighlighting();
          }
          break;
        case 'curvyCommHeight':
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

  @action
  updateFlagSetting(name: ApplicationSettingId | LandscapeSettingId, value: boolean) {
    if (this.args.isLandscapeView) {
      /*       try {
        this.userSettings.updateApplicationSetting(name as ApplicationSettingId,
          input.valueAsNumber);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      } */
    } else {
      const settingId = name as ApplicationSettingId;
      try {
        this.userSettings.updateApplicationSetting(settingId,
          value);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      }

      switch (settingId) {
        default:
          break;
      }
    }
  }

  @action
  updateColorSetting(name: ApplicationSettingId | LandscapeSettingId, value: string) {
    if (this.args.isLandscapeView) {
      /*       try {
        this.userSettings.updateApplicationSetting(name as ApplicationSettingId,
          input.valueAsNumber);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      } */
    } else {
      const settingId = name as ApplicationSettingId;
      try {
        this.userSettings.updateApplicationSetting(settingId,
          value);
      } catch (e) {
        AlertifyHandler.showAlertifyError(e.message);
      }

      switch (settingId) {
        default:
          break;
      }
    }
  }
}
