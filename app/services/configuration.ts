import Service from '@ember/service';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';

export type LandscapeColors = {
  system: THREE.Color,
  nodegroup: THREE.Color,
  node: THREE.Color,
  application: THREE.Color,
  communication: THREE.Color,
  systemText: THREE.Color,
  nodeText: THREE.Color,
  applicationText: THREE.Color,
  collapseSymbol: THREE.Color,
  background: THREE.Color
};

export type ApplicationColors = {
  foundation: THREE.Color,
  componentOdd: THREE.Color,
  componentEven: THREE.Color,
  clazz: THREE.Color,
  highlightedEntity: THREE.Color,
  componentText: THREE.Color,
  clazzText: THREE.Color,
  foundationText: THREE.Color,
  communication: THREE.Color,
  communicationArrow: THREE.Color,
  background: THREE.Color
};

export type ExtensionDescription = {
  id: string,
  title: string,
  link: string,
  nestedRoute: string,
  paneName: string
};

/**
 * The Configuration Service handles color settings for the
 * visualization and configuration extensions
 * @class Configuration-Service
 * @extends Ember.Service
 */
export default class Configuration extends Service {
  /**
  * Array for component-based settings dialogs. Any extension may push an object
  * with the name of it's settings-component and it's title in this array. See
  * the extension "colorpicker"" for exemplary usage.
  *
  * @property configurationExtensions
  * @type Array
  */
  configurationExtensions: ExtensionDescription[] = [];

  /**
  * Colors for landscape visualization
  *
  * @property landscapeColors
  * @type LandscapeColors
  */
  @tracked
  landscapeColors!: LandscapeColors;

  /**
  * Colors for application visualization
  *
  * @property applicationColors
  * @type ApplicationColors
  */
  @tracked
  applicationColors!: ApplicationColors;

  // #region APPLICATION LAYOUT

  @tracked
  commCurveHeightDependsOnDistance = true;

  // Determines height of class communication curves, 0 results in straight lines
  @tracked
  commCurveHeightMultiplier = 1;

  @tracked
  commWidthMultiplier = 1;

  commArrowThickness = 0.5;

  // #endregion APPLICATION LAYOUT

  /**
   * Sets default colors
   */
  constructor() {
    super(...arguments);

    this.instantiateColorObjects();

    const colorScheme = localStorage.getItem('colorScheme');
    this.applyColorSchemeByName(colorScheme);
  }

  instantiateColorObjects() {
    this.landscapeColors = {
      system: new THREE.Color(),
      nodegroup: new THREE.Color(),
      node: new THREE.Color(),
      application: new THREE.Color(),
      communication: new THREE.Color(),
      systemText: new THREE.Color(),
      nodeText: new THREE.Color(),
      applicationText: new THREE.Color(),
      collapseSymbol: new THREE.Color(),
      background: new THREE.Color(),
    };

    this.applicationColors = {
      foundation: new THREE.Color(),
      componentOdd: new THREE.Color(),
      componentEven: new THREE.Color(),
      clazz: new THREE.Color(),
      highlightedEntity: new THREE.Color(),
      componentText: new THREE.Color(),
      clazzText: new THREE.Color(),
      foundationText: new THREE.Color(),
      communication: new THREE.Color(),
      communicationArrow: new THREE.Color(),
      background: new THREE.Color(),
    };
  }

  applyColorSchemeByName(colorScheme: string | null) {
    switch (colorScheme) {
      case 'pastel':
        this.applyDefaultColors();
        break;
      case 'classic':
        this.applyClassicColors();
        break;
      case 'blue':
        this.applyVisuallyImpairedColors();
        break;
      case 'dark':
        this.applyDarkColors();
        break;
      default:
        this.applyDefaultColors(false);
    }
  }

  /**
   * Marks the colors in configuration as updated and triggers a view update.
   */
  updateView() {
    this.notifyPropertyChange('landscapeColors');
    this.notifyPropertyChange('applicationColors');
  }

  /**
     * Sets color values to default mode.
     * Triggers update of color configuration and colors of current view.
     */
  applyDefaultColors(persist = true) {
    const { landscapeColors } = this;

    landscapeColors.system.set('#d2d2d2'); // grey
    landscapeColors.nodegroup.set('#169e2b'); // dark green
    landscapeColors.node.set('#6bc484'); // green
    landscapeColors.application.set('#0096be'); // purple-blue
    landscapeColors.communication.set('#d6d48b'); // light grey
    landscapeColors.systemText.set('#000000'); // black
    landscapeColors.nodeText.set('#ffffff'); // white
    landscapeColors.applicationText.set('#ffffff'); // white
    landscapeColors.collapseSymbol.set('#000000'); // black
    landscapeColors.background.set('#ffffff'); // white

    const { applicationColors } = this;

    applicationColors.foundation.set('#d2d2d2'); // grey
    applicationColors.componentOdd.set('#65c97e'); // lime green
    applicationColors.componentEven.set('#3c8db0'); // desaturated cyan
    applicationColors.clazz.set('#a7cffb'); // light pastel blue
    applicationColors.highlightedEntity.set('#ff5151'); // pastel red
    applicationColors.componentText.set('#ffffff'); // white
    applicationColors.clazzText.set('#ffffff'); // white
    applicationColors.foundationText.set('#000000'); // black
    applicationColors.communication.set('#d6d48b'); // dark grey
    applicationColors.communicationArrow.set('#000000'); // black
    applicationColors.background.set('#ffffff'); // white

    this.updateView();

    if (persist) {
      localStorage.setItem('colorScheme', 'default');
    }
  }

