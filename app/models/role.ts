import DS from 'ember-data';

export default class Role extends DS.Model {
  // implicit id field = name
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'role': Role;
  }
}
