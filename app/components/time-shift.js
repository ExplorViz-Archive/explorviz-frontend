import Ember from 'ember';
import moment from 'npm:moment';

const {Component, $, on} = Ember;

export default Component.extend({

  timestampRepo: Ember.inject.service("repos/timestamp-repository"),
  reloadHandler: Ember.inject.service("reload-handler"),
  
  plot: null,

  dataPointPixelRatio: 17,

  actions: {

    toggleTimeline() {
      if ($(".timeline").attr('vis') === 'show') {
        // hide timeline        
        $(".timeline").slideUp();
        $("#vizContainer").animate({height:'+=200'});
        $(".timeline").attr('vis', 'hide');
        $('#toggleTimelineButton').removeClass('glyphicon-chevron-down')
          .addClass('glyphicon-chevron-up');
      }
      else {
        // show timeline        
        $(".timeline").slideDown();
        $("#vizContainer").animate({height:'-=200'});
        $(".timeline").attr('vis', 'show');
        $('#toggleTimelineButton').removeClass('glyphicon-chevron-up')
          .addClass('glyphicon-chevron-down');
      }
    },

    playPauseTimeshift: function() {
      if(this.get('reloadHandler.isReloading')) {
        this.get('reloadHandler').stopExchange();
      }
      else {
        this.get('reloadHandler').startExchange();
      }
    }
  },

  // @Override
  init() {
    this._super(...arguments);

    const self = this;

    // Listener for updating plot
    this.get('timestampRepo').on('updated', function() {
      self.updatePlot();
    });

    // Listeners for changing play / pause css
    this.get('reloadHandler').on('stopExchange', function() {
      $('#playPauseTimelineButton').removeClass('glyphicon-pause')
        .addClass('glyphicon-play');
    });

    this.get('reloadHandler').on('startExchange', function() {
      $('#playPauseTimelineButton').removeClass('glyphicon-play')
        .addClass('glyphicon-pause');
      self.get('plot').unselect(['Timestamps']);
    });
  },


  // @Override
  // Cleanup
  willDestroyElement() {
    this.get('timestampRepo').off('updated');
    this.get('reloadHandler').off('stopExchange');
    this.get('reloadHandler').off('startExchange');
  },

  renderPlot: on('didRender', function() {

    const self = this;

    const chartData = this.buildChartData();

    const values = chartData.values;
    values.unshift('Timestamps');

    const dates = chartData.labels;
    dates.unshift('xAxis');

    const chart = c3.generate({
      data: {
        x: 'xAxis',
        xFormat: '%H:%M:%S',
        columns: [dates, values],
        types: {
          Timestamps: 'area-spline'
          // 'line', 'spline', 'step', 'area', 'area-step' ...
        },        
        selection: {
          enabled: true,
          multiple: false
        },
        onclick: function(d) {self.loadTimestamp(d);}
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
              format: '%H:%M:%S'
          }
        }
      },
      legend: {
        show: false
      },
      zoom: {
        enabled: true
      }
    });

    this.set('plot', chart);
  }),


  // build chart-ready data
  buildChartData() {

    const dataPointPixelRatio = 30;

    const timestamps = this.get('timestampRepo.latestTimestamps');

    if(!timestamps) {
      return;
    }

    const sortedTimestamps = timestamps.sortBy('id');

    // define outside loop in case of error
    const timestampList = [];
    const timestampListFormatted = [];
    const callList = [];

    // Parse and format timestamps for timeline
    if (sortedTimestamps) {
      sortedTimestamps.forEach(function(timestamp) {
        const timestampValue = timestamp.get('id');
        timestampList.push(timestampValue);

        const callValue = timestamp.get('calls');
        callList.push(callValue);

        const parsedTimestampValue = moment(timestampValue,"x");
        const timestampValueFormatted = 
          parsedTimestampValue.format("HH:mm:ss").toString();
        timestampListFormatted.push(timestampValueFormatted);
      });
    }

    // maximum number of timestamps displayed in chart at one time
    const maxNumOfChartTimestamps = 
      parseInt(this.$()[0].clientWidth / dataPointPixelRatio);

    // TODO: error handling (no data etc)

    // Container for charts (limited size)
    let chartTimestamps = [];
    let chartCalls = [];
    const timestampListFormattedSize = timestampListFormatted.length;

    // limit size of displayed data points and labels
    if (timestampListFormattedSize > maxNumOfChartTimestamps) {
      chartTimestamps = timestampListFormatted.slice(
        timestampListFormattedSize-maxNumOfChartTimestamps,
          timestampListFormattedSize);

      chartCalls = callList.slice(
        timestampListFormattedSize-maxNumOfChartTimestamps,
          timestampListFormattedSize);
    }
    else {
      chartTimestamps = timestampListFormatted;
      chartCalls = callList;
    }

    // get maximum amount of call for scaling the chart
    const maxCalls = Math.max.apply(null, chartCalls);

    const chartData = {
      labels: chartTimestamps,
      values: chartCalls,
      maxValue: maxCalls
    };

    return chartData;
  },


  updatePlot() {

    const updatedPlot = this.get('plot');

  	if(updatedPlot === null){
      return;
    }
    const chartReadyTimestamps = this.buildChartData();

  	const labels = chartReadyTimestamps.labels;
  	const values = chartReadyTimestamps.values;

    const newLabel = ['xAxis', labels.pop()];
    const newValue = ['Timestamps', values.pop()];

    updatedPlot.flow({
      columns: [newLabel, newValue],
      length: 0,
      done: function () {        
        updatedPlot.zoom.enable(true);
      }
    });

    // calculate and set snippet of timeline
    const dataSetLength = chartReadyTimestamps.labels.length;

    const divWidth = this.get('plot').element.clientWidth;
    const numberOfPointsToShow = parseInt(divWidth / 
      this.get('dataPointPixelRatio'));

    const lowerBound = dataSetLength - numberOfPointsToShow <= 0 ? 
        0 : (dataSetLength - numberOfPointsToShow) ;  

    const lowerBoundLabel = labels[lowerBound];

    updatedPlot.zoom([lowerBoundLabel, newLabel[1]]);
  },


  loadTimestamp(timestamp) {
    console.log(timestamp);
    this.get('reloadHandler').stopExchange();
  },

});
