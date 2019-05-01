import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';
import Component from './component';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a clazz.
*
* @class Clazz-Model
* @extends Draw3DNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class Clazz extends Draw3DNodeEntity.extend({

  name: attr('string'),
  fullQualifiedName: attr('string'),
  instanceCount: attr('number', {defaultValue: 0}),
  objectIds: attr(),

  clazzCommunications: hasMany('clazzcommunication', {
    inverse: 'sourceClazz'
  }),

  parent: belongsTo('component', {
    inverse: 'clazzes'
  }),

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', 'NORMAL');
  },

  openParents() {
    let parentModel = this.belongsTo('parent').value() as Component;

    if(parentModel !== null) {
      parentModel.set('opened', true);
      parentModel.openParents();
    }
  },

  isVisible() {
    return this.get('parent').get('opened');
  }

}) {}
