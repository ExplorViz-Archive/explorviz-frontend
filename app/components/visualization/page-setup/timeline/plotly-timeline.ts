import Component from '@glimmer/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { get, action } from '@ember/object';

interface MarkerStates {
  [timestampId: string]: {
    color: string;
    size: number;
    emberModel: Timestamp;
  };
}

interface Args {
  timestamps?: Timestamp[],
  setChildReference?(timeline: PlotlyTimeline): void,
  clicked?(selectedTimestamps: Timestamp[]): void,
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

  readonly _debug = debugLogger();

  _initDone = false;  

  _oldPlotlySlidingWindow = {min: 0, max: 0};
  _userSlidingWindow = null;

  // variable used for output when clicked
  _selectedTimestamps : Timestamp[] = [];
    
  _markerState : MarkerStates = {};  

  // BEGIN Ember Div Events
  @action
  handleMouseEnter(plotlyDiv: any) {
    // if user hovers over plotly, save his 
    // sliding window, so that updating the 
    // plot won't modify his current viewport
    if(plotlyDiv && plotlyDiv.layout) {
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
    // register this component at its parent if set via template
    const parentFunction = this.args.setChildReference;
    if(parentFunction) {
      parentFunction(this);
    }

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
    const dragLayer : any = document.getElementsByClassName('nsewdrag')[0];

    if(plotlyDiv && plotlyDiv.layout) {

      const self : PlotlyTimeline = this;

      // singe click
      plotlyDiv.on('plotly_click', function(data : any){

        // https://plot.ly/javascript/reference/#scatter-marker

        const pn = data.points[0].pointNumber;

        const numberOfPoints = data.points[0].fullData.x.length;

        let colors = data.points[0].fullData.marker.color;
        let sizes = data.points[0].fullData.marker.size;        

        // reset old selection, since maximum selection value is achieved
        // and user clicked on a new point
        if(self._selectedTimestamps.length == self.selectionCount) {

          self.resetSelectionInStateObjects();
          
          colors = Array(numberOfPoints).fill(self.defaultMarkerColor);
          sizes = Array(numberOfPoints).fill(self.defaultMarkerSize);   
        }

        const highlightedMarkerColor = self.highlightedMarkerColor;
        const highlightedMarkerSize = self.highlightedMarkerSize;

        colors[pn] = highlightedMarkerColor;
        sizes[pn] = highlightedMarkerSize;        

        const timestampId = data.points[0].data.timestampId[pn];        
             
        self._markerState[timestampId].color = highlightedMarkerColor;
        self._markerState[timestampId].size = highlightedMarkerSize;

        var update = {'marker':{color: colors, size: sizes}};

        // trace number, necessary for the restyle function
        const tn = data.points[0].curveNumber;
        Plotly.restyle('plotlyDiv', update, [tn]);

        self._selectedTimestamps.push(self._markerState[timestampId].emberModel);

        // Check if component should pass the selected timestamps 
        // to its parent
        if(self.selectionCount > 1) {

          if(self._selectedTimestamps.length == self.selectionCount) {
            // closure action
            if(self.args.clicked) self.args.clicked(self._selectedTimestamps);
          }

        } else {
          // closure action
          if(self.args.clicked) self.args.clicked(self._selectedTimestamps)
        }        
      });

      // double click
      plotlyDiv.on('plotly_doubleclick', function() {
        const min = self._oldPlotlySlidingWindow.min;
        const max = self._oldPlotlySlidingWindow.max;
        const update = self.getPlotlySlidingWindowUpdateObject(min, max);
        Plotly.relayout('plotlyDiv', update);
      });

      // Show cursor when hovering data point
      if(dragLayer) {
        plotlyDiv.on('plotly_hover', function(){
          dragLayer.style.cursor = 'pointer';
        });
        
        plotlyDiv.on('plotly_unhover', function(){
          dragLayer.style.cursor = '';
        });

        plotlyDiv.on('plotly_relayouting', function(){
          // if user drags the plot, save his 
          // sliding window, so that updating the 
          // plot won't modify his current viewport
          if(plotlyDiv && plotlyDiv.layout) {
            self._userSlidingWindow = plotlyDiv.layout;
          }
        });
      }
    }    
  };

  // BEGIN Plot Logic

  setupPlotlyTimelineChart(timestamps : Timestamp[]) {

    if(timestamps.length == 0) {
      return;
    }

    const data = this.getUpdatedPlotlyDataObject(timestamps, this._markerState);    

    const latestTimestamp : any = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue,
      this.slidingWindowLowerBoundInMinutes, this.slidingWindowUpperBoundInMinutes);

    const layout = this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    this._oldPlotlySlidingWindow = windowInterval;    

    Plotly.newPlot(
      'plotlyDiv',
      data, 
      layout,
      this.getPlotlyOptionsObject()
    );

    this._initDone = true;
  };


