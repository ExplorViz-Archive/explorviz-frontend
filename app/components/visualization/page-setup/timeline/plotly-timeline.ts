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

  hoverText(x : Array<Date> ,y : Array<number>) {
    return x.map((xi, i) => `<b>Time</b>: ${xi}<br><b>Total Requests</b>: ${y[i]}<br>`);
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

    //const hoverText = x.map(xi => y.map(yi => `ts: 1<br>hz: 1<br>`));
    //const hoverText = `ts: 1<br>hz: 1<br>`;
    //const hoverText = x.map((xi, i) => `Total Requests: ${xi}<br>Time: ${y[i]}<br>`);
    //const hoverText = x.forEach((xi, i) =>
    //  `Total Requests: ${xi}<br>Time: ${y[i]}<br>`
    //);
    //var hoverText = x.map((xi, i) => y.map((yi, j) => `ts: ${xi}<br>hz: ${yi}<br>`));

    const data = [
      {
        hoverinfo: 'text',
        type: 'scattergl',
        x: x,
        y: y,
        //hovertemplate: 
        // '<b>Total Requests</b>: %{y:.2f}' +
        //  '<br><b>Time</b>: %{x}<br>',
        hoverlabel: {
          align: "left"
        },
        text: this.hoverText(x,y)
      }
    ];

    const latestTimestamp = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));

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
      type: 'scattergl',
      x: [x],
      y: [y],
      hoverlabel: {
        align: "left"
      },
      text: this.hoverText(x,y)
    };

    Plotly.update(
      'plotlyDiv',
      data
    );


  };
  
};
