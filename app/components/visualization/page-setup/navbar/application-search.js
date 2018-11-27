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
  addionalData: service("additional-data"),

  selectedEntity: null,

  appComponents: null,
  appClazzes: null,

  actions: {   

    emptyAction() {
      // the onchange event of ember-power-select behaves badly
      // we only use the onclose event, but a onchange callback function 
      // is required
    },

    onSelectClose(emberPowerSelectObject) {

      if(!emberPowerSelectObject.highlighted || !emberPowerSelectObject.searchText) {
        this.set('selectedEntity', null);
        this.get('highlighter').unhighlightAll();
        this.get('renderingService').redrawScene();
        return;
      }

      const entity = emberPowerSelectObject.highlighted;

      this.set('selectedEntity', entity);
  
      const modelType = entity.constructor.modelName;
  
      if (modelType === "clazz") {
        entity.openParents();
      }
      else if (modelType === "component") {
        if (entity.get('opened')) {
          // close and highlight, since it is already open
          entity.setOpenedStatus(false);
        } else {
          // open all parents, since component is hidden
          entity.openParents();
        }
      }

      // close potential side-bar
      this.get('addionalData').emptyAndClose();
  
      this.get('highlighter').highlight(entity);
      this.get('renderingService').redrawScene();
    }
  },

  reCalculateDropdown(trigger) {

    // https://ember-basic-dropdown.com/docs/custom-position/

    let { top, left, height } = trigger.getBoundingClientRect();
    let style = {
      left: left,
      top: top +  height
    };
    return { style };
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
