import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  hash: attr(),
  activities: attr(),
  systems: hasMany('system')
});
