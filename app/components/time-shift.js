import Component from '@ember/component';
import {inject as service} from '@ember/service';
import $ from 'jquery';

/* global c3 */

/**
* This component contains the core mechanics of the different (three.js-based)
* renderer. All functions below are called in a determined order, hence you only
* need to override them in your custom renderer.
*
* See {{#crossLink "Landscape-Rendering"}}{{/crossLink}} or
* {{#crossLink "Application-Rendering"}}{{/crossLink}} for example usage.
*
* Call order:
*
* 1.
*
* @class Time-Shift-Component
* @extends Ember.Component
*
* @module explorviz
* @submodule visualization.timeshift
*/
export default Component.extend({

  // No Ember generated container
  tagName: '',

  timestampRepo: service("repos/timestamp-repository"),
  reloadHandler: service("reload-handler"),

  plot: null,

  dataPointPixelRatio: 17,

  // @Override
  init() {
    this._super(...arguments);

    const self = this;

    // Listener for updating plot
    this.get('timestampRepo').on('updated', function() {
      self.updatePlot();
    });
  },


  // @Override
  // Cleanup
  willDestroyElement() {
      //workaround: hide timeline, otherwise the component timestamp-versionbar gets broken
    this.hideTimeline();
    this.get('timestampRepo').off('updated');
    this.get('reloadHandler').off('stopExchange');
    this.get('reloadHandler').off('startExchange');
  },

  didRender() {
    this._super(...arguments);
    this.renderPlot();
  },

  renderPlot() {
    const self = this;

    const chartData = this.buildChartData();

    if(!chartData) {
      return;
    }

    const values = chartData.values;
    values.unshift('Calls');

    const dates = chartData.labels;
    dates.unshift('Labels');

    const chart = c3.generate({
      data: {
        x: 'Labels',
        xFormat: '%H:%M:%S',
        columns: [dates, values],
        types: {
          Calls: 'area-spline'
          // 'line', 'spline', 'step', 'area', 'area-step' ...
        },
        selection: {
          enabled: true,
          multiple: false
        },
        onclick: ((d) => {
          self.loadTimestamp(d);
        })
      },
      transition: {duration: 0},
      axis: {
        x: {
          type: 'timeseries',
          localTime: false,
          tick: {
              format: '%H:%M:%S'
          },
          label: {
            text: 'Date',
            position: 'outer-center'
          }
        },
        y: {
          label: {
            text: 'Calls',
            position: 'outer-middle'
          }
        }
      },
      legend: {
        show: false
      },
      zoom: {
        enabled: true
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: false
        }
      },
      padding: {
        right: 30,
      },
      onresized: function() {
        self.applyOptimalZoom();
      }
    });

    this.set('plot', chart);
    this.applyOptimalZoom();
  },

  //hides the timeline
  hideTimeline(){
    if ($(".timeline").attr('vis') === 'show') {
      $(".timeline").slideUp(400);
      $("#vizContainer").animate({height:'+=120'});
      $(".timeline").attr('vis', 'hide');
    }
  },

  // build chart-ready data
  buildChartData() {

    const timestamps = this.get('timestampRepo.latestTimestamps');

    if(!timestamps || timestamps.length == 0) {
      return;
    }

    const sortedTimestamps = timestamps.sortBy('timestamp');

    // define outside loop in case of error
    const timestampList = [];
    const timestampListFormatted = [];
    const callList = [];

    // Parse and format timestamps for timeline
    if (sortedTimestamps) {
      sortedTimestamps.forEach(function(timestamp) {
        const timestampValue = timestamp.get('timestamp');
        timestampList.push(timestampValue);

        const callValue = timestamp.get('calls');
        callList.push(callValue);

        //const parsedTimestampValue = moment(timestampValue,"x");

        //const timestampValueFormatted =
        //  parsedTimestampValue.format("HH:mm:ss").toString();

        timestampListFormatted.push(timestampValue);
      });
    }

    const chartData = {
      labels: timestampListFormatted,
      values: callList
    };

    return chartData;
  },


  updatePlot() {

    const self = this;

    let updatedPlot = this.get('plot');

    if(!updatedPlot){
      this.renderPlot();
      updatedPlot = this.get('plot');
      //return;
    }

    const chartReadyTimestamps = this.buildChartData();

    if(!chartReadyTimestamps) {
      return;
    }

    const labels = chartReadyTimestamps.labels;
    const values = chartReadyTimestamps.values;

    //labels.unshift('Labels');
    //values.unshift('Calls');

    const newLabel = ['Labels', labels.pop()];
    const newValue = ['Calls', values.pop()];

    updatedPlot.flow({
      columns: [newLabel, newValue],
      length:0,
      done: function () {
        //render plot, so that data and rendered chart are consistent
        self.renderPlot();
        updatedPlot.zoom.enable(true);
        self.applyOptimalZoom();
      }
    });
  },


  applyOptimalZoom() {

    const allData = this.get('plot').data()[0].values;

    // calculate and set snippet of timeline
    const dataSetLength = allData.length;

    const divWidth = this.get('plot').element.clientWidth;
    const numberOfPointsToShow = parseInt(divWidth /
      this.get('dataPointPixelRatio'));

    const lowerBound = dataSetLength - numberOfPointsToShow <= 0 ?
        0 : (dataSetLength - numberOfPointsToShow) ;

    const lowerBoundLabel = allData[lowerBound].x;
    const upperBoundLabel = allData[dataSetLength - 1].x;

    this.get('plot').zoom([lowerBoundLabel, upperBoundLabel]);
  },


  loadTimestamp(timestamp) {
    const milliseconds = new Date(timestamp.x).getTime();
    this.get('reloadHandler').loadLandscapeById(milliseconds);
  }

});