  extendPlotlyTimelineChart(timestamps : Timestamp[]) {

    if(timestamps.length == 0) {
      return;
    }

    let data : any = this.getUpdatedPlotlyDataObject(timestamps, this._markerState);
    
    const latestTimestamp : Timestamp = timestamps[timestamps.length-1];
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue,
      this.slidingWindowLowerBoundInMinutes, this.slidingWindowUpperBoundInMinutes);    

    const layout = this._userSlidingWindow ?
      this._userSlidingWindow : this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    this._oldPlotlySlidingWindow = windowInterval;

    Plotly.react(
      'plotlyDiv',
      data,
      layout,
      this.getPlotlyOptionsObject()
    );
  }

  continueTimeline(oldSelectedTimestampRecords : Timestamp[]) {
    this.resetHighlingInStateObjects();

    // call this to initialize the internal marker state variable
    this.getUpdatedPlotlyDataObject(this.timestamps, this._markerState);

    const highlightedMarkerColor = this.highlightedMarkerColor;
    const highlightedMarkerSize = this.highlightedMarkerSize;     

    for(const timestamp of oldSelectedTimestampRecords) { 
      const timestampId = timestamp.get('id');        
          
      this._markerState[timestampId].color = highlightedMarkerColor;
      this._markerState[timestampId].size = highlightedMarkerSize;
      this._markerState[timestampId].emberModel = timestamp;

      this._selectedTimestamps.push(this._markerState[timestampId].emberModel);
    }    

    this.extendPlotlyTimelineChart(this.timestamps);
  }

  resetHighlighting() {
    this.resetHighlingInStateObjects();
    this.extendPlotlyTimelineChart(this.timestamps);
  }

  // END Plot Logic

  // BEGIN Helper functions

  getPlotlySlidingWindowUpdateObject(minTimestamp : number, maxTimestamp : number) : {xaxis : {type: 'date', range: number[], title: {}} } {
    return {
      xaxis: {
        type: 'date',
        range: [minTimestamp,maxTimestamp],
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

  hoverText(x : Date[] ,y : number[]) {
    return x.map((xi, i) => `<b>Time</b>: ${xi}<br><b>Requests</b>: ${y[i]}<br>`);
  };

  getSlidingWindowInterval(t : Date, lowerBound : number, upperBound : number) : {"min" : number, "max" : number} {
    const minTimestamp = t.setMinutes(t.getMinutes() - lowerBound);
    const maxTimestamp = t.setMinutes(t.getMinutes() + upperBound);

    return {"min" : minTimestamp, "max": maxTimestamp};
  };

  getPlotlyLayoutObject(minRange:number, maxRange:number) : {} {
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
        range: [minRange,maxRange],
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

  getUpdatedPlotlyDataObject(timestamps : Timestamp[], markerStates : MarkerStates) : [{}] {

    const colors = [];
    const sizes = [];

    const x : Date[] = [];
    const y : number[] = [];

    const timestampIds : string[] = [];

    for(const timestamp of timestamps) {
      const timestampId = timestamp.get('id');

      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));

      const markerState = markerStates[timestampId];
      
      if(markerState) {
        // already plotted -> take old values
        colors.push(markerState.color);
        sizes.push(markerState.size);
      } else {
        // new point
        const defaultColor = this.defaultMarkerColor;
        const defaultSize = this.defaultMarkerSize;

        colors.push(defaultColor);
        sizes.push(defaultSize);

        markerStates[timestampId] = {color: defaultColor, size: defaultSize, emberModel: timestamp};
      }      
      timestampIds.push(timestampId);
    }

    
    this._markerState = markerStates;

    return this.getPlotlyDataObject(x, y, colors, sizes, timestampIds);
  }

  getPlotlyDataObject(dates : Date[], requests : number[], colors: string[], sizes: number[], timestampIds: string[]) : [{}] {

    return [
      {
        hoverinfo: 'text',
        type: 'scattergl',
        mode:'lines+markers',
        fill: 'tozeroy',
        marker: {color: colors, size: sizes},
        x: dates,
        y: requests,
        timestampId: timestampIds,
        hoverlabel: {
          align: "left"
        },
        text: this.hoverText(dates, requests) 
      }
    ];
  }

  resetHighlingInStateObjects() {
    this._selectedTimestamps = [];
    this._markerState = {};
  }

  resetSelectionInStateObjects() {
    const selTimestamps : Timestamp[] = this._selectedTimestamps;

    const defaultMarkerColor = this.defaultMarkerColor;
    const defaulMarkerSize = this.defaultMarkerSize;

    for(const t of selTimestamps) {
      this._markerState[get(t, "id")].color = defaultMarkerColor;
      this._markerState[get(t, "id")].size = defaulMarkerSize;
    }

    this._selectedTimestamps = [];
  }

  getPlotlyOptionsObject() : {} {
    return {
      displayModeBar: false,
      scrollZoom: true,
      responsive: true,
      doubleClick: false
    };
  };

  // END Helper functions

};
