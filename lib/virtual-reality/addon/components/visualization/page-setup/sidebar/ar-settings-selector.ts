import Component from '@glimmer/component';
import { action } from '@ember/object';
import ArSettings from 'virtual-reality/services/ar-settings';
import { inject as service } from '@ember/service';

interface ArSettingsSelectorArgs {
  removeComponent(componentPath: string): void
}

export default class ArSettingsSelector extends Component<ArSettingsSelectorArgs> {
  @service('ar-settings')
  arSettings!: ArSettings;

  @action
  close() {
    this.args.removeComponent('ar-settings-selector');
  }

  @action
  updateLandscapeOpacity(event: any) {
    this.arSettings.setLandscapeOpacity(event.target.value);
  }

  @action
  updateApplicationOpacity(event: any) {
    this.arSettings.setApplicationOpacity(event.target.value);
  }
}
