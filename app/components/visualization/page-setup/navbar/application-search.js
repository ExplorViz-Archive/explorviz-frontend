import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';
import { isBlank } from '@ember/utils';

/* eslint-disable require-yield */
export default Component.extend({

  store: service(),
  renderingService: service(),
  landscapeRepo: service('repos/landscape-repository'),
  highlighter: service('visualization/application/highlighter'),

  actions: {
    focusEntity() {
      const searchResult = this.findElementByString(this.get('searchString'));
      if (searchResult !== null) {
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

    if (!firstMatch ||
      this.get('highlighter.highlightedEntity') === firstMatch) {
      return;
    }

    const modelType = firstMatch.constructor.modelName;

    if (modelType === "clazz") {
      firstMatch.openParents();
    }
    else if (modelType === "component") {
      if (firstMatch.get('opened')) {
        // close and highlight, since it is already open
        firstMatch.setOpenedStatus(false);
      } else {
        // open all parents, since component is hidden
        firstMatch.openParents();
      }
    }

    this.get('highlighter').highlight(firstMatch);
    this.get('renderingService').redrawScene();
  },

  searchEntity: task(function * (term) {
    if (isBlank(term)) { return []; }
    return yield this.get('getPossibleEntityNames').perform(term);
  }).restartable(),

  getPossibleEntityNames: task(function * (name) {

    const searchString = name.toLowerCase();

    let components = this.get('store').peekAll('component');
    let clazzes = this.get('store').peekAll('clazz');
    let entityNames = [];

    components.forEach((component) => {
      const componentName = component.get('name').toLowerCase();
      if(componentName.startsWith(searchString)) {
        entityNames.push(component.get('name'));
      }      
    });

    clazzes.forEach((clazz) => {
      const clazzName = clazz.get('name').toLowerCase();
      if(clazzName.startsWith(searchString)) {
        entityNames.push(clazz.get('name'));
      }   
    });
    return entityNames;
  })


});
