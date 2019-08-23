import Draw3DNodeEntity from './draw3dnodeentity';
import DS from 'ember-data';
import { computed } from '@ember/object';
import Clazz from './clazz';

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

  @attr('boolean', {defaultValue: false}) synthetic!: boolean;

  @attr('boolean', {defaultValue: false}) foundation!: boolean;

  @hasMany('component', { inverse: 'parentComponent' })
  children!: DS.PromiseManyArray<Component>;

  @hasMany('clazz', { inverse: 'parent' })
  clazzes!: DS.PromiseManyArray<Clazz>;

  @belongsTo('component', { inverse: 'children' })
  parentComponent!: DS.PromiseObject<Component> & Component;
  
  // breaks Ember, maybe because of circle ?

  /*belongingApplication: belongsTo('application', {
    inverse: 'components'
  }),*/

  setOpenedStatus(status: boolean) {
    this.get('children').forEach((child:Component) => {
      child.set('highlighted', false);
      child.setOpenedStatus(false);
    });

    this.set('opened', status);
  }

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', "NORMAL");

    this.get('children').forEach((child) => {
      child.unhighlight();
    });

    this.get('clazzes').forEach((clazz) => {
      clazz.unhighlight();
    });
  }

  contains(possibleElem: Clazz|Component) {

    let found = false;

    this.get('clazzes').forEach((clazz) => {
      if(clazz === possibleElem) {
        found = true;
      }
    });

    if(!found) {
      this.get('children').forEach((child) => {
        if(child === possibleElem) {
          found = true;
        } else {
          const tempResult = child.contains(possibleElem);
          if(tempResult) {
            found = true;
          }
        }
      });
    }

    return found;
  }

  getAllComponents() {
    let components:Component[] = [];

    this.get('children').forEach((child) => {      
      components.push(child);
      components = components.concat(child.getAllComponents());
    });

    return components;
  }

  getAllClazzes() {
    let clazzes:Clazz[] = [];

    this.get('clazzes').forEach((clazz) => {
      clazzes.push(clazz);
    });

    this.get('children').forEach((child) => {      
      clazzes = clazzes.concat(child.getAllClazzes());
    });

    return clazzes;
  }

  // adds all clazzes of the component or underlying components to a Set
  getContainedClazzes(containedClazzes: Set<Clazz>){
    const clazzes = this.get('clazzes');

    clazzes.forEach((clazz) => {
      containedClazzes.add(clazz);
    });

    const children = this.get('children');

    children.forEach((child) => {
      child.getContainedClazzes(containedClazzes);
    });
  }

/*   filterClazzes(attributeString: string, predicateValue: any) {
    const filteredClazzes:Clazz[] = [];

    const allClazzes = new Set();
    this.getContainedClazzes(allClazzes);

    allClazzes.forEach((clazz) => {
      if(clazz.get(attributeString) === predicateValue) {
        filteredClazzes.push(clazz);
      }
    });

    return filteredClazzes;
  }

  filterChildComponents(attributeString: string, predicateValue: any) {
    const filteredComponents:Component[] = [];

    this.get('children').forEach((component) => {
      if(component.get(attributeString) === predicateValue) {
        filteredComponents.push(component);
      }
      component.filterChildComponents(attributeString, predicateValue);
    });

    return filteredComponents;
  } */

  @computed('children')
  get hasOnlyOneChildComponent(this: Component) {
    return this.hasMany('children').ids().length < 2;
  }

  applyDefaultOpenLayout() {
    // opens all nested components until at least two entities are on the same level

    if(this.get('opened') && !this.get('foundation')) {
      // package already open,
      // therefore users must have opened it
      // Do not change the user's state
      return;
    }

    this.set('opened', true);

    const components = this.get('children');
    const clazzes = this.get('clazzes');

    if(components.get('length') + clazzes.get('length') > 1) {
      // there are two entities on this level
      // therefore, here is nothing to do
      return;
    }

    let component = components.objectAt(0);
    if(component) {
      component.applyDefaultOpenLayout();
    }
  }

  isVisible() {
    return this.get('parentComponent').get('opened');
  }

  openParents(this:Component) {
    let parentComponent = this.belongsTo('parentComponent').value() as Component;
    if(parentComponent !== null) {
      parentComponent.set('opened', true);
      parentComponent.openParents();
    }
  }

  closeParents(this:Component) {
    let parentComponent = this.belongsTo('parentComponent').value() as Component;
    if(parentComponent !== null) {
      parentComponent.set('opened', false);
      parentComponent.closeParents();
    }
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'component': Component;
  }
}
