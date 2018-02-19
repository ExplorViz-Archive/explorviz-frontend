import DS from 'ember-data';
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
export default Draw3DNodeEntity.extend({

  name: attr('string'),
  fullQualifiedName: attr('string'),

  synthetic: attr('boolean'),
  foundation: attr('boolean'),

  children: hasMany('component', {
    inverse: 'parentComponent'
  }),

  clazzes: hasMany('clazz', {
    inverse: 'parent'
  }),

  parentComponent: belongsTo('component', {
    inverse: 'children'
  }),

  // breaks Ember, maybe because of circle ?

  /*belongingApplication: belongsTo('application', {
    inverse: 'components'
  }),*/

  setOpenedStatus(status) {

    this.get('children').forEach((child) => {
      child.set('highlighted', false);
      child.setOpenedStatus(false);
    });

    this.set('opened', status);
  },

  unhighlight() {
    this.set('highlighted', false);

    this.get('children').forEach((child) => {
      child.unhighlight();
    });

    this.get('clazzes').forEach((clazz) => {
      clazz.unhighlight();
    });
  },

  contains(possibleElem) {

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

  },

  openParents: function() {
    let parentModel = this.belongsTo('parentComponent').value();

    if(parentModel !== null) {
      parentModel.set('opened', true);
      parentModel.openParents();
    }
  },

  filterChildComponents(attributeString, predicateValue) {
    const filteredComponents = [];

    this.get('children').forEach((component) => {
      if(component.get(attributeString) === predicateValue) {
        filteredComponents.push(component);
      }
    });

    return filteredComponents;
  }

});
