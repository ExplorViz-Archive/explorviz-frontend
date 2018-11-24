import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  additionalData: service('additional-data'),
  highlighter: service('visualization/application/highlighter'),
  renderingService: service(),

  actions: {
    traceSelected(traceId) {
      let traces = this.get('additionalData.data');

      // mark selected trace
      traces.forEach( (trace) => {
        if (trace.traceId == traceId){
          trace.set('isSelected', true);
        } else {
          trace.set('isSelected', false);
        }
      });

      this.set('additionalData.data', traces);

      this.get('highlighter').highlightTrace(traceId);
      this.get('highlighter').applyHighlighting();
      this.get('renderingService').redrawScene();
    }
  },

  willDestroyElement(){
    // unhighlight trace
    let highlighter = this.get('highlighter');
    highlighter.unhighlightAll();
    this.get('renderingService').redrawScene();
  }
});
