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
  },

  // adds links from payload to the query response
  // see: https://emberigniter.com/pagination-in-ember-with-json-api-backend/
  normalizeQueryResponse(store, clazz, payload) {
    const result = this._super(...arguments);
    result.meta = result.meta || {};

    if (payload.links) {
      result.meta.pagination = this.createPageMeta(payload.links);
    }

    return result;
  },

  // see: https://emberigniter.com/pagination-in-ember-with-json-api-backend/
  createPageMeta(data) {

    let meta = {};

    Object.keys(data).forEach(type => {
      const link = data[type];
      meta[type] = {};
      let a = document.createElement('a');
      a.href = link;

      a.search.slice(1).split('&').forEach(pairs => {
        const [param, value] = pairs.split('=');
        const paramDecoded = decodeURI(param);

        if (paramDecoded == 'page[number]') {
          meta[type].number = parseInt(value);
        }
        if (paramDecoded == 'page[size]') {
          meta[type].size = parseInt(value);
        }

      });
      a = null;
    });

    return meta;

  }

});
