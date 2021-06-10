import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Configuration, { LandscapeColors, ApplicationColors } from 'explorviz-frontend/services/configuration';

interface Args {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
  updateView(): void
}

export default class ColorPicker extends Component<Args> {
  @service('configuration')
  configuration!: Configuration;

  @action
  applyColorScheme(scheme: string) {
    this.configuration.applyColorSchemeByName(scheme);

    this.args.updateView();
  }

  @action
  close() {
    this.args.removeComponent('color-picker');
  }

  @action
  setupLandscapeColorpicker(colorName: keyof LandscapeColors, element: HTMLElement) {
    const configColor = this.configuration.landscapeColors[colorName];
    this.setupColorpicker(element, configColor);
  }

  @action
  setupApplicationColorPicker(colorName: keyof ApplicationColors, element: HTMLElement) {
    const configColor = this.configuration.applicationColors[colorName];
    this.setupColorpicker(element, configColor);
  }

  /**
   * Initilizes a given colorpicker element with a passed color.
   * Additionally, the color update event is handled.
   *
   * @param element The HTML colorpicker element
   * @param configColor Reference to the respective color in the configuration service
   */
  setupColorpicker(element: HTMLElement, configColor: THREE.Color) {
    // eslint-disable-next-line
    $(`#${element.id}`)
    // @ts-ignore
      .colorpicker(
        {
          color: configColor.getHexString(),
          format: 'hex',
          useAlpha: false,
        },
      ).on('colorpickerChange', (e: any) => {
        const inputColor = e.color.toHexString();
        configColor.set(inputColor);

        this.args.updateView();
      });
  }
}
