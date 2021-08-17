import Component from '@glimmer/component';
import UserSettings, { FlagSettings, RangeSettings } from 'explorviz-frontend/services/user-settings';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  flagSettings: FlagSettings;
  rangeSettings: RangeSettings;
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

    this.userSettings.updateRangeSetting(name, input.valueAsNumber);
  }
}
