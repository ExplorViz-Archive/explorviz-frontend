import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  store: service(),
  renderingService: service(),
  landscapeRepo: service('repos/landscape-repository'),
  highlighter: service('visualization/application/highlighter'),

  actions: {
    focusEntity() {
      const searchResult = this.findElementByString(this.get('searchString'));

      if(searchResult !== null) {
        this.get('renderingService').focusEntity();
      }
      
    }
  },

  findElementByString(searchString) {

    const possiblGlobalCandidates = this.get('store')
      .peekAll('component')
      .filterBy('name', searchString);


    const latestApp = this.get('landscapeRepo.latestApplication');

    const firstMatch = possiblGlobalCandidates.find((candidate) => {
      return latestApp.contains(candidate);
    });

    if(firstMatch) {
      this.get('highlighter').highlight(firstMatch);
      this.get('renderingService').redrawScene();
    }

  }

});
