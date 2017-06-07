import Ember from 'ember';
import Stats from "npm:stats.js";

export default Ember.Mixin.create({

  stats: null,

  threexStats: null,

  addPerformanceMetrics() {
    this.set('stats', new Stats());
    // 0: fps, 1: ms, 2: mb, 3+: custom or just click the window to toggle
    this.get('stats').showPanel(0); 
    this.get('stats').dom.style.top = "200px";
    document.body.appendChild(this.get('stats').dom);

    this.set('threexStats', new THREEx.RendererStats());
    this.get('threexStats').domElement.style.position = 'absolute';
    this.get('threexStats').domElement.style.top = '250px';
    document.body.appendChild(this.get('threexStats').domElement);
  }

});
