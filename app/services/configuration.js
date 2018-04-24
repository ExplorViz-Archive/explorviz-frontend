import Service from '@ember/service';

/**
* TODO
* 
* @class Configuration-Service
* @extends Ember.Service
*/
export default Service.extend({

  /**
  * Array for component-based settings dialogs. Any plugin may push a String 
  * with the name of it's settings-component in this array. See 
  * "color-picker-plugin" for exemplary usage.
  *
  * @property pluginSettings
  * @type Array
  */
  pluginSettings: null,


  /**
  * Default colors for landscape visualization
  *
  * @property landscapeColors
  * @type Object
  */
  landscapeColors: null,
  

  /**
  * Default colors for application visualization
  *
  * @property applicationColors
  * @type Object
  */
  applicationColors: null,

  init() {
    this._super(...arguments);

    this.set('pluginSettings', []);

    this.set('landscapeColors', {
      system: "rgb(199,199,199)",
      nodegroup: "rgb(1,155,32)",
      node: "rgb(0,189,56)",
      application: "rgb(81,34,183)",
      communication: "rgb(244,145,0)",
      textsystem: "rgb(0,0,0)",
      textnode: "rgb(255,255,255)",
      textapp: "rgb(255,255,255)",
      collapseSymbol: "rgb(0,0,0)",
      textchanged: false
    });

    this.set('applicationColors', {
      foundation: "rgb(199,199,199)",
      componentOdd: "rgb(0,187,65)",
      componentEven: "rgb(22,158,43)",
      clazz: "rgb(62,20,160)",
      highlightedEntity: "rgb(255,0,0)"
    });

  }

});
