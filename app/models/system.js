import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, hasMany, belongsTo } = DS;

export default DrawNodeEntity.extend({
  opened: attr('boolean'),  
  nodegroups: hasMany('nodegroup'),
  parent: belongsTo('landscape')
});
