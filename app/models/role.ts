import DS from 'ember-data';

export default class Role extends DS.Model {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'role': Role;
  }
}