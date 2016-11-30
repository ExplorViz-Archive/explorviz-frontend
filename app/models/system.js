import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

export default BaseEntity.extend({
  parent: attr('number'),
  opened: attr('boolean'),
  name: attr('string')
});
