import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

    additionalData: service('additional-data'),
    highlighter: service('visualization/application/highlighter'),
    renderingService: service(),

    actions: {
        traceSelected(traceId) {
            this.set('additionalData.showWindow', false);
            this.get('highlighter').highlightTrace(traceId);
            this.get('renderingService').redrawScene();
        }
      },

});
