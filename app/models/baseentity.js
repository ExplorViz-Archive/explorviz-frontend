import DS from 'ember-data';

const { attr, Model } = DS;

export default Model.extend({
  type: attr('string')
});
