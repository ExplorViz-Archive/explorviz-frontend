import Ember from 'ember';
import moment from 'npm:moment';

const {Component, $, on} = Ember;

export default Component.extend({

  timestampRepo: Ember.inject.service("repos/timestamp-repository"),
  reloadHandler: Ember.inject.service("reload-handler"),
  
  plot: null,

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

    $(window).resize(() => {
      this.resizePlot();
    });

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

    const chartData = this.buildChartData();

    const winWidth = $(window).width();
    Ember.$("#timeline").css('width', winWidth);

    // Needed to fix the height of the plot
    Ember.$("#timelinePlot").css('width', $("#timeline").width());
    Ember.$("#timelinePlot").css('height', $("#timeline").height());

    const ctx = $("#timelinePlot");

    const config = {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: '# of Calls',
          //data: [0, 2000, 5000, 3000, 1000, 0],
          data: chartData.values,
          backgroundColor: 'rgba(0, 80, 255, 0.2)',
          borderColor: 'rgba(0, 80, 255, 0.8)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: "# of Calls"
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Calls',
              fontStyle: 'bold'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },

        /*
        TODO
        Panning & Zooming are not working well atm
         */
        /*
        pan: {
          enabled: false,
          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'x',
          speed: 10,
          threshold: 10
        },
        */
        /*
        zoom: {
          enabled: true,
          drag: true,
          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'y',
          limits: {
            max: chartData.maxValue,
            min: 0
          }
        }
        */
      }
    };

    const newPlot = new Chart(ctx, config);
    this.set('plot', newPlot);
  }),


  // build chart-ready data
  buildChartData() {

    const dataPointPixelRatio = 30;

    const timestamps = this.get('timestampRepo.latestTimestamps');

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



  // TODO WIP Update function for plot
  updatePlot() {

    const updatedPlot = this.get('plot');

  	if(updatedPlot === null){
      return;
    }
    const chartReadyTimestamps = this.buildChartData();

  	const labels = chartReadyTimestamps.labels;
  	const values = chartReadyTimestamps.values;
  	
  	updatedPlot.data.labels = labels;
  	updatedPlot.data.datasets[0].data = values; 
  	//update the Changes
  	this.set("plot", updatedPlot);
  	this.get("plot").update();

  },

  resizePlot() {
    this.renderPlot();
  }

});
