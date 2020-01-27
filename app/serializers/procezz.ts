/* eslint-disable class-methods-use-this */
import DS from 'ember-data';
import { ModelRegistry } from 'ember-data/model';

/**
 * TODO
 *
 * @class ProcezzSerializer
 * @extends DS.JSONAPISerializer
 */
export default class ProcezzSerializer extends DS.JSONAPISerializer {
  attrs = {
    agent: {
      serialize: true,
    },
  };

  payloadKeyFromModelName(modelName: keyof ModelRegistry): string {
    // singularize modelName (default plural)
    // since backend works singularized types
    return `${modelName}`;
  }
}
