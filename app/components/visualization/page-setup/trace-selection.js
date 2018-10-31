import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

    additionalData: service('additional-data'),
    highlighter: service('visualization/application/highlighter'),
    renderingService: service(),

    actions: {
        traceSelected(traceID) {
            this.set('additionalData.showWindow', false);
            this.get('highlighter').highlightTrace(traceID);
            this.get('renderingService').redrawScene();
        }
      },

});
