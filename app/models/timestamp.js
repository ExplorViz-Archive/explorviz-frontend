import DS from 'ember-data';

const { attr} = DS;

export default DS.Model.extend({
  timestamp: attr('number'),
  calls: attr('number')
});
