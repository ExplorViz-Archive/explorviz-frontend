import GlimmerComponent from '@glimmer/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency-decorators';
import { isBlank } from '@ember/utils';
import $ from 'jquery';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Highlighter from 'explorviz-frontend/services/visualization/application/highlighter';
import Clazz from 'explorviz-frontend/models/clazz';
import Component from 'explorviz-frontend/models/component';
import { action } from '@ember/object';

/* eslint-disable require-yield */
export default class ApplicationSearch extends GlimmerComponent {

  @service('rendering-service') renderingService!: RenderingService;
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;
  @service('visualization/application/highlighter') highlighter!: Highlighter;

  componentLabel = "-- Components --";
  clazzLabel = "-- Classes --";

  @action
  removePowerselectArrow() {
    $('.ember-power-select-status-icon').remove();
  }

  @action
  onSelect(emberPowerSelectObject:any) {

    if(!emberPowerSelectObject || emberPowerSelectObject.length < 1) {
      return;
    }

    const model = emberPowerSelectObject[0];

    this.highlighter.unhighlightAll();
  
    if (model instanceof Clazz) {
      model.openParents();
    }
    else if (model instanceof Component) {
      if (model.opened) {
        // Close and highlight, since it is already open
        model.setOpenedStatus(false);
      } else {
        // Open all parents, since component is hidden
        model.openParents();
      }
    }

    this.highlighter.highlight(model);
    this.renderingService.redrawScene();
  }

  reCalculateDropdown(trigger:Element) {

    // https://ember-basic-dropdown.com/docs/custom-position/

    let { top, left, height } = trigger.getBoundingClientRect();
    let style = {
      left: left,
      top: top +  height
    };
    return { style };
  }

  @task({ restartable: true })
  searchEntity = task(function * (this: ApplicationSearch, term:string) {
    if (isBlank(term)) { return []; }
    return yield this.getPossibleEntityNames.perform(term);
  });

  @task
  getPossibleEntityNames = task(function * (this: ApplicationSearch, name:string) {

    const searchString = name.toLowerCase();

    const latestApp = this.landscapeRepo.latestApplication;

    if(latestApp === null) {
      return [];
    }

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

      if(!component)
        continue;

      // Skip foundation, since it can't be highlighted anyways
      if(component.foundation)
        continue;

      const componentName = component.name.toLowerCase();
      if(searchEngineFindsHit(componentName, searchString)) {

        if(!isComponentLabelSet) {
          isComponentLabelSet = true;
          entities.push({name: this.componentLabel});
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

      if(!clazz)
        continue;

      const clazzName = clazz.name.toLowerCase();
      if(searchEngineFindsHit(clazzName, searchString)) {

        if(!isClazzLabelSet) {
          isClazzLabelSet = true;
          entities.push({name: this.clazzLabel});
        }

        entities.push(clazz);
        currentNumberOfClazzNames++;
      }  
    }
    return entities;

    function searchEngineFindsHit(name:string, searchString:string) {
      if(searchString.startsWith('*')) {
        const searchName = searchString.substring(1);
        return name.includes(searchName);
      } else {
        return name.startsWith(searchString);
      }
    }
  })
}
