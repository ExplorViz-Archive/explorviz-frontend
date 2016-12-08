import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, hasMany, belongsTo } = DS;

export default BaseEntity.extend({
  opened: attr('boolean'),  
  nodegroups: hasMany('nodegroup'),
  parent: belongsTo('landscape')
});
