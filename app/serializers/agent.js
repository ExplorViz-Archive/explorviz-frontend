import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  payloadKeyFromModelName: function(modelName) {
    // singularize modelName (default plural)
    // since backend works singularized types
    return modelName;
  }
});