import Component from '@ember/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { get, set } from '@ember/object';

export default class PlotlyTimeline extends Component.extend({
}) {

  // BEGIN user-set variables
  timestamps: Timestamp[] = [];

  defaultMarkerColor = "#1f77b4";
  defaultMarkerSize = 8;

  highlightedMarkerColor = "red";
  highlightedMarkerSize = 12;

  selectionCount = 1;

  slidingWindowLowerBoundInMinutes = 4;
  slidingWindowUpperBoundInMinutes = 4;
  // END user-set variables

  _debug = debugLogger();

  _initDone = false;

  _oldPlotlySlidingWindow = {};
  _userSlidingWindow = null;

  // variable used for output when clicked
  _selectedTimestamps = [];

  // BEGIN Ember Div Events
  mouseEnter() {
    const plotlyDiv: any = document.getElementById("plotlyDiv");

    // if user hovers over plotly, save his 
    // sliding window, so that updating the 
    // plot won't modify his current viewport
    if (plotlyDiv && plotlyDiv.layout) {
      set(this, "_userSlidingWindow", plotlyDiv.layout);
    }
  }

  mouseLeave() {
    set(this, "_userSlidingWindow", null);
  }
  // END Ember Div Events


  // @Override
  didRender() {
    this._super(...arguments);

    if (this._initDone) {
      this.extendPlotlyTimelineChart(get(this, "timestamps"));
    } else {
      this.setupPlotlyTimelineChart(get(this, "timestamps"));
      if (get(this, "_initDone")) {
        this.setupPlotlyListener();
      }
    }
  };

  setupPlotlyListener() {
    const plotlyDiv: any = document.getElementById("plotlyDiv");
    const dragLayer: any = document.getElementsByClassName('nsewdrag')[0];

    if (plotlyDiv && plotlyDiv.layout) {

      const self: any = this;

      // singe click
      plotlyDiv.on('plotly_click', function (data: any) {

        // https://plot.ly/javascript/reference/#scatter-marker

        const pn = data.points[0].pointNumber;

        const numberOfPoints = data.points[0].fullData.x.length;

        let colors = data.points[0].fullData.marker.color;
        let sizes = data.points[0].fullData.marker.size;

        // reset selection       
        if (get(self, "_selectedTimestamps").length == get(self, "selectionCount")) {
          set(self, "_selectedTimestamps", []);
          colors = Array(numberOfPoints).fill(get(self, "defaultMarkerColor"));
          sizes = Array(numberOfPoints).fill(get(self, "defaultMarkerSize"));
        }

        colors[pn] = get(self, "highlightedMarkerColor");
        sizes[pn] = get(self, "highlightedMarkerSize");

        // trace number, necessary for the restyle function
        const tn = data.points[0].curveNumber;

        var update = { 'marker': { color: colors, size: sizes } };
        Plotly.restyle('plotlyDiv', update, [tn]);

        const clickedTimestamp = new Date(data.points[0].x);
        get(self, "_selectedTimestamps").push(clickedTimestamp.getTime());

        if (get(self, "selectionCount") > 1) {

          if (get(self, "_selectedTimestamps").length == get(self, "selectionCount")) {
            self.clicked(get(self, "_selectedTimestamps"));
          }

        } else {
          // closure action
          self.clicked(get(self, "_selectedTimestamps"));
        }


      });

      // double click
      plotlyDiv.on('plotly_doubleclick', function () {
        const min = get(self, "_oldPlotlySlidingWindow.min");
        const max = get(self, "_oldPlotlySlidingWindow.max");
        const update = self.getPlotlySlidingWindowUpdateObject(min, max);
        Plotly.relayout('plotlyDiv', update);
      });

      // Show cursor when hovering data point
      if (dragLayer) {
        plotlyDiv.on('plotly_hover', function () {
          dragLayer.style.cursor = 'pointer';
        });

        plotlyDiv.on('plotly_unhover', function () {
          dragLayer.style.cursor = '';
        });
      }
    }
  };

  // BEGIN Plot Logic

  setupPlotlyTimelineChart(timestamps: Timestamp[]) {

    if (!timestamps || timestamps.length == 0) {
      return;
    }

    const x: Date[] = [];
    const y: number[] = [];

    for (const timestamp of timestamps) {
      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));
    }

    const latestTimestamp: any = timestamps.lastObject;
    const latestTimestampValue = new Date(get(latestTimestamp, 'timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, get(this, "slidingWindowLowerBoundInMinutes"), get(this, "slidingWindowUpperBoundInMinutes"));

    const layout = this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    set(this, "_oldPlotlySlidingWindow", windowInterval)

    Plotly.newPlot(
      'plotlyDiv',
      this.getPlotlyDataObject(x, y),
      layout,
      this.getPlotlyOptionsObject()
    );

    this._initDone = true;

  };


  extendPlotlyTimelineChart(timestamps: Timestamp[]) {

    if (!timestamps || timestamps.length == 0) {
      return;
    }

    const x: Date[] = [];
    const y: number[] = [];

    for (const timestamp of timestamps) {
      x.push(new Date(get(timestamp, 'timestamp')));
      y.push(get(timestamp, 'totalRequests'));
    }

    const latestTimestamp: any = timestamps.lastObject;
    const latestTimestampValue = new Date(get(latestTimestamp, 'timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, get(this, "slidingWindowLowerBoundInMinutes"), get(this, "slidingWindowUpperBoundInMinutes"));

    const layout = get(this, "_userSlidingWindow") ? get(this, "_userSlidingWindow") : this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    set(this, "_oldPlotlySlidingWindow", windowInterval);

    Plotly.react(
      'plotlyDiv',
      this.getPlotlyDataObject(x, y),
      layout,
      this.getPlotlyOptionsObject()
    );
  };

  // END Plot Logic

  // BEGIN Helper functions

  getPlotlySlidingWindowUpdateObject(minTimestamp: number, maxTimestamp: number): { xaxis: { type: 'date', range: number[], title: {} } } {
    return {
      xaxis: {
        type: 'date',
        range: [minTimestamp, maxTimestamp],
        title: {
          text: 'Time',
          font: {
            size: 16,
            color: '#7f7f7f'
          }
        }
      }
    };
  };

  hoverText(x: Date[], y: number[]) {
    return x.map((xi, i) => `<b>Time</b>: ${xi}<br><b>Requests</b>: ${y[i]}<br>`);
  };

  getSlidingWindowInterval(t: Date, lowerBound: number, upperBound: number): { "min": number, "max": number } {
    const minTimestamp = t.setMinutes(t.getMinutes() - lowerBound);
    const maxTimestamp = t.setMinutes(t.getMinutes() + upperBound);

    return { "min": minTimestamp, "max": maxTimestamp };
  };

  // @ts-ignore: range not used in replay route
  getPlotlyLayoutObject(minRange: number, maxRange: number): {} {
    return {
      dragmode: 'pan',
      hovermode: 'closest',
      hoverdistance: 10,
      yaxis: {
        fixedrange: true,
        title: {
          text: 'Requests',
          font: {
            size: 16,
            color: '#7f7f7f'
          }
        }
      },
      xaxis: {
        type: 'date',
        //range: [minRange, maxRange],
        title: {
          text: 'Time',
          font: {
            size: 16,
            color: '#7f7f7f'
          }
        }
      },
      margin: {
        b: 40,
        t: 20,
        pad: 4
      }
    };
  };

  getPlotlyDataObject(dates: Date[], requests: number[]): [{}] {

    const colors = Array(dates.length).fill(get(this, "defaultMarkerColor"));
    const sizes = Array(dates.length).fill(get(this, "defaultMarkerSize"));

    return [
      {
        hoverinfo: 'text',
        type: 'scattergl',
        mode: 'lines+markers',
        fill: 'tozeroy',
        marker: { color: colors, size: sizes },
        x: dates,
        y: requests,
        hoverlabel: {
          align: "left"
        },
        text: this.hoverText(dates, requests)
      }
    ];
  };

  getPlotlyOptionsObject(): {} {
    return {
      displayModeBar: false,
      scrollZoom: true,
      responsive: true,
      doubleClick: false
    };
  };

  // END Helper functions

};
