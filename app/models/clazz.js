import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo } = DS;

/**
* Ember model for a clazz.
* 
* @class Clazz-Model
* @extends Draw3DNodeEntity-Model
*/
export default Draw3DNodeEntity.extend({

  instanceCount: attr("number"),
  objectIds: attr(),

  parent: belongsTo('component'),
  visible: attr('boolean'),

  unhighlight() {
    this.set('highlighted', false);
  }

});
