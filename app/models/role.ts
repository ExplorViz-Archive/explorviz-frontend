import DS from 'ember-data';
const { attr } = DS;


export default class Role extends DS.Model.extend({

  descriptor: attr('string')

}) {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'role': Role;
  }
}