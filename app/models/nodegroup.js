import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, belongsTo } = DS;

export default BaseEntity.extend({
  visible: attr('boolean'),
  parent: belongsTo('system')
});
