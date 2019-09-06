import Component from '@ember/component';
import { inject as service } from "@ember/service";
import Evented from '@ember/object/evented';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import debugLogger from 'ember-debug-logger';
import { timestampToDate } from 'explorviz-frontend/helpers/timestamp-to-date';

import Chart from "chart.js";
import $ from 'jquery';

/**
 * Renderer for the visualization timeline.
 *
 * @class Timeline-Component
 *
 * @module explorviz
 * @submodule visualization.page-setup.timeline
 */
export default Component.extend(Evented, {

    // No Ember generated container
    tagName: '',

    debug: debugLogger(),

    store: service(),
    timestampRepo: service("repos/timestamp-repository"),
    landscapeListener: service("landscape-listener"),
    reloadHandler: service("reload-handler"),

    timelineChart: null,
    lastHighlightedElementIndex: null,
    canvas: null,

    chartColors: null,
    maxNumOfDataPoints: null,

    listeners: null,


    // @Override
    /**
     * This overridden Ember Component lifecycle hook enables calling
     * ExplorViz's setup code for actual rendering and custom listeners.
     *
     * @method didRender
     */
    didRender() {
        this._super(...arguments);
        this.initChart();
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

        // unsubscribe from all services
        this.get('listeners').forEach(([service, event, listenerFunction]) => {
            this.get(service).off(event, listenerFunction);
        });
        this.set('listeners', null);
    },

    /**
     * Inititializes "updated" listener
     * @method initListener
     */
    initListener() {
        this.set('listeners', new Set());

        // listener for when a new timestamp (data point) arrives
        this.get('listeners').add([
            'timestampRepo',
            'updated',
            (newTimestamp) => {
                this.onUpdated(newTimestamp);
            }
        ]);

        // listener for when the visualization is resumed from the navbar
        this.get('listeners').add([
            'landscapeListener',
            'visualizationResumed',
            () => {
                this.onLandscapeListenerVisualizationResumed();
            }
        ]);

        // start subscriptions
        this.get('listeners').forEach(([service, event, listenerFunction]) => {
            this.get(service).on(event, listenerFunction);
        });
    },

    /**
     * Initializes default settings for the chart
     * @method initChart
     */
    initChart() {
        const self = this;

        // referencing the canvas
        self.set('canvas', $('#timelineCanvas').get(0));

        // setting the default colors for highlighting and resetting purposes
        const color = Chart.helpers.color;

        self.set('chartColors', {
            default: {
                backgroundColor: color('rgb(0, 123, 255)').alpha(0.5).rgbString(),
                borderColor: 'rgba(0,0,0,0.1)',
                radius: '3'
            },
            highlighted: {
                backgroundColor: 'red',
                borderColor: 'black',
                radius: '4'
            }
        });

        // setting the maximum number of data points shown in the timeline
        self.set('maxNumOfDataPoints', 10);
    },

    /**
     * Renders the timeline chart
     * @method renderChart
     */
    renderChart() {
        const self = this;

        self.debug("start timeline init");

        const backgroundColor = self.get('chartColors.default.backgroundColor');
        const borderColor = self.get('chartColors.default.borderColor');

        // chart data
        var chartValues = [];
        var chartLabels = [];

        // setting the context for the chart
        var ctx = $('#timelineCanvas').get(0).getContext('2d');

        // Chart configuration
        var chartConfig = {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Requests',
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
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
                            source: 'labels',
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
                },
            }
        };

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

        const colorsDefault = self.get('chartColors.default');
        const colorsHighlighted = self.get('chartColors.highlighted');

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
                timelineChart.getDatasetMeta(datasetIndex).data[elementIndex].custom = colorsHighlighted;

                // reset the style of the previous data point
                if (lastHighlightedElementIndex) {
                    timelineChart.getDatasetMeta(datasetIndex).data[lastHighlightedElementIndex].custom = colorsDefault;
                }

                // save the index of the clicked data point
                self.set('lastHighlightedElementIndex', elementIndex);

                self.set('timelineChart', timelineChart);
                timelineChart.update();

                // load specific landscape and pause visulization

                // convert timestamp to readable date for notification
                const formattedTimestamp = timestampToDate([retrievedTimestamp]);

                AlertifyHandler.showAlertifyMessage("Loading landscape [" + formattedTimestamp + "]");
                self.handleNotificationMessage(false);

                self.get('reloadHandler').loadLandscapeById(retrievedTimestamp);
            }
        } else {
            // reset the style of the previous data point and unpause the visualization
            if (lastHighlightedElementIndex) {

                timelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = colorsDefault;

                self.set('lastHighlightedElementIndex', null);

                self.set('timelineChart', timelineChart);
                timelineChart.update();

                self.handleNotificationMessage(true);

            }
            // TODO 
            // maybe Bug within ChartJS? The first data point can't be unhighlighted like the others
            else {
                self.unhighlightFirstDataPoint();
            }
        }
    },

    /**
     * Resets the style of first data point in the chart
     * @method unhighlightFirstDataPoint
     */
    unhighlightFirstDataPoint() {
        const self = this;

        const timelineChart = self.get('timelineChart');

        const colorsDefault = self.get('chartColors.default');

        timelineChart.getDatasetMeta(0).data[0].custom = colorsDefault;

        self.set('lastHighlightedElementIndex', null);
        self.set('timelineChart', timelineChart);
        timelineChart.update();

        if (self.get('landscapeListener').pauseVisualizationReload) {
            self.handleNotificationMessage(true);
        }
    },

    /**
     * Unhighlights all previosly selected data points in the chart
     * @method unhighlightAllDataPoints
     */
    unhighlightAllDataPoints() {
        const self = this;

        const timelineChart = self.get('timelineChart');
        const colorsDefault = self.get('chartColors.default');
        const lastHighlightedElementIndex = self.get('lastHighlightedElementIndex');

        if (lastHighlightedElementIndex) {
            timelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = colorsDefault;
        }

        self.unhighlightFirstDataPoint();
    },

    /**
     * Updates the timeline chart when "updated" is triggered
     * @method updateChart
     */
    updateChart(newTimestamp) {
        const self = this;

        self.debug("start timeline update");

        const updatedTimelineChart = self.get('timelineChart');

        const colorsDefault = self.get('chartColors.default');

        const numOfDataPoints = updatedTimelineChart.data.datasets[0].data.length;
        const maxNumOfDataPoints = this.get('maxNumOfDataPoints');

        const timestamp = newTimestamp.get('timestamp');
        const totalRequests = newTimestamp.get('totalRequests');

        const newTimelineData = {
            x: timestamp,
            y: totalRequests
        };

        // remove oldest timestamp in timeline to keep a fixed number of data points
        if (numOfDataPoints >= maxNumOfDataPoints) {
            updatedTimelineChart.data.datasets[0].data.shift();
            updatedTimelineChart.data.labels.shift();
        }

        updatedTimelineChart.data.datasets[0].data.push(newTimelineData);
        updatedTimelineChart.data.labels.push(timestamp);

        // reset the color of the previous data point
        const lastHighlightedElementIndex = self.get('lastHighlightedElementIndex');

        if (lastHighlightedElementIndex) {
            updatedTimelineChart.getDatasetMeta(0).data[lastHighlightedElementIndex].custom = colorsDefault;

            self.set('lastHighlightedElementIndex', null);
        }

        self.set('timelineChart', updatedTimelineChart);
        updatedTimelineChart.update();

        self.debug("end timeline update");
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
     * Called when the landscapeListener.startVisualizationReload is executed
     * @method onLandscapeListenerVisualizationResumed
     */
    onLandscapeListenerVisualizationResumed(){
        this.unhighlightAllDataPoints();
    },

    /**
     * Displays a notifaction message  and resumes/pauses the visualization
     * @method handleNotificationMessage
     * @param {true, false} pause (true: pause -> resume, false: resume -> pause )
     */
    handleNotificationMessage(pause) {
        if (pause) {
            AlertifyHandler.showAlertifyMessage("Visualization resumed!");
            this.get('landscapeListener').startVisualizationReload();
        }
        else {
            AlertifyHandler.showAlertifyMessage("Visualization paused!");
            this.get('landscapeListener').stopVisualizationReload();
        }
    }

});