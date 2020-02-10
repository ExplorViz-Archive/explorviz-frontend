import { computed } from '@ember/object';
import DS from 'ember-data';
import Clazz from './clazz';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a Component, e.g. a Java package.
 *
 * @class Component-Model
 * @extends Draw3DNodeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class Component extends Draw3DNodeEntity {
  @attr('string') name!: string;

  @attr('string') fullQualifiedName!: string;

  @attr('boolean', { defaultValue: false }) synthetic!: boolean;

  @hasMany('component', { inverse: 'parentComponent' })
  children!: DS.PromiseManyArray<Component>;

  @hasMany('clazz', { inverse: 'parent' })
  clazzes!: DS.PromiseManyArray<Clazz>;

  @belongsTo('component', { inverse: 'children' })
  parentComponent!: DS.PromiseObject<Component> & Component;

  // breaks Ember, maybe because of circle ?

  /* belongingApplication: belongsTo('application', {
    inverse: 'components'
  }), */

  contains(possibleElem: Clazz|Component) {
    let found = false;

    this.get('clazzes').forEach((clazz) => {
      if (clazz === possibleElem) {
        found = true;
      }
    });

    if (!found) {
      this.get('children').forEach((child) => {
        if (child === possibleElem) {
          found = true;
        } else {
          const tempResult = child.contains(possibleElem);
          if (tempResult) {
            found = true;
          }
        }
      });
    }

    return found;
  }

  getAllComponents() {
    let components: Component[] = [];

    this.get('children').forEach((child) => {
      components.push(child);
      components = components.concat(child.getAllComponents());
    });

    return components;
  }

  getAllClazzes() {
    let clazzes: Clazz[] = [];

    this.get('clazzes').forEach((clazz) => {
      clazzes.push(clazz);
    });

    this.get('children').forEach((child) => {
      clazzes = clazzes.concat(child.getAllClazzes());
    });

    return clazzes;
  }

  // adds all clazzes of the component or underlying components to a Set
  getContainedClazzes(containedClazzes: Set<Clazz>) {
    const clazzes = this.get('clazzes');

    clazzes.forEach((clazz) => {
      containedClazzes.add(clazz);
    });

    const children = this.get('children');

    children.forEach((child) => {
      child.getContainedClazzes(containedClazzes);
    });
  }

  @computed('children')
  get hasOnlyOneChildComponent(this: Component) {
    // tslint:disable-next-line: no-magic-numbers
    return this.hasMany('children').ids().length < 2;
  }

  getParentComponent(this: Component) {
    return this.belongsTo('parentComponent').value() as Component;
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'component': Component;
  }
}
