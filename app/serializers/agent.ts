/* eslint-disable class-methods-use-this */
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';

export default class AgentSerializer extends DS.JSONAPISerializer {
  payloadKeyFromModelName(modelName: keyof ModelRegistry): string {
    // singularize modelName (default plural)
    // since backend works singularized types
    return `${modelName}`;
  }
}
