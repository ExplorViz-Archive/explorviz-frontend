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
            this.get('highlighter').highlightTrace(traceId);
            this.get('renderingService').redrawScene();
            this.get('additionalData').removeComponent("visualization/page-setup/trace-selection");
        }
      },

});
