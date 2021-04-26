import Component from '@glimmer/component';
import { action } from '@ember/object';
import ArSettings from 'virtual-reality/services/ar-settings';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface ArSettingsSelectorArgs {
  removeComponent(componentPath: string): void
}

export default class ArSettingsSelector extends Component<ArSettingsSelectorArgs> {
  @service('ar-settings')
  arSettings!: ArSettings;

  @tracked
  buttonSize = 5;

  @tracked
  buttonPadding = 2;

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

  @action
  updateButtonSize(event: any) {
    const size = event.target.value;
    this.buttonSize = size;

    ArSettingsSelector.setCssVariable('--ar-button-size', `${size}vmin`);
  }

  @action
  updateButtonSpacing(event: any) {
    const padding = event.target.value;
    this.buttonPadding = padding;

    ArSettingsSelector.setCssVariable('--ar-button-padding', `${padding}vmin`);
  }

  static setCssVariable(variable: string, value: string) {
    const root = document.querySelector(':root');
    if (root) {
      (<HTMLElement>root).style.setProperty(variable, value);
    }
  }
}
