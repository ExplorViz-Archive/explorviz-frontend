import Component from '@ember/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { get, set } from '@ember/object';

interface MarkerStates {
  [timestampId: string]: {
    color: string;
    size: number;
    emberModel: Timestamp;
  };  
}

export default class PlotlyTimeline extends Component.extend({
}) {

  // BEGIN user-set variables
  readonly timestamps : Timestamp[] = [];

  readonly setChildReference : any = null;

  readonly defaultMarkerColor = "#1f77b4";
  readonly defaultMarkerSize = 8;

  readonly highlightedMarkerColor = "red";  
  readonly highlightedMarkerSize = 12;

  readonly selectionCount = 1;

  readonly slidingWindowLowerBoundInMinutes = 4;
  readonly slidingWindowUpperBoundInMinutes = 4;
  // END user-set variables

  readonly _debug = debugLogger();

  _initDone = false;  

  _oldPlotlySlidingWindow = {};
  _userSlidingWindow = null;  

  // variable used for output when clicked
  _selectedTimestamps : Timestamp[] = [];
    
  _markerState : MarkerStates = {};  

  // BEGIN Ember Div Events
  mouseEnter() {
    const plotlyDiv : any = document.getElementById("plotlyDiv");

    // if user hovers over plotly, save his 
    // sliding window, so that updating the 
    // plot won't modify his current viewport
    if(plotlyDiv && plotlyDiv.layout) {
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

    // register this component at its parent if set via template
    const parentFunction = get(this, "setChildReference");
    if(parentFunction) {
      parentFunction(this);
    }

    if(this._initDone) {
      this.extendPlotlyTimelineChart(get(this, "timestamps"));
    } else {
      this.setupPlotlyTimelineChart(get(this, "timestamps"));
      if(get(this, "_initDone")) {
        this.setupPlotlyListener();
      }      
    }
  };

  setupPlotlyListener() {
    const plotlyDiv : any = document.getElementById("plotlyDiv");
    const dragLayer : any = document.getElementsByClassName('nsewdrag')[0];

    if(plotlyDiv && plotlyDiv.layout) {

      const self : any = this;

      // singe click
      plotlyDiv.on('plotly_click', function(data : any){

        // https://plot.ly/javascript/reference/#scatter-marker

        const pn = data.points[0].pointNumber;

        const numberOfPoints = data.points[0].fullData.x.length;

        let colors = data.points[0].fullData.marker.color;
        let sizes = data.points[0].fullData.marker.size;        

        // reset old selection, since maximum selection value is achieved
        // and user clicked on a new point
        if(get(self, "_selectedTimestamps").length == get(self, "selectionCount")) {

          self.resetSelectionInStateObjects();
          
          colors = Array(numberOfPoints).fill(get(self, "defaultMarkerColor"));
          sizes = Array(numberOfPoints).fill(get(self, "defaultMarkerSize"));   
        }

        const highlightedMarkerColor = get(self, "highlightedMarkerColor");
        const highlightedMarkerSize = get(self, "highlightedMarkerSize");

        colors[pn] = highlightedMarkerColor;
        sizes[pn] = highlightedMarkerSize;        

        const timestampId = data.points[0].data.timestampId[pn];        
             
        get(self, "_markerState")[timestampId].color = highlightedMarkerColor;
        get(self, "_markerState")[timestampId].size = highlightedMarkerSize;

        var update = {'marker':{color: colors, size: sizes}};

        // trace number, necessary for the restyle function
        const tn = data.points[0].curveNumber;
        Plotly.restyle('plotlyDiv', update, [tn]);

        get(self, "_selectedTimestamps").push(get(self, "_markerState")[timestampId].emberModel);

        // Check if component should pass the selected timestamps 
        // to its parent
        if(get(self, "selectionCount") > 1) {

          if(get(self, "_selectedTimestamps").length == get(self, "selectionCount")) {
            // closure action
            self.clicked(get(self, "_selectedTimestamps"));
          }

        } else {
          // closure action
          self.clicked(get(self, "_selectedTimestamps"))
        }        
      });

      // double click
      plotlyDiv.on('plotly_doubleclick', function() {
        const min = get(self, "_oldPlotlySlidingWindow.min");
        const max = get(self, "_oldPlotlySlidingWindow.max");
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
            set(self, "_userSlidingWindow", plotlyDiv.layout);
          }
        });
      }
    }    
  };

  // BEGIN Plot Logic

  setupPlotlyTimelineChart(timestamps : Timestamp[]) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    const data = this.getUpdatedPlotlyDataObject(timestamps, get(this, "_markerState"));    

    const latestTimestamp : any = timestamps.lastObject;
    const latestTimestampValue = new Date(get(latestTimestamp, 'timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, get(this, "slidingWindowLowerBoundInMinutes"), get(this, "slidingWindowUpperBoundInMinutes"));

    const layout = this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    set(this, "_oldPlotlySlidingWindow", windowInterval);    

    Plotly.newPlot(
      'plotlyDiv',
      data, 
      layout,
      this.getPlotlyOptionsObject()
    );

    this._initDone = true;

  };


  extendPlotlyTimelineChart(timestamps : Timestamp[]) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    let data : any = this.getUpdatedPlotlyDataObject(timestamps, get(this, "_markerState"));
    
    const latestTimestamp : any = timestamps.lastObject;
    const latestTimestampValue = new Date(get(latestTimestamp, 'timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, get(this, "slidingWindowLowerBoundInMinutes"), get(this, "slidingWindowUpperBoundInMinutes"));    

    const layout = get(this, "_userSlidingWindow") ? get(this, "_userSlidingWindow") : this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    set(this, "_oldPlotlySlidingWindow", windowInterval);

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
    this.getUpdatedPlotlyDataObject(get(this, "timestamps"), get(this, "_markerState"));

    const highlightedMarkerColor = get(this, "highlightedMarkerColor");
    const highlightedMarkerSize = get(this, "highlightedMarkerSize");     

    for(const timestamp of oldSelectedTimestampRecords) { 
      const timestampId = timestamp.get("id");        
          
      get(this, "_markerState")[timestampId].color = highlightedMarkerColor;
      get(this, "_markerState")[timestampId].size = highlightedMarkerSize;
      get(this, "_markerState")[timestampId].emberModel = timestamp;

      get(this, "_selectedTimestamps").push(get(this, "_markerState")[timestampId].emberModel);
    }    

    this.extendPlotlyTimelineChart(get(this, "timestamps"));
  }

  resetHighlighting() {
    this.resetHighlingInStateObjects();
    this.extendPlotlyTimelineChart(get(this, "timestamps"));
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
        const defaultColor = get(this, "defaultMarkerColor");
        const defaultSize = get(this, "defaultMarkerSize");

        colors.push(defaultColor);
        sizes.push(defaultSize);

        markerStates[timestampId] = {color: defaultColor, size: defaultSize, emberModel: timestamp};
      }      
      timestampIds.push(timestampId);
    }

    
    set(this, "_markerState", markerStates);

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
    set(this, "_selectedTimestamps", []);
    set(this, "_markerState", {});
  }

  resetSelectionInStateObjects() {
    const selTimestamps : Timestamp[] = get(this, "_selectedTimestamps");

    const defaultMarkerColor = get(this, "defaultMarkerColor");
    const defaulMarkerSize = get(this, "defaultMarkerSize");

    for(const t of selTimestamps) {
      get(this, "_markerState")[get(t, "id")].color = defaultMarkerColor;
      get(this, "_markerState")[get(t, "id")].size = defaulMarkerSize;
    }

    set(this, "_selectedTimestamps", []);
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
