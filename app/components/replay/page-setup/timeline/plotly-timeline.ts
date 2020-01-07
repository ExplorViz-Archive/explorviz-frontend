import Component from '@glimmer/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { get, set, action } from '@ember/object';

interface Args {
  timestamps?: Timestamp[],
  clicked?(selectedTimestamps: number[]): void,
  defaultMarkerColor?: string,
  defaultMarkerSize?: number,
  highlightedMarkerColor?: string,
  highlightedMarkerSize?: number,
  selectionCount?: number,
  slidingWindowLowerBoundInMinutes?: number,
  slidingWindowUpperBoundInMinutes?: number,
}

export default class PlotlyTimeline extends Component<Args> {

  // BEGIN template-argument getters for default values
  get defaultMarkerColor() {
    return this.args.defaultMarkerColor || "#1f77b4";
  }

  get defaultMarkerSize() {
    return this.args.defaultMarkerSize || 8;
  }

  get highlightedMarkerColor() {
    return this.args.highlightedMarkerColor || "red";
  }

  get highlightedMarkerSize() {
    return this.args.highlightedMarkerSize || 12;
  }

  get selectionCount() {
    return this.args.selectionCount || 1;
  }

  get slidingWindowLowerBoundInMinutes() {
    return this.args.slidingWindowLowerBoundInMinutes || 4;
  }

  get slidingWindowUpperBoundInMinutes() {
    return this.args.slidingWindowUpperBoundInMinutes || 4;
  }

  get timestamps() {
    return this.args.timestamps || [];
  }
  // END template-argument getters for default values

  _debug = debugLogger();

  _initDone = false;

  _oldPlotlySlidingWindow = {min: 0, max: 0};
  _userSlidingWindow = null;

  // variable used for output when clicked
  _selectedTimestamps : number[] = [];

  // BEGIN Ember Div Events
  @action
  handleMouseEnter(plotlyDiv: any) {
    // if user hovers over plotly, save his 
    // sliding window, so that updating the 
    // plot won't modify his current viewport
    if (plotlyDiv && plotlyDiv.layout) {
      this._userSlidingWindow = plotlyDiv.layout;
    }
  }

  @action
  handleMouseLeave() {
    this._userSlidingWindow = null;
  }
  // END Ember Div Events


  @action
  didRender(plotlyDiv: any) {
    if(this._initDone) {
      this.extendPlotlyTimelineChart(this.timestamps);
    } else {
      this.setupPlotlyTimelineChart(this.timestamps);
      if(this._initDone) {
        this.setupPlotlyListener(plotlyDiv);
      }      
    }
  };

  setupPlotlyListener(plotlyDiv: any) {
    const dragLayer: any = document.getElementsByClassName('nsewdrag')[0];

    if (plotlyDiv && plotlyDiv.layout) {

      const self: PlotlyTimeline = this;

      // singe click
      plotlyDiv.on('plotly_click', function (data: any) {

        // https://plot.ly/javascript/reference/#scatter-marker

        const pn = data.points[0].pointNumber;

        const numberOfPoints = data.points[0].fullData.x.length;

        let colors = data.points[0].fullData.marker.color;
        let sizes = data.points[0].fullData.marker.size;

        // reset selection       
        if(self._selectedTimestamps.length == self.selectionCount) {
          self._selectedTimestamps = [];
          colors = Array(numberOfPoints).fill(self.defaultMarkerColor);
          sizes = Array(numberOfPoints).fill(self.defaultMarkerSize);
        }

        colors[pn] = self.highlightedMarkerColor;
        sizes[pn] = self.highlightedMarkerSize;

        // trace number, necessary for the restyle function
        const tn = data.points[0].curveNumber;

        var update = { 'marker': { color: colors, size: sizes } };
        Plotly.restyle('plotlyDiv', update, [tn]);

        const clickedTimestamp = new Date(data.points[0].x);
        self._selectedTimestamps.push(clickedTimestamp.getTime());

        if (get(self, "selectionCount") > 1) {

          if (self._selectedTimestamps.length == self.selectionCount) {
            if(self.args.clicked) self.args.clicked(self._selectedTimestamps);
          }

        } else {
          // closure action
          if(self.args.clicked) self.args.clicked(self._selectedTimestamps);
        }


      });

      // double click
      plotlyDiv.on('plotly_doubleclick', function () {
        const min = self._oldPlotlySlidingWindow.min;
        const max = self._oldPlotlySlidingWindow.max;
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

    if (timestamps.length == 0) {
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

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue,
      this.slidingWindowLowerBoundInMinutes, this.slidingWindowUpperBoundInMinutes);

    const layout = this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    this._oldPlotlySlidingWindow = windowInterval;

    Plotly.newPlot(
      'plotlyDiv',
      this.getPlotlyDataObject(x, y),
      layout,
      this.getPlotlyOptionsObject()
    );

    this._initDone = true;

  };


  extendPlotlyTimelineChart(timestamps: Timestamp[]) {

    if (timestamps.length == 0) {
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

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue,
      this.slidingWindowLowerBoundInMinutes, this.slidingWindowUpperBoundInMinutes);

    const layout = this._userSlidingWindow ? this._userSlidingWindow :
      this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    this._oldPlotlySlidingWindow = windowInterval;

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

    const colors = Array(dates.length).fill(this.defaultMarkerColor);
    const sizes = Array(dates.length).fill(this.defaultMarkerSize);

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
