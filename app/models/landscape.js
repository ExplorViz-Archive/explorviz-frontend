import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, hasMany } = DS;

export default BaseEntity.extend({
  hash: attr('number'),
  activities: attr('number'),
  systems: hasMany('system'),
  applicationCommunication: hasMany('communication')
});
