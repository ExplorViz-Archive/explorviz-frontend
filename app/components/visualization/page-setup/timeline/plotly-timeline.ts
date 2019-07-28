import Component from '@ember/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';

export default class PlotlyTimeline extends Component.extend({
  // anything which *must* be merged to prototype here
}) {

  debug = debugLogger();

  tagName = '';
  initDone = false;

  didRender() {
    this._super(...arguments);

    if(this.initDone) {
      this.extendPlotlyTimelineChart(this.get("timestamp"));
    } else {
      this.setupPlotlyTimelineChart(this.get("timestamp"));
    }
  };
  
  setupPlotlyTimelineChart(timestamp : Timestamp) {

    if(!timestamp) {
      return;
    }

    var x : Array<Date> = [];
    var y : Array<number> = [];

    const currentTimestamp = new Date(timestamp.get("timestamp"));

    x.push(currentTimestamp);
    y.push(timestamp.get("totalRequests"));

    const data = [
      {
        x: x,
        y: y,
        type: 'scattergl'
      }
    ];

    const minTimestamp = currentTimestamp.setMinutes(currentTimestamp.getMinutes() - 1);
    const maxTimestamp = currentTimestamp.setMinutes(currentTimestamp.getMinutes() + 1);

    const layout = { 
      dragmode: 'pan', 
      yaxis: { 
        fixedrange: true
      },
      xaxis: {
        type: 'date',
        range: [minTimestamp,maxTimestamp]
      },
      margin: {
        b: 20,
        t: 20,
        pad: 4
      }
    };

    const options = {
      displayModeBar: false,
      scrollZoom: true,
      responsive: true 
    };

    Plotly.newPlot(
      'plotlyDiv',
      data, 
      layout,
      options
    );

    this.initDone = true;

  };


  extendPlotlyTimelineChart(timestamp : Timestamp) {

    if(!timestamp) {
      return;
    }

    var x : Array<Date> = [];
    var y : Array<number> = [];

    const newTimestamp = new Date(timestamp.get("timestamp"));
    const newRequestValue : number = timestamp.get("totalRequests");

    x.push(newTimestamp);
    y.push(newRequestValue);

    const minTimestamp = newTimestamp.setMinutes(newTimestamp.getMinutes() - 1);
    const maxTimestamp = newTimestamp.setMinutes(newTimestamp.getMinutes() + 1);

    const minuteView = {
      xaxis: {
        type: 'date',
        range: [minTimestamp,maxTimestamp]
      }
    };    

    Plotly.relayout('plotlyDiv', minuteView);

    const data = {      
      x: [[newTimestamp]],
      y: [[newRequestValue]]
    };

    Plotly.extendTraces(
      'plotlyDiv',
      data, 
      [0]
    );


  };
  
};
