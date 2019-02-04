import Component from '@ember/component';
import { inject as service } from "@ember/service";
import Evented from '@ember/object/evented';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import debugLogger from 'ember-debug-logger';

import Chart from "chart.js";
import $ from 'jquery';

export default Component.extend(AlertifyHandler, Evented, {

    // No Ember generated container
    tagName: '',

    debug: debugLogger(),

    store: service(),
    timestampRepo: service("repos/timestamp-repository"),
    landscapeListener: service ("landscape-listener"),
    reloadHandler: service("reload-handler"),

    timelineChart: null,
    lastHighlightedElementIndex: null,
    canvas: null,

    backgroundColor: null,

    // @Override
    /**
     * This overridden Ember Component lifecycle hook enables calling
     * ExplorViz's setup code for actual rendering and custom listeners.
     *
     * @method didRender
     */
    didRender() {
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

        self.set('canvas', $('#timelineCanvas').get(0));

        self.get('timestampRepo').on("updated", function(newTimestamp) {
            self.onUpdated(newTimestamp);
        });

    },

    /**
     * Retrieves timestamps from the store and renders the timeline chart
     * @method renderChart
     */
    renderChart() {
        const self = this;

        self.debug("start timeline init");

        const color = Chart.helpers.color;
        self.set('backgroundColor', color('rgb(0, 123, 255)').alpha(0.5).rgbString());
        const backgroundColor = self.get('backgroundColor');

        var chartValues = [];
        var chartLabels = [];

        var ctx = $('#timelineCanvas').get(0).getContext('2d');

        var chartConfig = {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Requests',
                    backgroundColor: backgroundColor,
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
                    enabled: false,
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
                },
                'onClick': function (evt) {
                    self.chartClickHandler(evt);
                }
            }
        }

        var timelineChart = new Chart(ctx, chartConfig);
        self.set('timelineChart', timelineChart);

        self.debug("end timeline init");
    },

    /**
     * Clickhandler for the chart
     * @method chartClickhandler
     * @param {*} evt 
     */
    chartClickHandler(evt) {
        const self = this;

        const timelineChart = self.get('timelineChart');
        const backgroundColor = self.get('backgroundColor');

        var activePoint = timelineChart.getElementAtEvent(evt)[0];
        const lastHighlightedElementIndex = self.get('lastHighlightedElementIndex');

        // data point clicked - only one data point is highlighted at a time
        if (activePoint) {
            var data = activePoint._chart.data;
            var datasetIndex = activePoint._datasetIndex;
            var elementIndex = activePoint._index;
            var retrievedTimestamp = data.datasets[datasetIndex].data[elementIndex].x;

            // data point was already highlighted
            if (lastHighlightedElementIndex === elementIndex) {
                // do nothing
            } else {
                // highlight clicked data point
                timelineChart.getDatasetMeta(datasetIndex).data[elementIndex].custom = {
                    backgroundColor: 'red',
                    borderColor: 'black',
                    radius: '4'
                };

                // reset the color of the previous data point
                if (lastHighlightedElementIndex) {
                    timelineChart.getDatasetMeta(datasetIndex).data[lastHighlightedElementIndex].custom = {
                        backgroundColor: backgroundColor
                    };
                }

                // save the index of the clicked data point
                self.set('lastHighlightedElementIndex', elementIndex);

                self.set('timelineChart', timelineChart);
                timelineChart.update();

                // load specific landscape and pause visulization
                self.showVisualizationReloadMessageForUser(true);
                self.get('reloadHandler').loadLandscapeById(retrievedTimestamp, null)
            }
        } else {
            // reset the color of the previous data point and unpause visualization
            if (lastHighlightedElementIndex) {
                
                timelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = {
                    backgroundColor: backgroundColor,
                    borderColor: 'rgba(0,0,0,0.1)',
                    radius: '3'
                };
      
                self.set('lastHighlightedElementIndex', null);

                self.set('timelineChart', timelineChart);
                timelineChart.update();

                self.showVisualizationReloadMessageForUser(false);
                this.get('landscapeListener').startVisualizationReload();
                
            }
        }
    },

    /**
     * Updates the timeline chart
     * @method updateChart
     */
    updateChart(newTimestamp) {
        const self = this;

        self.debug("start timeline update");

        const updatedTimelineChart = self.get('timelineChart');

        const numOfDataPoints = updatedTimelineChart.data.datasets[0].data.length;

        const timestamp = newTimestamp.get('timestamp');
        const totalRequests = newTimestamp.get('totalRequests');

        const newTimelineData = {
            x: timestamp,
            y: totalRequests
        };

        // remove oldest timestamp in timeline to keep a fixed number of data points
        if (numOfDataPoints >= 10) {
            updatedTimelineChart.data.datasets[0].data.shift();
            updatedTimelineChart.data.labels.shift();
        }

        updatedTimelineChart.data.datasets[0].data.push(newTimelineData);
        updatedTimelineChart.data.labels.push(timestamp);

        // reset the color of the previous data point
        const lastHighlightedElementIndex = self.get('lastHighlightedElementIndex');

        if (lastHighlightedElementIndex) {
            updatedTimelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = {
                backgroundColor: self.get('backgroundColor')
            };
            self.set('lastHighlightedElementIndex', null);
        }

        updatedTimelineChart.update();

        self.debug("end timeline update");
    },


    /**
     * @method shiftChartValues
     */
    shiftChartValues() {

    },

    /**
     * Called when a new timestamp is passed and the chart needs to be updated
     * @method onUpdated
     * @param {*} newTimestamp 
     */
    onUpdated(newTimestamp) {
        this.updateChart(newTimestamp);
    },

    /**
     * Shows a message for the User that the visualization is paused or resumed
     * @method showVisualizationReloadMessageForUser
     * @param {*} pauseReload 
     */
    showVisualizationReloadMessageForUser(pause) {
        if(pause) {
          this.showAlertifyMessage("Visualization paused!");
        }
        else {
          this.showAlertifyMessage("Visualization resumed!");
        }
    }

});