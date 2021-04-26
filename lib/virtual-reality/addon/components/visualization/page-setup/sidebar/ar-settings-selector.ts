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
  buttonSize: number;

  @tracked
  buttonPadding: number;

  constructor(owner: any, args: ArSettingsSelectorArgs) {
    super(owner, args);

    this.buttonSize = ArSettingsSelector.getCssVminSize('--ar-button-size');
    this.buttonPadding = ArSettingsSelector.getCssVminSize('--ar-button-padding');

    /*
    if (root) {
      const buttonSizeString = getComputedStyle(root).getPropertyValue('--ar-button-size');
      const currentButtonSize = Number.parseFloat(
        buttonSizeString.substring(0, buttonSizeString.length - 4),
      );
      this.buttonSize = currentButtonSize;

      const buttonPaddingString = getComputedStyle(root).getPropertyValue('--ar-button-padding');
      const currentButtonPadding = Number.parseFloat(
        buttonPaddingString.substring(0, buttonPaddingString.length - 4),
      );
      this.buttonPadding = currentButtonPadding;
    } else {
      this.buttonSize = 5;
      this.buttonPadding = 2;
    }
    */
  }

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

  static getCssVminSize(variable: string) {
    const root = document.querySelector(':root')!;

    const cssString = getComputedStyle(root).getPropertyValue(variable);
    const cssValue = Number.parseFloat(cssString.replace('vmin', ''));

    return cssValue;
  }
}
