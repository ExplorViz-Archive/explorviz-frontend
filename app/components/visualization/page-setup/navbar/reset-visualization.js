import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  tagName: '',

  renderingService: service("rendering-service"),
  reloadHandler: service("reload-handler"),
  viewImporter: service("view-importer"),

  actions: {
    resetView() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.get('reloadHandler').startExchange();
    }
  }

});
