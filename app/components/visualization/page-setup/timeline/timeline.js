import Component from '@ember/component';
import { inject as service } from "@ember/service";
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';

import Chart from "chart.js";
import $ from 'jquery';

export default Component.extend(Evented, {

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  store: service(),
  timestampRepo: service("repos/timestamp-repository"),

  timelineChart: null,
  canvas: null,

    // @Override
    /**
     * This overridden Ember Component lifecycle hook enables calling
     * ExplorViz's setup code for actual rendering and custom listeners.
     *
     * @method didRender
     */
    didRender(){
        this._super(...arguments);
        this.renderChart();
        this.initListener();
    },

    // @Override
    /**
     * This overridden Ember Component lifecycle hook enables calling
     * ExplorViz's custom cleanup code.
     *
     * @method willDestroyElement
     */
    willDestroyElement() {
        this._super(...arguments);
        this.cleanup();
    },

    /**
     * This function is called when the willDestroyElement event is fired. Inherit this
     * function to cleanup custom properties or unbind listener
     *
     * @method cleanup
     */
    cleanup() {
        this.set('timelineChart', null);
        this.get('timestampRepo').off('updated');
    },

    initListener() {
        const self = this;

        this.set('canvas', $('#timelineCanvas').get(0));

        this.get('timestampRepo').on("updated", function(newTimestamp) {
            self.onUpdated(newTimestamp);
        });

    },

    /**
     * Retrieves timestamps from the store and renders the timeline chart
     * @method renderChart
     */
    renderChart() {
        const self = this;

        const afterTimestamp = 1547644343153;
        const intervalSize = 5;

        self.debug("start import timestamp-request");
        
        // TODO querying needs to be refactored in placed in service
        self.get('store').query('timestamp', {after: afterTimestamp, intervalSize: intervalSize}).then(success, failure).catch(error);
            
        function success(timestamps){
            //self.set('timestampRepo.timelineTimestamps', timestamps);

            self.debug("end import timestamp-request");
            
            self.debug("start timeline init");
    
            var chartValues = [];
            var chartLabels = []; 
        
            const loadedTimestamps = self.get('timestampRepo.timelineTimestamps');


            // fill chartData with timestamps
            if (loadedTimestamps) {
                loadedTimestamps.forEach(function(timestamp) {           
                    chartValues.push({x: timestamp.get('timestamp'), y: timestamp.get('totalRequests')});             
                    chartLabels.push(timestamp.get('timestamp'));

                });
            }

            var color = Chart.helpers.color;
            var ctx = $('#timelineCanvas').get(0).getContext('2d');

            var chartConfig = {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Requests',
                        backgroundColor: color('rgb(0, 123, 255)').alpha(0.5).rgbString(),
                        borderColor: color('rgb(0, 123, 255)'), 
                        data: chartValues, 
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 0,
                            right: 35,
                            top: 25,
                            bottom: 0
                        }
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'point',
                    },
                    hover: {
                        enabled: true,
                        mode: 'point',
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Time',
                                fontStyle: 'bold'
                            },
                            type: 'time',
                            distribution: 'series',
                            time: {
                                unit: 'second',
                                displayFormats: {
                                    second: 'HH:mm:ss'
                                },
                                tooltipFormat: 'DD.MM.YYYY - kk:mm:ss'
                            },
                            ticks: {
                                source: 'labels'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Total Requests',
                                fontStyle: 'bold'
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    // performance optimizations
                    elements: {
                        line: {
                            tension: 0, // disables bezier curves
                        }
                    }
                }
            };

            var timelineChart = new Chart(ctx, chartConfig);
            self.set('timelineChart', timelineChart);

            // single click listener in order to load a specific landscape in the timeline
            self.get('canvas').onclick = function(evt) {
                var activePoint = timelineChart.getElementAtEvent(evt)[0];
                
                if (activePoint) {
                    var data = activePoint._chart.data;
                    var datasetIndex = activePoint._datasetIndex;
                    var index = activePoint._index;
                    var retrievedTimestamp = data.datasets[datasetIndex].data[index].x;
                    self.debug(retrievedTimestamp);
                    // TODO load specific landscape in visulization and pause
                }
                else {
                    // self.debug("no data point clicked")
                }
             };

            self.debug("end timeline init");
        }

        function failure(e){
            self.set('timestampRepo.timelineTimestamps', []);
            self.showAlertifyMessage("Timestamps couldn't be requested!" +
            " Backend offline?");
            self.debug("Timestamps couldn't be requested!", e);
        }
    
        function error(e){
            self.set('timestampRepo.timelineTimestamps', []);
            self.debug("Error when fetching timestamps: ", e);
        }

    },


  /**
   * Updates the timeline chart
   * @method updateChart
   */
  updateChart(newTimestamp) { 
        const self = this;    
    
        self.debug("start timeline update");

        const updatedTimelineChart = this.get('timelineChart');

        const numOfDataPoints = updatedTimelineChart.data.datasets[0].data.length;
        
        const timestamp = newTimestamp.get('timestamp');
        const totalRequests = newTimestamp.get('totalRequests');
        
        const newTimelineData = { x: timestamp, y: totalRequests };
        
        // remove oldest timestamp in timeline to keep a fixed number of data points
        if (numOfDataPoints >= 10) {
            updatedTimelineChart.data.datasets[0].data.shift();
            updatedTimelineChart.data.labels.shift();
        }

        updatedTimelineChart.data.datasets[0].data.push(newTimelineData);
        updatedTimelineChart.data.labels.push(timestamp);
        
        updatedTimelineChart.update();

        self.debug("end timeline update");
  },


  /**
   * @method shiftChartValues
   */
  shiftChartValues(){

  },

  /**
   * Called when a new timestamp is passed and the chart needs to be updated
   * @method onUpdated
   * @param {*} newTimestamp 
   */
  onUpdated(newTimestamp) {
    this.updateChart(newTimestamp);
  },

});

