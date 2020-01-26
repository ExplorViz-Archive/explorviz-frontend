import { action, get } from '@ember/object';
import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import Plotly from 'plotly.js-dist';

interface IArgs {
  timestamps?: Timestamp[];
  defaultMarkerColor?: string;
  defaultMarkerSize?: number;
  highlightedMarkerColor?: string;
  highlightedMarkerSize?: number;
  selectionCount?: number;
  slidingWindowLowerBoundInMinutes?: number;
  slidingWindowUpperBoundInMinutes?: number;
  clicked?(selectedTimestamps: number[]): void;
}

export default class PlotlyTimeline extends Component<IArgs> {
  // BEGIN template-argument getters for default values
  get defaultMarkerColor() {
    return this.args.defaultMarkerColor || '#1f77b4';
  }

  get defaultMarkerSize() {
    const fallbackValue = 8;
    return this.args.defaultMarkerSize || fallbackValue;
  }

  get highlightedMarkerColor() {
    return this.args.highlightedMarkerColor || 'red';
  }

  get highlightedMarkerSize() {
    const fallbackValue = 12;
    return this.args.highlightedMarkerSize || fallbackValue;
  }

  get selectionCount() {
    const fallbackValue = 1;
    return this.args.selectionCount || fallbackValue;
  }

  get slidingWindowLowerBoundInMinutes() {
    const fallbackValue = 4;
    return this.args.slidingWindowLowerBoundInMinutes || fallbackValue;
  }

  get slidingWindowUpperBoundInMinutes() {
    const fallbackValue = 4;
    return this.args.slidingWindowUpperBoundInMinutes || fallbackValue;
  }

  get timestamps() {
    return this.args.timestamps || [];
  }
  // END template-argument getters for default values

  debug = debugLogger();

  initDone = false;

  oldPlotlySlidingWindow = { min: 0, max: 0 };
  userSlidingWindow = null;

  // variable used for output when clicked
  selectedTimestamps: number[] = [];

  timelineDiv: any;

  // BEGIN Ember Div Events
  @action
  handleMouseEnter(plotlyDiv: any) {
    // if user hovers over plotly, save his
    // sliding window, so that updating the
    // plot won't modify his current viewport
    if (plotlyDiv && plotlyDiv.layout) {
      this.userSlidingWindow = plotlyDiv.layout;
    }
  }

  @action
  handleMouseLeave() {
    this.userSlidingWindow = null;
  }
  // END Ember Div Events


  @action
  didRender(plotlyDiv: any) {
    this.timelineDiv = plotlyDiv;

    if (this.initDone) {
      this.extendPlotlyTimelineChart(this.timestamps);
    } else {
      this.setupPlotlyTimelineChart(this.timestamps);
      if (this.initDone) {
        this.setupPlotlyListener();
      }
    }
  }

  setupPlotlyListener() {
    const dragLayer: any = document.getElementsByClassName('nsewdrag')[0];

    const plotlyDiv = this.timelineDiv;

    if (plotlyDiv && plotlyDiv.layout) {
      // singe click
      plotlyDiv.on('plotly_click', (data: any) => {
        // https://plot.ly/javascript/reference/#scatter-marker

        const pn = data.points[0].pointNumber;

        const numberOfPoints = data.points[0].fullData.x.length;

        let colors = data.points[0].fullData.marker.color;
        let sizes = data.points[0].fullData.marker.size;

        // reset selection
        if (this.selectedTimestamps.length === this.selectionCount) {
          this.selectedTimestamps = [];
          colors = Array(numberOfPoints).fill(this.defaultMarkerColor);
          sizes = Array(numberOfPoints).fill(this.defaultMarkerSize);
        }

        colors[pn] = this.highlightedMarkerColor;
        sizes[pn] = this.highlightedMarkerSize;

        // trace number, necessary for the restyle function
        const tn = data.points[0].curveNumber;

        const update = { marker: { color: colors, size: sizes } };
        Plotly.restyle(plotlyDiv, update, [tn]);

        const clickedTimestamp = new Date(data.points[0].x);
        this.selectedTimestamps.push(clickedTimestamp.getTime());

        if (this.selectionCount > 1) {
          if (this.selectedTimestamps.length === this.selectionCount) {
            if (this.args.clicked) this.args.clicked(this.selectedTimestamps);
          }
        } else {
          // closure action
          if (this.args.clicked) this.args.clicked(this.selectedTimestamps);
        }
      });

      // double click
      plotlyDiv.on('plotly_doubleclick', () => {
        const min = this.oldPlotlySlidingWindow.min;
        const max = this.oldPlotlySlidingWindow.max;
        const update = this.getPlotlySlidingWindowUpdateObject(min, max);
        Plotly.relayout(plotlyDiv, update);
      });

      // Show cursor when hovering data point
      if (dragLayer) {
        plotlyDiv.on('plotly_hover', () => {
          dragLayer.style.cursor = 'pointer';
        });

        plotlyDiv.on('plotly_unhover', () => {
          dragLayer.style.cursor = '';
        });
      }
    }
  }

