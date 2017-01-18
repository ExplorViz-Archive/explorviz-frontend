import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  parent: belongsTo('timestampstorage'),
  timestamp: attr('string')
});
