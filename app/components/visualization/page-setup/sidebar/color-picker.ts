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

  @action
  applyColorScheme(scheme: string) {
    if (scheme === 'default') {
      this.applyDefaultColors();
    } else if (scheme === 'impaired') {
      this.applyVisuallyImpairedColors();
    }
  }

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
    colorPickerObject: ColorPickerObjectApplication|ColorPickerObjectLandscape) {
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

  /**
   * Marks the colors in configuration as updated and triggers a view update.
   */
  updateView() {
    if (this.args.isLandscapeView) {
      this.configuration.notifyPropertyChange('landscapeColors');
    } else {
      this.configuration.notifyPropertyChange('applicationColors');
    }

    this.args.updateView();
  }

  applyColorsFromUserSettings() {
    if (this.args.isLandscapeView) {
      const landscapeColors = this.userSettings.settings.visualization.colors.landscape;
      Object.entries(landscapeColors).forEach(
        ([key, value]: [keyof LandscapeColorsHexString, string]) => {
          this.configuration.landscapeColors[key].set(value);
        },
      );
    } else {
      const applicationColors = this.userSettings.settings.visualization.colors.application;
      Object.entries(applicationColors).forEach(
        ([key, value]: [keyof ApplicationColorsHexString, string]) => {
          this.configuration.applicationColors[key].set(value);
        },
      );
    }
    this.updateView();
  }

  /**
   * Sets color values to default.
   * Triggers update of color configuration and colors of current view.
   */
  applyDefaultColors() {
    if (this.args.isLandscapeView) {
      this.userSettings.applyDefaultColorsForLandscape();
    } else {
      this.userSettings.applyDefaultColorsForApplication();
    }
    this.applyColorsFromUserSettings();

    this.updateView();
  }

  /**
   * Updates color values such that they better suit visually impaired users.
   * Triggers update of color configuration and colors of current view.
   */
  applyVisuallyImpairedColors() {
    if (this.args.isLandscapeView) {
      this.userSettings.applyVisuallyImpairedColorsForLandscape();
    } else {
      this.userSettings.applyVisuallyImpairedColorsForApplication();
    }
    this.applyColorsFromUserSettings();

    this.updateView();
  }

  private static isLandscapeObject(object: unknown): object is ColorPickerObjectLandscape {
    return isObject(object) && {}.hasOwnProperty.call(object, 'isLandscapeObject');
  }
}
