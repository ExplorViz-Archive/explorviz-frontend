import DS from 'ember-data';

const { attr } = DS;

export default DS.Model.extend({
  description: attr('string'),
  name: attr('string'),
  defaultValue: attr('string')
});
