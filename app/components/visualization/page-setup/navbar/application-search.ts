import GlimmerComponent from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Clazz from 'explorviz-frontend/models/clazz';
import Component from 'explorviz-frontend/models/component';
import { action } from '@ember/object';
import Application from 'explorviz-frontend/models/application';
import { isBlank } from '@ember/utils';
import $ from 'jquery';

interface Args {
  application: Application,
  unhighlightAll(): void,
  highlightModel(entity: Clazz|Component): void,
  openParents(entity: Clazz|Component): void,
  closeComponent(component: Component): void
}
/* eslint-disable require-yield */
export default class ApplicationSearch extends GlimmerComponent<Args> {
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  componentLabel = '-- Components --';

  clazzLabel = '-- Classes --';

  @action
  /* eslint-disable-next-line class-methods-use-this */
  removePowerselectArrow() {
    $('.ember-power-select-status-icon').remove();
  }

  @action
  onSelect(emberPowerSelectObject: any) {
    if (!emberPowerSelectObject || emberPowerSelectObject.length < 1) {
      return;
    }

    const model = emberPowerSelectObject[0];

    this.args.unhighlightAll();

    if (model instanceof Clazz) {
      this.args.openParents(model);
    } else if (model instanceof Component) {
      this.args.openParents(model);
      this.args.closeComponent(model);
    }

    this.args.highlightModel(model);
  }

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

    const latestApp = this.args.application;

    if (latestApp === null) {
      return [];
    }

    // re-calculate since there might be an update to the app (e.g. new class)
    const components = latestApp.getAllComponents();
    const clazzes = latestApp.getAllClazzes();
    const entities = [];

    const maxNumberOfCompNames = 20;
    let currentNumberOfCompNames = 0;

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

      if (component) {
        const componentName = component.name.toLowerCase();
        if (searchEngineFindsHit(componentName, searchString)) {
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
}
