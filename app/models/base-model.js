import DS from 'ember-data';
const { attr, Model } = DS;

export default Model.extend({

  name: attr("string"),
  lastDiscoveryTime: attr("number"),

  errorMessage: attr("string"),
  errorOccured: attr("boolean"),

  isHidden: attr("boolean")

});