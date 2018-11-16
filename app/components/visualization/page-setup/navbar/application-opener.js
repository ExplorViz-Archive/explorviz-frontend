import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  store: service(),
  renderingService: service(),

  actions: {
    openAllComponents() {
      this.openAllComponents();
    }
  },

  openAllComponents() {
    const allClazzes = this.get('store').peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.openParents();
    });
    this.get('renderingService').redrawScene();
  }

});
