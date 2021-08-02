import Component from '@glimmer/component';
import UserSettings, { FlagSettings } from 'explorviz-frontend/services/user-settings';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  flagSettings: FlagSettings;
}

export default class Settings extends Component<Args> {
  @service('user-settings')
  userSettings!: UserSettings;

  @action
  updateFlagSetting(name: keyof FlagSettings, value: boolean) {
    this.userSettings.updateFlagSetting(name, value);
  }
}
