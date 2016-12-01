import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({
  hash: attr(),
  activities: attr()
});
