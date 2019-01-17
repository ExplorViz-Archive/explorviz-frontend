import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  additionalData: service('additional-data'),
  highlighter: service('visualization/application/highlighter'),
  renderingService: service(),

  // Compute current traces when highlighting changes
  traces: computed('highlighter.highlightedEntity', function () {
    let highlighter = this.get('highlighter');
    if (highlighter.get('isTrace')) {
      return [highlighter.get('highlightedEntity')];
    }
    let highlightedEntity = highlighter.get('highlightedEntity');
    if (highlightedEntity &&
      highlightedEntity.constructor.modelName === "drawableclazzcommunication") {
      let traces = highlightedEntity.get('containedTraces');
      return traces;
    } else {
      return null;
    }
  }),

  selectedTrace: null,

  init() {
    this.get('additionalData').on('showWindow', this, this.onWindowChange);
    this._super(...arguments);
  },

  actions: {
    traceSelected(traceId) {
      let traces = this.get('traces');

      // mark selected trace
      traces.forEach((trace) => {
        if (trace.get('traceId') == traceId) {
          this.get('highlighter').highlightTrace(trace);
        }
      });
      this.get('renderingService').redrawScene();
    },

    selectNextTraceStep() {
      this.get('highlighter').highlightNextTraceStep();
    },

    selectPreviousTraceStep() {
      this.get('highlighter').highlightPreviousTraceStep();
    }
  },

  onWindowChange() {
    if (!this.get('additionalData.showWindow') && this.get('highlighter.isTrace')) {
      let highlighter = this.get('highlighter');
      highlighter.unhighlightAll();
      this.get('renderingService').redrawScene();
    }
  },

});
