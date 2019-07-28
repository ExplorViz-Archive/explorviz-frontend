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
      this.extendPlotlyTimelineChart(this.get("timestamps"));
    } else {
      this.setupPlotlyTimelineChart(this.get("timestamps"));
    }
  };
  
  setupPlotlyTimelineChart(timestamps : Array<Timestamp>) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    var x : Array<Date> = [];
    var y : Array<number> = [];

    for(const timestamp of timestamps) {
      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));
    }

    const data = [
      {
        x: x,
        y: y,
        type: 'scattergl'
      }
    ];

    const latestTimestamp = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));
    console.log(latestTimestamp.get('timestamp'));

    const minTimestamp = latestTimestampValue.setMinutes(latestTimestampValue.getMinutes() - 1);
    const maxTimestamp = latestTimestampValue.setMinutes(latestTimestampValue.getMinutes() + 1);

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


  extendPlotlyTimelineChart(timestamps : Array<Timestamp>) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    var x : Array<Date> = [];
    var y : Array<number> = [];

    // TODO might need to filter already painted timestamps.
    // Otherwise, all timestamps are connected with the first one (buggy) 

    for(const timestamp of timestamps) {
      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));
    }

    const latestTimestamp = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get("timestamp"));

    const minTimestamp = latestTimestampValue.setMinutes(latestTimestampValue.getMinutes() - 1);
    const maxTimestamp = latestTimestampValue.setMinutes(latestTimestampValue.getMinutes() + 1);

    const minuteView = {
      xaxis: {
        type: 'date',
        range: [minTimestamp,maxTimestamp]
      }
    };    

    Plotly.relayout('plotlyDiv', minuteView);

    const data = {      
      x: [x],
      y: [y]
    };

    Plotly.extendTraces(
      'plotlyDiv',
      data, 
      [0]
    );


  };
  
};
