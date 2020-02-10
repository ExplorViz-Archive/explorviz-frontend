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
    system: 'rgb(199, 199, 199)',
    nodegroup: 'rgb(22, 158, 43)',
    node: 'rgb(0, 187, 65)',
    application: 'rgb(62, 20, 160)',
    communication: 'rgb(244, 145, 0)',
    systemText: 'rgb(0, 0, 0)',
    nodeText: 'rgb(255, 255, 255)',
    applicationText: 'rgb(255, 255, 255)',
    collapseSymbol: 'rgb(0, 0, 0)',
    background: 'rgb(255, 255, 255)',
  };

  /**
  * Default colors for application visualization
  *
  * @property applicationColorsDefault
  * @type ApplicationColors
  */
  applicationColorsDefault: ApplicationColors = {
    foundation: 'rgb(199, 199, 199)',
    componentOdd: 'rgb(22, 158, 43)',
    componentEven: 'rgb(0, 187, 65)',
    clazz: 'rgb(62, 20, 160)',
    highlightedEntity: 'rgb(255, 0, 0)',
    componentText: 'rgb(255, 255, 255)',
    clazzText: 'rgb(255, 255, 255)',
    foundationText: 'rgb(0, 0, 0)',
    communication: 'rgb(244, 145, 0)',
    communicationArrow: 'rgb(0, 0, 0)',
    background: 'rgb(255, 255, 255)',
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
