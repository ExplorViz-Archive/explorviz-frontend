import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo } = DS;

export default Draw3DNodeEntity.extend({

  instanceCount: attr("number"),
  objectIds: attr(),

  parent: belongsTo('component'),
  visible: attr('boolean')

});
