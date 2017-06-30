import Ember from 'ember';
import moment from 'npm:moment';

const {Component, $, on} = Ember;

export default Component.extend({

  timestampRepo: Ember.inject.service("repos/timestamp-repository"),
  reloadHandler: Ember.inject.service("reload-handler"),
  
  plot: null,

  dataPointPixelRatio: 17,

  isUp: false,

  actions: {

    toggleTimeline() {
      if ($(".timeline").attr('vis') === 'show') {
        // hide timeline
        this.set('isUp', false);
        $(".timeline").slideUp();
        $("#vizContainer").animate({height:'+=200'});
        $(".timeline").attr('vis', 'hide');
        $('#toggleTimelineButton').removeClass('glyphicon-chevron-down')
          .addClass('glyphicon-chevron-up');
      }
      else {
        // show timeline
        this.set('isUp', true);
        $(".timeline").slideDown();
        $("#vizContainer").animate({height:'-=200'});
        $(".timeline").attr('vis', 'show');
        $('#toggleTimelineButton').removeClass('glyphicon-chevron-up')
          .addClass('glyphicon-chevron-down');
      }
    },

    playPauseTimeshift() {
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

      if(self.get('plot')) {
        self.get('plot').unselect(['Timestamps']);
      }
      
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
        onclick: function(d) {
          self.loadTimestamp(d);
        }
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
      },
      onresized: function() {
        self.applyOptimalZoom();
      }
    });

    this.set('plot', chart);

    this.applyOptimalZoom();
  }),


  // build chart-ready data
  buildChartData() {

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

    const chartData = {
      labels: timestampListFormatted,
      values: callList
    };

    return chartData;
  },


  updatePlot() {

    const self = this;

    const updatedPlot = this.get('plot');

  	if(updatedPlot === null){
      return;
    }
    const chartReadyTimestamps = this.buildChartData();

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
        updatedPlot.zoom.enable(true);
        self.applyOptimalZoom();
      }
    });
  },


  applyOptimalZoom() {

    if(!this.get('isUp')) {
      return;
    }

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
    console.log(timestamp);
    this.get('reloadHandler').stopExchange();
  },

});
