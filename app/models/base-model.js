import attr from 'ember-data/attr';
import Model from 'ember-data/model';

export default Model.extend({

  name: attr("string"),
  lastDiscoveryTime: attr("number"),

  errorMessage: attr("string"),
  errorOccured: attr("boolean"),

  isHidden: attr("boolean")

});