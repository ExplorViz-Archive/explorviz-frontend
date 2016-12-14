import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo, hasMany } = DS;

export default Draw3DNodeEntity.extend({

  instanceCount: attr('number'),
  objectIds: hasMany('number'),

  parent: belongsTo('component'),
  visible: attr('boolean')

});
