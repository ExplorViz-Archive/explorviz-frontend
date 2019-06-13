import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';
import { isBlank } from '@ember/utils';
import $ from 'jquery';

/* eslint-disable require-yield */
export default Component.extend({

  tagName: "",

  renderingService: service(),
  landscapeRepo: service('repos/landscape-repository'),
  highlighter: service('visualization/application/highlighter'),

  selectedEntity: null,

  appComponents: null,
  appClazzes: null,

  componentLabel: "-- Components --",
  clazzLabel: "-- Classes --",

  // @Override
  didRender() {
    this._super(...arguments);

    // remove arrow from ember-power-select
    $('.ember-power-select-status-icon').remove();
  },


  actions: {

    onSelect(emberPowerSelectObject) {

      if(!emberPowerSelectObject || emberPowerSelectObject.length < 1) {
        return;
      }

      const entity = emberPowerSelectObject[0];
      const modelType = entity.constructor.modelName;

      if(!modelType || modelType === "") {
        return;
      }

      this.get('highlighter').unhighlightAll();
    
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

    let isComponentLabelSet = false;

    for (let i = 0; i < components.length; i++) {      
      if(currentNumberOfCompNames === maxNumberOfCompNames) {
        break;
      }

      const component = components.objectAt(i);

      // skip foundation, since it can't be highlighted anyways
      if(component.get('foundation'))
        continue;

      const componentName = component.get('name').toLowerCase();
      if(searchEngineFindsHit(componentName, searchString)) {

        if(!isComponentLabelSet) {
          isComponentLabelSet = true;
          entities.push({name: this.get('componentLabel')});
        }

        entities.push(component);
        currentNumberOfCompNames++;
      }
    }

    const maxNumberOfClazzNames = 20;
    let currentNumberOfClazzNames = 0;

    let isClazzLabelSet = false;

    for (let i = 0; i < clazzes.length; i++) {
      if(currentNumberOfClazzNames === maxNumberOfClazzNames) {
        break;
      }

      const clazz = clazzes.objectAt(i);
      const clazzName = clazz.get('name').toLowerCase();
      if(searchEngineFindsHit(clazzName, searchString)) {

        if(!isClazzLabelSet) {
          isClazzLabelSet = true;
          entities.push({name: this.get('clazzLabel')});
        }

        entities.push(clazz);
        currentNumberOfClazzNames++;
      }  
    }
    return entities;

    function searchEngineFindsHit(name, searchString) {
      if(searchString.startsWith('*')) {
        const searchName = searchString.substring(1);
        return name.includes(searchName);
      } else {
        return name.startsWith(searchString);
      }
    }
  })


});
