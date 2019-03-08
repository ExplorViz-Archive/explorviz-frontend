import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  traceTimeUnit: 'ms',
  traceStepTimeUnit: 'ms',

  additionalData: service('additional-data'),
  highlighter: service('visualization/application/highlighter'),
  landscapeRepo: service('repos/landscape-repository'),
  renderingService: service(),

  // Compute current traces when highlighting changes
  traces: computed('highlighter.highlightedEntity', 'landscapeRepo.latestApplication', function () {
    let highlighter = this.get('highlighter');
    if (highlighter.get('isTrace')) {
      return [highlighter.get('highlightedEntity')];
    } else {
      return this.filterAndSortTraces(this.get('landscapeRepo.latestApplication.traces'));
    }
  }),

  filterAndSortTraces(traces){
    let filteredTraces = [];
    traces.forEach( (trace) => {
      filteredTraces.push(trace);
    });
    return filteredTraces;
  },

  init() {
    this.get('additionalData').on('showWindow', this, this.onWindowChange);
    this._super(...arguments);
  },

  actions: {
    clickedTrace(trace) {
      if (trace.get('highlighted')){
        this.get('highlighter').unhighlightAll();
      } else {
        this.get('highlighter').highlightTrace(trace);
      }

      this.get('renderingService').redrawScene();
    },

    selectNextTraceStep() {
      this.get('highlighter').highlightNextTraceStep();
      this.get('renderingService').redrawScene();
    },

    selectPreviousTraceStep() {
      this.get('highlighter').highlightPreviousTraceStep();
      this.get('renderingService').redrawScene();
    },

    toggleTraceTimeUnit() {
      let timeUnit = this.get('traceTimeUnit');
      if (timeUnit === 'ms'){
        this.set('traceTimeUnit', 's');
      } else if (timeUnit === 's'){
        this.set('traceTimeUnit', 'ms');
      }
    },

    toggleTraceStepTimeUnit() {
      let timeUnit = this.get('traceStepTimeUnit');
      if (timeUnit === 'ms'){
        this.set('traceStepTimeUnit', 's');
      } else if (timeUnit === 's'){
        this.set('traceStepTimeUnit', 'ms');
      }
    },

    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/trace-selection");
    },
  },

  onWindowChange() {
    if (!this.get('additionalData.showWindow') && this.get('highlighter.isTrace')) {
      let highlighter = this.get('highlighter');
      highlighter.unhighlightAll();
      this.get('renderingService').redrawScene();
    }
  },

});
