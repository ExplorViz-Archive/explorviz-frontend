import Component from '@glimmer/component';
import { action } from '@ember/object';

interface ArSettingsSelectorArgs {
  removeComponent(componentPath: string): void
}

export default class ArSettingsSelector extends Component<ArSettingsSelectorArgs> {
  @action
  close() {
    this.args.removeComponent('ar-settings-selector');
  }
}
