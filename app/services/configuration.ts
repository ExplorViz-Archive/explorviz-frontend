import Service from '@ember/service';
import { set } from '@ember/object';

type ColorString = string;

type LandscapeColors = {
  system: ColorString,
  nodegroup: ColorString,
  node: ColorString,
  application: ColorString,
  communication: ColorString,
  systemText: ColorString,
  nodeText: ColorString,
  applicationText: ColorString,
  collapseSymbol: ColorString,
  background: ColorString
};

type ApplicationColors = {
  foundation: ColorString,
  componentOdd: ColorString,
  componentEven: ColorString,
  clazz: ColorString,
  highlightedEntity: ColorString,
  componentText: ColorString,
  clazzText: ColorString,
  foundationText: ColorString,
  communication: ColorString,
  communicationArrow: ColorString,
  background: ColorString
};

export type ExtensionDescription = {
  id: string,
  title: string,
  link: string,
  nestedRoute: string,
  paneName: string
};

export type DiscoverySettings = {
  showHiddenEntities?: boolean
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
  * Current colors for landscape visualization
  *
  * @property landscapeColors
  * @type LandscapeColors
  */
  landscapeColors: LandscapeColors;

  /**
  * Current colors for application visualization
  *
  * @property applicationColors
  * @type ApplicationColors
  */
  applicationColors: ApplicationColors;

  /**
  * Default colors for landscape visualization
  *
  * @property landscapeColorsDefault
  * @type LandscapeColors
  */
  landscapeColorsDefault: LandscapeColors = {
    system: '#c7c7c7', // grey
    nodegroup: '#169e2b', // dark green
    node: '#00bb41', // green
    application: '#3e14a0', // purple-blue
    communication: '#f49100', // orange
    systemText: '#000000', // black
    nodeText: '#ffffff', // white
    applicationText: '#ffffff', // white
    collapseSymbol: '#000000', // black
    background: '#ffffff', // white
  };

  /**
  * Default colors for application visualization
  *
  * @property applicationColorsDefault
  * @type ApplicationColors
  */
  applicationColorsDefault: ApplicationColors = {
    foundation: '#c7c7c7', // grey
    componentOdd: '#169e2b', // dark green
    componentEven: '#00bb41', // light green
    clazz: '#3e14a0', // purple-blue
    highlightedEntity: '#ff0000', // red
    componentText: '#ffffff', // white
    clazzText: '#ffffff', // white
    foundationText: '#000000', // black
    communication: '#f49100', // orange
    communicationArrow: '#000000', // black
    background: '#ffffff', // white
  };

  discoverySettings: DiscoverySettings = {};


  constructor() {
    super(...arguments);
    this.landscapeColors = { ...this.landscapeColorsDefault };
    this.applicationColors = { ...this.applicationColorsDefault };
  }

  /**
   * Resets all visualization colors to default values
   * Needs to be a deep copy of the object, otherwise the default
   * colors got overridden when the colors are in the extension
   */
  resetColors() {
    set(this, 'landscapeColors', { ...this.landscapeColorsDefault });
    set(this, 'applicationColors', { ...this.applicationColorsDefault });
  }
}

declare module '@ember/service' {
  interface Registry {
    'configuration': Configuration;
  }
}
