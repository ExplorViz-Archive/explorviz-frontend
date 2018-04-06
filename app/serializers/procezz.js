import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  attrs: {
    agent: { serialize: true }
  },

  payloadKeyFromModelName: function(modelName) {
    // singularize modelName (default plural)
    // since backend works singularized types
    return modelName;
  }
});