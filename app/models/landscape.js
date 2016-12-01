import DS from 'ember-data';

const { attr, hasMany, belongsTo } = DS;

export default DS.Model.extend({
  hash: attr(),
  activities: attr(),
  // NEEDS TO BE HAS MANY OR BELONGSTO REGARDING ON COUNT OF SYSTEMS ? 
  systems: belongsTo('system')
});
