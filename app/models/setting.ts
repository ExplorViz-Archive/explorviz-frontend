import DS from 'ember-data';

const { attr } = DS;

export default class Setting extends DS.Model {
  @attr('string') description!: string;
  
  @attr('string') displayName!: string;

  @attr() defaultValue!: any;

  @attr('string') origin!: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'setting': Setting;
  }
}
