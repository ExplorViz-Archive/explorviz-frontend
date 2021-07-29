import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Configuration, { LandscapeColors, ApplicationColors } from 'explorviz-frontend/services/configuration';
import UserSettings, { ApplicationColorsHexString, LandscapeColorsHexString } from 'explorviz-frontend/services/user-settings';
import isObject from 'explorviz-frontend/utils/object-helpers';

interface Args {
  isLandscapeView: boolean;
  removeComponent(componentPath: string): void;
  updateView(): void;
}

interface ColorPickerObjectApplication {
  colorObject: THREE.Color;
  colorName: keyof ApplicationColors;
  isApplicationObject: true;
}

interface ColorPickerObjectLandscape {
  colorObject: THREE.Color;
  colorName: keyof LandscapeColors;
  isLandscapeObject: true;
}

export default class ColorPicker extends Component<Args> {
  @service('configuration')
  configuration!: Configuration;

  @service('user-settings')
  userSettings!: UserSettings;

  colorSchemes = [
    { name: 'Default', action: this.applyDefaultColors },
    { name: 'Vision Impairment', action: this.applyImpairedColors },
    { name: 'Classic (Initial)', action: this.applyClassicColors },
    { name: 'Dark', action: this.applyDarkColors },
  ];

  @action
  close() {
    this.args.removeComponent('color-picker');
  }

  @action
  setupLandscapeColorpicker(colorName: keyof LandscapeColors, element: HTMLElement) {
    const colorObject = this.configuration.landscapeColors[colorName];
    this.setupColorpicker(element, {
      colorObject,
      colorName,
      isLandscapeObject: true,
    });
  }

  @action
  setupApplicationColorPicker(colorName: keyof ApplicationColors, element: HTMLElement) {
    const colorObject = this.configuration.applicationColors[colorName];
    this.setupColorpicker(element, {
      colorObject,
      colorName,
      isApplicationObject: true,
    });
  }

  /**
   * Initilizes a given colorpicker element with a passed color.
   * Additionally, the color update event is handled.
   *
   * @param element The HTML colorpicker element
   * @param configColor Reference to the respective color in the configuration service
   */
  setupColorpicker(element: HTMLElement,
    colorPickerObject: ColorPickerObjectApplication | ColorPickerObjectLandscape) {
    // eslint-disable-next-line
    $(`#${element.id}`)
    // @ts-ignore
      .colorpicker(
        {
          color: colorPickerObject.colorObject.getHexString(),
          format: 'hex',
          useAlpha: false,
        },
      ).on('colorpickerChange', (e: any) => {
        const inputColor = e.color.toHexString();
        colorPickerObject.colorObject.set(inputColor);

        if (ColorPicker.isLandscapeObject(colorPickerObject)) {
          this.userSettings.updateLandscapeColor(colorPickerObject.colorName, inputColor);
        } else {
          this.userSettings.updateApplicationColor(colorPickerObject.colorName, inputColor);
        }

        this.args.updateView();
      });
  }

  applyColorsFromUserSettings() {
    const landscapeColors = this.userSettings.settings.colors.landscape;
    Object.entries(landscapeColors).forEach(
      ([key, value]: [keyof LandscapeColorsHexString, string]) => {
        this.configuration.landscapeColors[key].set(value);
      },
    );

    const applicationColors = this.userSettings.settings.colors.application;
    Object.entries(applicationColors).forEach(
      ([key, value]: [keyof ApplicationColorsHexString, string]) => {
        this.configuration.applicationColors[key].set(value);
      },
    );

    this.args.updateView();
  }

  /**
   * Sets color values to default.
   * Triggers update of color configuration and colors of current view.
   */
  @action
  applyDefaultColors() {
    this.userSettings.setDefaultColors();
    this.applyColorsFromUserSettings();
  }

  /**
   * Applies a dark theme to the visualization.
   * Triggers update of color configuration and colors of current view.
   */
  @action
  applyDarkColors() {
    this.userSettings.setDarkColors();
    this.applyColorsFromUserSettings();
  }

  /**
   * Sets colors to the classic colors from the good ol' days.
   * Triggers update of color configuration and colors of current view.
   */
  @action
  applyClassicColors() {
    this.userSettings.setClassicColors();
    this.applyColorsFromUserSettings();
  }

  /**
   * Updates color values such that they better suit visually impaired users.
   * Triggers update of color configuration and colors of current view.
   */
  @action
  applyImpairedColors() {
    this.userSettings.setImpairedColors();
    this.applyColorsFromUserSettings();
  }

  private static isLandscapeObject(object: unknown): object is ColorPickerObjectLandscape {
    return isObject(object) && {}.hasOwnProperty.call(object, 'isLandscapeObject');
  }
}
