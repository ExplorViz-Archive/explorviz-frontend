import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  renderingService: service("rendering-service"),
  reloadHandler: service("reload-handler"),
  viewImporter: service("view-importer"),
  urlBuilder: service("url-builder"),

  actions: {

    exportState() {

      // ATTENTION: needs heavy refactoring, won't work atm

      // Pause timeshift
      this.get('reloadHandler').stopExchange();
      // Update query parameters
      this.get('urlBuilder').requestURL();

      this.set('viewImporter.importedURL', true);

      this.set('timestamp', this.get('state').timestamp);
      this.set('appID', this.get('state').appID);

      this.set('camX', this.get('state').camX);
      this.set('camY', this.get('state').camY);
      this.set('camZ', this.get('state').camZ);

      // handle landscape or application
      if (this.get('renderingService.showLandscape')) {
        this.set('condition', this.get('state').landscapeCondition);
      }
      else {
        this.set('condition', this.get('state').appCondition);
      }
    }
  }

});
