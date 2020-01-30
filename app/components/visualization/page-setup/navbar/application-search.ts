import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Highlighter from 'explorviz-frontend/services/visualization/application/highlighter';
import $ from 'jquery';

/* eslint-disable require-yield */
export default class ApplicationSearch extends Component {
  @service('rendering-service') renderingService!: RenderingService;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('visualization/application/highlighter') highlighter!: Highlighter;

  componentLabel = '-- Components --';

  clazzLabel = '-- Classes --';

  @task({ restartable: true })
  // eslint-disable-next-line
  searchEntity = task(function* (this: ApplicationSearch, term: string) {
    if (isBlank(term)) { return []; }
    return yield this.getPossibleEntityNames.perform(term);
  });

  @task
  // eslint-disable-next-line
  getPossibleEntityNames = task(function* (this: ApplicationSearch, name: string) {
    const searchString = name.toLowerCase();

    const latestApp = this.landscapeRepo.latestApplication;

    if (latestApp === null) {
      return [];
    }

    // re-calculate since there might be an update to the app (e.g. new class)
    const components = latestApp.getAllComponents();
    const clazzes = latestApp.getAllClazzes();
    const entities = [];

    const maxNumberOfCompNames = 20;
    let currentNumberOfCompNames = 0;

    let isComponentLabelSet = false;

    function searchEngineFindsHit(clazzNameToCheckAgainst: string, searchWord: string) {
      if (searchString.startsWith('*')) {
        const searchName = searchWord.substring(1);
        return clazzNameToCheckAgainst.includes(searchName);
      }
      return clazzNameToCheckAgainst.startsWith(searchWord);
    }

    for (let i = 0; i < components.length; i++) {
      if (currentNumberOfCompNames === maxNumberOfCompNames) {
        break;
      }

      const component = components.objectAt(i);

      if (component && !component.foundation) {
        const componentName = component.name.toLowerCase();
        if (searchEngineFindsHit(componentName, searchString)) {
          if (!isComponentLabelSet) {
            isComponentLabelSet = true;
            entities.push({ name: this.componentLabel });
          }

          entities.push(component);
          currentNumberOfCompNames++;
        }
      }
    }

    const maxNumberOfClazzNames = 20;
    let currentNumberOfClazzNames = 0;

    let isClazzLabelSet = false;

    for (let i = 0; i < clazzes.length; i++) {
      if (currentNumberOfClazzNames === maxNumberOfClazzNames) {
        break;
      }

      const clazz = clazzes.objectAt(i);

      if (clazz) {
        const clazzName = clazz.name.toLowerCase();
        if (searchEngineFindsHit(clazzName, searchString)) {
          if (!isClazzLabelSet) {
            isClazzLabelSet = true;
            entities.push({ name: this.clazzLabel });
          }

          entities.push(clazz);
          currentNumberOfClazzNames++;
        }
      }
    }
    return entities;
  });

  @action
  // eslint-disable-next-line
  removePowerselectArrow() {
    $('.ember-power-select-status-icon').remove();
  }

  @action
  onSelect(emberPowerSelectObject: any) {
    if (!emberPowerSelectObject || emberPowerSelectObject.length < 1) {
      return;
    }

    const entity = emberPowerSelectObject[0];
    const modelType = entity.constructor.modelName;

    if (!modelType || modelType === '') {
      return;
    }

    this.highlighter.unhighlightAll();

    if (modelType === 'clazz') {
      entity.openParents();
    } else if (modelType === 'component') {
      if (entity.opened) {
        // close and highlight, since it is already open
        entity.setOpenedStatus(false);
      } else {
        // open all parents, since component is hidden
        entity.openParents();
      }
    }

    this.highlighter.highlight(entity);
    this.renderingService.redrawScene();
  }
}
