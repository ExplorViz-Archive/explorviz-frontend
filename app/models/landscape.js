import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  hash: attr('number'),
  activities: attr('number'),
  systems: hasMany('system')
});
