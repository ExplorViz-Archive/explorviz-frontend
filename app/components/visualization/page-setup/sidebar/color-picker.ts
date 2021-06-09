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
    if (scheme === 'classic') {
      this.applyClassicColors();
    } else if (scheme === 'modern') {
      this.applyModernColors();
    } else if (scheme === 'dark') {
      this.applyDarkColors();
    }
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

  /**
   * Sets color values to classic colors.
   * Triggers update of color configuration and colors of current view.
   */
  applyClassicColors() {
    if (this.args.isLandscapeView) {
      const { landscapeColors } = this.configuration;

      landscapeColors.node.set('#00bb41'); // green
      landscapeColors.application.set('#3e14a0'); // purple-blue
      landscapeColors.communication.set('#f49100'); // orange
      landscapeColors.nodeText.set('#ffffff'); // white
      landscapeColors.applicationText.set('#ffffff'); // white
      landscapeColors.background.set('#ffffff'); // white
    } else {
      const { applicationColors } = this.configuration;
      applicationColors.foundation.set('#c7c7c7'); // grey
      applicationColors.componentOdd.set('#169e2b'); // dark green
      applicationColors.componentEven.set('#00bb41'); // light green
      applicationColors.clazz.set('#3e14a0'); // purple-blue
      applicationColors.highlightedEntity.set('#ff0000'); // red
      applicationColors.componentText.set('#ffffff'); // white
      applicationColors.clazzText.set('#ffffff'); // white
      applicationColors.foundationText.set('#000000'); // black
      applicationColors.communication.set('#f49100'); // orange
      applicationColors.communicationArrow.set('#000000'); // black
      applicationColors.background.set('#ffffff'); // white
    }

    this.updateView();
  }

  /**
   * Sets color values to default colors.
   * Triggers update of color configuration and colors of current view.
   */
  applyModernColors() {
    if (this.args.isLandscapeView) {
      const { landscapeColors } = this.configuration;

      landscapeColors.node.set('#0096be'); // light blue
      landscapeColors.application.set('#5f5f5f'); // dark grey
      landscapeColors.communication.set('#f49100'); // orange
      landscapeColors.nodeText.set('#ffffff'); // white
      landscapeColors.applicationText.set('#ffffff'); // white
      landscapeColors.background.set('#ffffff'); // white
    } else {
      const { applicationColors } = this.configuration;

      applicationColors.foundation.set('#c7c7c7'); // grey
      applicationColors.componentOdd.set('#015a6e'); // blue
      applicationColors.componentEven.set('#0096be'); // light blue
      applicationColors.clazz.set('#5f5f5f'); // dark grey
      applicationColors.highlightedEntity.set('#ff0000'); // red
      applicationColors.componentText.set('#ffffff'); // white
      applicationColors.clazzText.set('#ffffff'); // white
      applicationColors.foundationText.set('#000000'); // black
      applicationColors.communication.set('#f49100'); // orange
      applicationColors.communicationArrow.set('#000000'); // black
      applicationColors.background.set('#ffffff'); // white
    }

    this.updateView();
  }

  /**
   * Sets color values to dark values.
   * Triggers update of color configuration and colors of current view.
   */
  applyDarkColors() {
    if (this.args.isLandscapeView) {
      const { landscapeColors } = this.configuration;

      landscapeColors.node.set('#2f3d3b'); // light black
      landscapeColors.application.set('#5B7B88'); // dark grey
      landscapeColors.communication.set('#E3E3E3'); // light grey
      landscapeColors.nodeText.set('#ffffff'); // white
      landscapeColors.applicationText.set('#ffffff'); // white
      landscapeColors.background.set('#ffffff'); // white
    } else {
      const { applicationColors } = this.configuration;
      applicationColors.foundation.set('#c7c7c7'); // grey
      applicationColors.componentOdd.set('#2f3d3b'); // dark grey
      applicationColors.componentEven.set('#5B7B88'); // grey
      applicationColors.clazz.set('#a72b15'); // dark red
      applicationColors.highlightedEntity.set('#ff0000'); // red
      applicationColors.componentText.set('#ffffff'); // white
      applicationColors.clazzText.set('#ffffff'); // white
      applicationColors.foundationText.set('#000000'); // black
      applicationColors.communication.set('#E3E3E3'); // light grey
      applicationColors.communicationArrow.set('#000000'); // black
      applicationColors.background.set('#ffffff'); // white
    }

    this.updateView();
  }
}
