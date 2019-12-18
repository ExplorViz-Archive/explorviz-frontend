import Service from '@ember/service';
import { set } from '@ember/object';

type Colors = {
  [type:string]: string
}

export type ExtensionDescription = {
  id: string,
  title: string,
  link: string,
  nestedRoute: string,
  paneName: string
};

/**
* The Configuration Service handles color settings for the visualization and configuration extensions
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
  configurationExtensions:ExtensionDescription[] = [];

  /**
  * Current colors for landscape visualization
  *
  * @property landscapeColors
  * @type Object
  */
  landscapeColors:Colors = {};

  /**
  * Current colors for application visualization
  *
  * @property applicationColors
  * @type Object
  */
  applicationColors:Colors = {};

  /**
  * Default colors for landscape visualization
  *
  * @property landscapeColorsDefault
  * @type Object
  */
  landscapeColorsDefault:Colors = {};

  /**
  * Default colors for application visualization
  *
  * @property applicationColorsDefault
  * @type Object
  */
  applicationColorsDefault:Colors = {};


  constructor() {
    super(...arguments);
    this.initDefaultColors();
    this.resetColors();
  }

  /**
   * Sets the default visualization colors
   */
  initDefaultColors() {
    set(this, 'landscapeColorsDefault', {
      system: "rgb(199, 199, 199)",
      nodegroup: "rgb(22, 158, 43)",
      node: "rgb(0, 187, 65)",
      application: "rgb(62, 20, 160)",
      communication: "rgb(244, 145, 0)",
      systemText: "rgb(0, 0, 0)",
      nodeText: "rgb(255, 255, 255)",
      applicationText: "rgb(255, 255, 255)",
      collapseSymbol: "rgb(0, 0, 0)",
      background: "rgb(255, 255, 255)"
    });

    set(this, 'applicationColorsDefault', {
      foundation: "rgb(199, 199, 199)",
      componentOdd: "rgb(22, 158, 43)",
      componentEven: "rgb(0, 187, 65)",
      clazz: "rgb(62, 20, 160)",
      highlightedEntity: "rgb(255, 0, 0)",
      componentText: "rgb(255, 255, 255)",
      clazzText: "rgb(255, 255, 255)",
      foundationText: "rgb(0, 0, 0)",
      communication: "rgb(244, 145, 0)",
      communicationArrow: "rgb(0, 0, 0)",
      background: "rgb(255, 255, 255)"
    });
  }

  /**
   * Resets all visualization colors to default values
   * Needs to be a deep copy of the object, otherwise the default colors got overridden when the colors are in the extension
   */
  resetColors() {
    set(this, 'landscapeColors', Object.assign({}, this.landscapeColorsDefault));
    set(this, 'applicationColors', Object.assign({}, this.applicationColorsDefault));
  }

}

declare module '@ember/service' {
  interface Registry {
    'configuration': Configuration;
  }
}
