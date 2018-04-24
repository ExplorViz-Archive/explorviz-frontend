import DS from 'ember-data';

const {JSONAPISerializer} = DS;

/**
* TODO
*
* @class Application-Serializer
* @extends DS.JSONAPISerializer
*/
export default JSONAPISerializer.extend({

  // workaround for camel-cased attributes
  keyForAttribute: function(attr) {
    return attr.camelize();
  },

  // workaround for camel-cased attributes
  // every value will now be camelized (camel-cased)
  keyForRelationship(key) {
    return key.camelize();
  },

  // Now the type of an Ember-Object isn't pluralized anymore, when it's serialized. Instead the Type will always be camel-case
  //@override
  payloadKeyFromModelName(key){
    return key.camelize();
  },

  //this function will be used to bring the format of the server into the JSONAPI convention
  //@override
  normalizeQueryRecordResponse (store, primaryModelClass, payload, id, requestType){
    //Here you'll change payload to your needs
    return this._super(store, primaryModelClass, payload, id, requestType);
  }

});
