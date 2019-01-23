import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({

  booleanAttributes: attr(),
  numericAttributes: attr(),
  stringAttributes: attr()

});
