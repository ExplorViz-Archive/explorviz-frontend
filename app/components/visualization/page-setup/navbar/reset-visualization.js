import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  renderingService: service("rendering-service"),
  viewImporter: service("view-importer"),

  actions: {
    resetView() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
    }
  }

});
