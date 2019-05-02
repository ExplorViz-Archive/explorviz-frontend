import DS from 'ember-data';

const { attr } = DS;

export default class UserSetting extends DS.Model {

  // @ts-ignore
  @attr() booleanAttributes: any;
  // @ts-ignore
  @attr() numericAttributes: any;
  // @ts-ignore
  @attr() stringAttributes: any;
  
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'usersetting': UserSetting;
  }
}