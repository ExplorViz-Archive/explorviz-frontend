// @ts-ignore
import Stats from 'stats.js';
import $ from 'jquery';

declare const THREEx: any;

/**
* TODO
*
* @class ThreejsPerformance
*
* @module explorviz
* @submodule visualization.rendering
*/
export default class ThreejsPerformance {

  stats:any = new Stats();
  threexStats:any = new THREEx.RendererStats();

  // @Override
  constructor() {
    // 0: fps, 1: ms, 2: mb, 3+: custom or just click the window to toggle
    this.stats.showPanel(0); 
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.bottom = "368px";
    this.stats.dom.style.top = null;
    this.stats.dom.style.zIndex = "100";
    this.stats.dom.style.left = '0px';
    $('#rendering').append(this.stats.dom);

    this.threexStats.domElement.style.position = 'absolute';
    this.threexStats.domElement.style.bottom = '200px';
    $('#rendering').append(this.threexStats.domElement);
  }

  removePerformanceMeasurement() {
    $(this.stats.dom).remove();
    $(this.threexStats.domElement).remove();
  }

}
