import DS from 'ember-data';

const { attr } = DS;

export default class Userpreference extends DS.Model {

  @attr() value: any;
  @attr("string") settingId!: string;
  @attr("string") userId!: string;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'userpreference': Userpreference;
  }
}
