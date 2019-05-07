import Service from '@ember/service';

/**
* The Configuration Service handles color settings for the visualization and configuration extensions
* @class Configuration-Service
* @extends Ember.Service
*/
export default Service.extend({

  /**
  * Array for component-based settings dialogs. Any extension may push an object  
  * with the name of it's settings-component and it's title in this array. See 
  * the extension "colorpicker"" for exemplary usage.
  *
  * @property configurationExtensions
  * @type Array
  */
  configurationExtensions: null,

  /**
  * Current colors for landscape visualization
  *
  * @property landscapeColors
  * @type Object
  */
  landscapeColors: null,

  /**
  * Current colors for application visualization
  *
  * @property applicationColors
  * @type Object
  */
  applicationColors: null,

  /**
  * Default colors for landscape visualization
  *
  * @property landscapeColorsDefault
  * @type Object
  */
  landscapeColorsDefault: null,

  /**
  * Default colors for application visualization
  *
  * @property applicationColorsDefault
  * @type Object
  */
  applicationColorsDefault: null,


  init() {
    this._super(...arguments);
    this.set('configurationExtensions', []);
    this.initDefaultColors();
    this.resetColors();
  },

  /**
   * Sets the default visualization colors
   */
  initDefaultColors() {
    this.set('landscapeColorsDefault', {
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

    this.set('applicationColorsDefault', {
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
  },

  /**
   * Resets all visualization colors to default values
   * Needs to be a deep copy of the object, otherwise the default colors got overridden when the colors are in the extension
   */
  resetColors() {
    this.set('landscapeColors', Object.assign({}, this.get('landscapeColorsDefault')));
    this.set('applicationColors', Object.assign({}, this.get('applicationColorsDefault')));
  }

});