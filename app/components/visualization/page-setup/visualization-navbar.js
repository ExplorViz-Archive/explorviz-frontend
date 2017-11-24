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

    const possibleGlobalComponentCandidates = this.get('store')
      .peekAll('component')
      .filterBy('name', searchString);

    const possibleGlobalClazzCandidates = this.get('store')
      .peekAll('clazz')
      .filterBy('name', searchString);

    const possibleGlobalCandidates = possibleGlobalComponentCandidates
      .concat(possibleGlobalClazzCandidates);

    // Retrieve the specific element of the currently visible latestApp
    const latestApp = this.get('landscapeRepo.latestApplication');

    const firstMatch = possibleGlobalCandidates.find((candidate) => {
      return latestApp.contains(candidate);
    });

    if(!firstMatch) {
      return;
    }

    if(firstMatch.get('opened')) {
      // close and highlight
      firstMatch.setOpenedStatus(false);
    } else {
      // open all parents
      firstMatch.openParents();
    }
    this.get('highlighter').highlight(firstMatch);
    this.get('renderingService').redrawScene();
  }

});