  /**
     * Sets color values to classic mode.
     * Triggers update of color configuration and colors of current view.
     */
  applyClassicColors(persist = true) {
    const { landscapeColors } = this;

    landscapeColors.system.set('#c7c7c7'); // grey
    landscapeColors.nodegroup.set('#169e2b'); // dark green
    landscapeColors.node.set('#00bb41'); // green
    landscapeColors.application.set('#3e14a0'); // purple-blue
    landscapeColors.communication.set('#f49100'); // orange
    landscapeColors.systemText.set('#000000'); // black
    landscapeColors.nodeText.set('#ffffff'); // white
    landscapeColors.applicationText.set('#ffffff'); // white
    landscapeColors.collapseSymbol.set('#000000'); // black
    landscapeColors.background.set('#ffffff'); // white

    const { applicationColors } = this;

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

    this.updateView();

    if (persist) {
      localStorage.setItem('colorScheme', 'classic');
    }
  }

  /**
     * Updates color values such that they better suit visually impaired users.
     * Triggers update of color configuration and colors of current view.
     */
  applyVisuallyImpairedColors(persist = true) {
    const { landscapeColors } = this;

    landscapeColors.system.set('#c7c7c7'); // grey
    landscapeColors.nodegroup.set('#015a6e'); // dark green
    landscapeColors.node.set('#0096be'); // green
    landscapeColors.application.set('#5f5f5f'); // purple-blue
    landscapeColors.communication.set('#f49100'); // orange
    landscapeColors.systemText.set('#000000'); // black
    landscapeColors.nodeText.set('#ffffff'); // white
    landscapeColors.applicationText.set('#ffffff'); // white
    landscapeColors.collapseSymbol.set('#000000'); // black
    landscapeColors.background.set('#ffffff'); // white

    const { applicationColors } = this;

    applicationColors.foundation.set('#c7c7c7'); // grey
    applicationColors.componentOdd.set('#015a6e'); // blue
    applicationColors.componentEven.set('#0096be'); // light blue
    applicationColors.clazz.set('#f7f7f7'); // white
    applicationColors.highlightedEntity.set('#ff0000'); // red
    applicationColors.componentText.set('#ffffff'); // white
    applicationColors.clazzText.set('#ffffff'); // white
    applicationColors.foundationText.set('#000000'); // black
    applicationColors.communication.set('#f49100'); // orange
    applicationColors.communicationArrow.set('#000000'); // black
    applicationColors.background.set('#ffffff'); // white

    this.updateView();

    if (persist) {
      localStorage.setItem('colorScheme', 'impaired');
    }
  }

  /**
     * Sets color values to dark values.
     * Triggers update of color configuration and colors of current view.
     */
  applyDarkColors(persist = true) {
    const { landscapeColors } = this;

    landscapeColors.system.set('#c7c7c7'); // grey
    landscapeColors.nodegroup.set('#000000'); // black
    landscapeColors.node.set('#2f3d3b'); // light black
    landscapeColors.application.set('#5B7B88'); // dark grey
    landscapeColors.communication.set('#e3e3e3'); // light grey
    landscapeColors.nodeText.set('#ffffff'); // white
    landscapeColors.applicationText.set('#ffffff'); // white
    landscapeColors.background.set('#acacac'); // stone grey

    const { applicationColors } = this;

    applicationColors.foundation.set('#c7c7c7'); // grey
    applicationColors.componentOdd.set('#2f3d3b'); // dark grey
    applicationColors.componentEven.set('#5B7B88'); // grey
    applicationColors.clazz.set('#4073b6'); // blue
    applicationColors.highlightedEntity.set('#ff0000'); // red
    applicationColors.componentText.set('#ffffff'); // white
    applicationColors.clazzText.set('#ffffff'); // white
    applicationColors.foundationText.set('#000000'); // black
    applicationColors.communication.set('#e3e3e3'); // light grey
    applicationColors.communicationArrow.set('#000000'); // black
    applicationColors.background.set('#acacac'); // stone grey

    this.updateView();

    if (persist) {
      localStorage.setItem('colorScheme', 'dark');
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'configuration': Configuration;
  }
}
