import DS from 'ember-data';

const { attr } = DS;


export default class Role extends DS.Model {

  @attr('string') descriptor!: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'role': Role;
  }
}