  // BEGIN Plot Logic

  setupPlotlyTimelineChart(timestamps: Timestamp[]) {
    if (timestamps.length === 0) {
      this.createDummyTimeline();
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

    this.oldPlotlySlidingWindow = windowInterval;

    Plotly.newPlot(
      this.timelineDiv,
      this.getPlotlyDataObject(x, y),
      layout,
      this.getPlotlyOptionsObject(),
    );

    this.initDone = true;
  }


  extendPlotlyTimelineChart(timestamps: Timestamp[]) {
    if (timestamps.length === 0) {
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

    const layout = this.userSlidingWindow ? this.userSlidingWindow :
      this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    this.oldPlotlySlidingWindow = windowInterval;

    Plotly.react(
      this.timelineDiv,
      this.getPlotlyDataObject(x, y),
      layout,
      this.getPlotlyOptionsObject(),
    );
  }

  createDummyTimeline() {
    const minRange = 0;
    const maxRange = 90;
    Plotly.newPlot(
      this.timelineDiv,
      null,
      this.getPlotlyLayoutObject(minRange, maxRange),
      this.getPlotlyOptionsObject(),
    );
  }

  // END Plot Logic

  // BEGIN Helper functions

  getPlotlySlidingWindowUpdateObject(minTimestamp: number, maxTimestamp: number):
  { xaxis: { type: 'date', range: number[], title: {} } } {
    return {
      xaxis: {
        range: [minTimestamp, maxTimestamp],
        title: {
          font: {
            color: '#7f7f7f',
            size: 16,
          },
          text: 'Time',
        },
        type: 'date',
      },
    };
  }

  hoverText(x: Date[], y: number[]) {
    return x.map((xi, i) => `<b>Time</b>: ${xi}<br><b>Requests</b>: ${y[i]}<br>`);
  }

  getSlidingWindowInterval(t: Date, lowerBound: number, upperBound: number): { 'min': number, 'max': number } {
    const minTimestamp = t.setMinutes(t.getMinutes() - lowerBound);
    const maxTimestamp = t.setMinutes(t.getMinutes() + upperBound);

    return { min: minTimestamp, max: maxTimestamp };
  }

  // @ts-ignore: range not used in replay route
  getPlotlyLayoutObject(minRange: number, maxRange: number): {} {
    return {
      dragmode: 'pan',
      hoverdistance: 10,
      hovermode: 'closest',
      margin: {
        b: 40,
        pad: 4,
        t: 20,
      },
      xaxis: {
        title: {
          font: {
            color: '#7f7f7f',
            size: 16,
          },
          text: 'Time',
        },
        type: 'date',
        // range: [minRange, maxRange],
      },
      yaxis: {
        fixedrange: true,
        title: {
          font: {
            color: '#7f7f7f',
            size: 16,
          },
          text: 'Requests',
        },
      },
    };
  }

  getPlotlyDataObject(dates: Date[], requests: number[]): [{}] {
    const colors = Array(dates.length).fill(this.defaultMarkerColor);
    const sizes = Array(dates.length).fill(this.defaultMarkerSize);

    return [
      {
        fill: 'tozeroy',
        hoverinfo: 'text',
        hoverlabel: {
          align: 'left',
        },
        marker: { color: colors, size: sizes },
        mode: 'lines+markers',
        text: this.hoverText(dates, requests),
        type: 'scattergl',
        x: dates,
        y: requests,
      },
    ];
  }

  getPlotlyOptionsObject(): {} {
    return {
      displayModeBar: false,
      doubleClick: false,
      responsive: true,
      scrollZoom: true,
    };
  }

  // END Helper functions
}
