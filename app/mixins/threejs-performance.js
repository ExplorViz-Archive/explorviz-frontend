import Ember from 'ember';
import Stats from "npm:stats.js";

const {Mixin} = Ember;


/**
* TODO
*
* @class ThreeJS-Performance-Mixin
* @extends Ember.Mixin
*/
export default Mixin.create({

  // @Override
  init() {
    
    // Very important for mixins: Use this structure for object literals etc.
    // if you WANT to avoid shared states
    // https://www.emberjs.com/api/classes/Ember.Mixin.html
    
    this._super(...arguments);

    this.set('stats', new Stats());
    // 0: fps, 1: ms, 2: mb, 3+: custom or just click the window to toggle
    this.get('stats').showPanel(0); 
    this.get('stats').dom.style.top = "200px";
    document.body.appendChild(this.get('stats').dom);

    this.set('threexStats', new THREEx.RendererStats());
    this.get('threexStats').domElement.style.position = 'absolute';
    this.get('threexStats').domElement.style.top = '250px';
    document.body.appendChild(this.get('threexStats').domElement);

  },

  removePerformanceMeasurement() {

    this.$(this.get('stats').dom).remove();
    this.$(this.get('threexStats').domElement).remove();

  }

});
