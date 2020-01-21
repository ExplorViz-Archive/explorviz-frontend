import DS from 'ember-data';
import { camelize } from '@ember/string';
import { ModelRegistry } from 'ember-data/model';

const { JSONAPISerializer } = DS;

type Links = { first: string, last: string, next: string, prev: string };

/**
* TODO
*
* @class ApplicationSerializer
* @extends DS.JSONAPISerializer
*/
export default class ApplicationSerializer extends JSONAPISerializer {

  // workaround for camel-cased attributes
  keyForAttribute(key: string) {
    return camelize(key);
  }

  // workaround for camel-cased attributes
  // every value will now be camelized (camel-cased)
  keyForRelationship(key: string) {
    return camelize(key);
  }

  // Now the type of an Ember-Object isn't pluralized anymore, when it's serialized. Instead the Type will always be camel-case
  //@override
  payloadKeyFromModelName(modelName: keyof ModelRegistry){
    return camelize(`${modelName}`);
  }

  //this function will be used to bring the format of the server into the JSONAPI convention
  //@override
  normalizeQueryRecordResponse(store: DS.Store, primaryModelClass: DS.Model, payload: {}, id: string | number, requestType: string) {
    //Here you'll change payload to your needs
    return super.normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType);
  }

  // adds links from payload to the query response
  // see: https://emberigniter.com/pagination-in-ember-with-json-api-backend/
  normalizeQueryResponse(store: DS.Store, primaryModelClass: DS.Model, payload: any, id: string | number, requestType: string) {
    const result:any = super.normalizeQueryResponse(store, primaryModelClass, payload, id, requestType);
    result.meta = result.meta || {};

    if (payload.links) {
      result.meta.pagination = this.createPageMeta(payload.links);
    }

    return result;
  }

  // see: https://emberigniter.com/pagination-in-ember-with-json-api-backend/
  createPageMeta(data:Links) {
    let meta: any = {};

    Object.keys(data).forEach((type: keyof Links) => {
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
      a.remove();
    });

    return meta;

  }

}
