import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

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
export default Draw3DNodeEntity.extend({

  name: attr('string'),
  fullQualifiedName: attr('string'),
  instanceCount: attr("number"),
  objectIds: attr(),

  outgoingClazzCommunications: hasMany('clazzCommunication', {
    inverse: 'sourceClazz'
  }),

  parent: belongsTo('component', {
    inverse: 'clazzes'
  }),

  unhighlight() {
    this.set('highlighted', false);
  },

  openParents() {
    let parentModel = this.belongsTo('parent').value();

    if(parentModel !== null) {
      parentModel.set('opened', true);
      parentModel.openParents();
    }
  }

});
