import Component from '@ember/component';
import Plotly from 'plotly.js-dist';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';

export default class PlotlyTimeline extends Component.extend({
  // anything which *must* be merged to prototype here
}) {

  debug = debugLogger();

  initDone = false;

  slidingWindowLowerBoundInMinutes = 4;
  slidingWindowUpperBoundInMinutes = 4;

  userSlidingWindow = null;

  // BEGIN Ember Div Events
  mouseEnter() {
    const plotlyDiv = document.getElementById("plotlyDiv");

    // if user hovers over plotly, save his 
    // sliding window, so that updating the 
    // plot won't modify his current viewport
    if(plotlyDiv && plotlyDiv.layout) {
      this.set("userSlidingWindow", plotlyDiv.layout);
    }
  }

  mouseLeave() {
    this.set("userSlidingWindow", null);
  }
  // END Ember Div Events


  didRender() {
    this._super(...arguments);

    if(this.initDone) {
      this.extendPlotlyTimelineChart(this.get("timestamps"));
    } else {
      this.setupPlotlyTimelineChart(this.get("timestamps"));
      this.setupPlotlyListenerCSS();
    }
  };

  setupPlotlyListenerCSS() {
    const plotlyDiv = document.getElementById("plotlyDiv");
    const dragLayer = document.getElementsByClassName('nsewdrag')[0];

    if(plotlyDiv && plotlyDiv.layout) {

      const self = this;

      plotlyDiv.on('plotly_click', function(event){
        const clickedTimestamp = new Date(event.points[0].x);
        // closure action
        self.clicked(clickedTimestamp.getTime());
      });

      // Show cursor when hovering data point
      if(dragLayer) {
        plotlyDiv.on('plotly_hover', function(){
          dragLayer.style.cursor = 'pointer'
        });
        
        plotlyDiv.on('plotly_unhover', function(){
          dragLayer.style.cursor = ''
        });
      }
    }

  };

  setupPlotlyTimelineChart(timestamps : Array<Timestamp>) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    const x : Array<Date> = [];
    const y : Array<number> = [];

    for(const timestamp of timestamps) {
      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));
    }

    const latestTimestamp = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, this.get("slidingWindowLowerBoundInMinutes"), this.get("slidingWindowUpperBoundInMinutes"));
    const layout = this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);

    Plotly.newPlot(
      'plotlyDiv',
      this.getPlotlyDataObject(x,y), 
      layout,
      this.getPlotlyOptionsObject()
    );

    this.initDone = true;

  };


  extendPlotlyTimelineChart(timestamps : Array<Timestamp>) {

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    const x : Array<Date> = [];
    const y : Array<number> = [];

    for(const timestamp of timestamps) {
      x.push(new Date(timestamp.get('timestamp')));
      y.push(timestamp.get('totalRequests'));
    }    

    const latestTimestamp = timestamps.lastObject;
    const latestTimestampValue = new Date(latestTimestamp.get('timestamp'));

    const windowInterval = this.getSlidingWindowInterval(latestTimestampValue, this.get("slidingWindowLowerBoundInMinutes"), this.get("slidingWindowUpperBoundInMinutes"));

    const layout = this.get("userSlidingWindow") ? this.get("userSlidingWindow") : this.getPlotlyLayoutObject(windowInterval.min, windowInterval.max);   

    Plotly.react(
      'plotlyDiv',
      this.getPlotlyDataObject(x,y),
      layout,
      this.getPlotlyOptionsObject()
    );
  };

  // BEGIN Helper functions

  hoverText(x : Array<Date> ,y : Array<number>) {
    return x.map((xi, i) => `<b>Time</b>: ${xi}<br><b>Total Requests</b>: ${y[i]}<br>`);
  };

  getSlidingWindowInterval(t : Date, lowerBound : number, upperBound : number) : {"min" : number, "max" : number} {
    const minTimestamp = t.setMinutes(t.getMinutes() - lowerBound);
    const maxTimestamp = t.setMinutes(t.getMinutes() + upperBound);

    return {"min" : minTimestamp, "max": maxTimestamp};
  };

  getPlotlySlidingWindowUpdateObject(minTimestamp : number, maxTimestamp : number) : {xaxis : {type: 'date', range: number[]} } {
    return {
      xaxis: {
        type: 'date',
        range: [minTimestamp,maxTimestamp]
      }        
    };
  };

  getPlotlyLayoutObject(minRange:number, maxRange:number) : {} {
    return {
      dragmode: 'pan', 
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
        b: 20,
        t: 20,
        pad: 4
      }
    };
  };

  getPlotlyDataObject(dates : Date[], requests : number[]) : [{}] {
    return [
      {
        hoverinfo: 'text',
        type: 'scattergl',
        x: dates,
        y: requests, 
        hoverlabel: {
          align: "left"
        },
        text: this.hoverText(dates, requests) 
      }
    ];
  };

  getPlotlyOptionsObject() : {} {
    return {
      displayModeBar: false,
      scrollZoom: true,
      responsive: true
    };
  };

  // END Helper functions

};
