import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  // workaround for camel-cased attributes
  keyForAttribute: function(attr) {
    return attr;
  }

});
