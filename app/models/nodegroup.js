import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

export default DrawNodeEntity.extend({
  visible: attr('boolean'),
  parent: belongsTo('system'),
  nodes: hasMany('node')
});
