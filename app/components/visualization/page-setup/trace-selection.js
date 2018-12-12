import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

    // No Ember generated container
    tagName: '',

    additionalData: service('additional-data'),
    highlighter: service('visualization/application/highlighter'),
    renderingService: service(),

    init(){
        this.get('additionalData').on('showWindow', this, this.onWindowChange);
        this._super(...arguments);
    },

    actions: {
        traceSelected(traceId) {
            let traces = this.get('additionalData.data.traces');

            // mark selected trace
            traces.forEach((trace) => {
                if (trace.get('traceId') == traceId) {
                    trace.set('isSelected', true);
                } else {
                    trace.set('isSelected', false);
                }
            });

            this.get('highlighter').highlightTrace(traceId);
            this.get('renderingService').redrawScene();
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
