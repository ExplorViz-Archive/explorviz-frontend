import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';
import { isBlank } from '@ember/utils';

/* eslint-disable require-yield */
export default Component.extend({

  tagName: "",

  store: service(),
  renderingService: service(),
  landscapeRepo: service('repos/landscape-repository'),
  highlighter: service('visualization/application/highlighter'),

  appComponents: null,
  appClazzes: null,

  actions: {
    focusEntity() {
      const searchResult = this.findElementByString(this.get('searchString'));
      if (searchResult !== null) {
        this.get('renderingService').focusEntity();
      }
    }
  },

  findElementByString(searchString) {
    const searchResults = this.get('searchEntity.lastSuccessful.value');

    // TODO Do not pass string but entity. As a result, the following loop
    // won't be necessary and entities with the same name are distinguishable
    // (e.g. ConfigurationHandler in dummy mode)
    
    let firstMatch = null;
    for (let i = 0; i < searchResults.length; i++) {
      if(searchString === searchResults[i].get('name')) {
        firstMatch = searchResults[i];
        break;
      }
    }

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

    const latestApp = this.get('landscapeRepo.latestApplication');

    // re-calculate since there might be an update to the app (e.g. new class)
    const components = latestApp.getAllComponents();
    const clazzes = latestApp.getAllClazzes();
    const entities = [];

    const maxNumberOfCompNames = 20;
    let currentNumberOfCompNames = 0; 

    for (let i = 0; i < components.length; i++) {      
      if(currentNumberOfCompNames === maxNumberOfCompNames) {
        break;
      }

      const component = components.objectAt(i);
      const componentName = component.get('name').toLowerCase();
      if(componentName.startsWith(searchString)) {
        entities.push(component);
        currentNumberOfCompNames++;
      }
    }

    const maxNumberOfClazzNames = 20;
    let currentNumberOfClazzNames = 0;

    for (let i = 0; i < clazzes.length; i++) {      
      if(currentNumberOfClazzNames === maxNumberOfClazzNames) {
        break;
      }

      const clazz = clazzes.objectAt(i);
      const clazzName = clazz.get('name').toLowerCase();
      if(clazzName.startsWith(searchString)) {
        entities.push(clazz);
        currentNumberOfClazzNames++;
      }  
    }
    return entities;
  })


});
