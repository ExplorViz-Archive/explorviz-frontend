import Component from '@ember/component';
import Plotly from 'plotly.js-dist';

export default class PlotlyTimeline extends Component.extend({
  // anything which *must* be merged to prototype here
}) {

  tagName = '';

  didRender() {
    this._super(...arguments);
    this.setupPlotlyTimelineChart();
  };
  
  setupPlotlyTimelineChart() {
    var x = [];
    var y = [];

    let i:number = 0;
    for(i = 0; i < 1000; i++) {
      x.push(i);
      y.push(i%3);
    }

    var data = [
      {
        x: x,
        y: y,
        type: 'scattergl'
      }
    ];

    Plotly.newPlot(
      'plotlyDiv',
      data, 
      { 
        dragmode: 'pan', 
        yaxis: { 
          fixedrange: true 
        }
      },
      {
        displayModeBar: false,
        scrollZoom: true,
        responsive: true 
      },
    );


  };
  
};
