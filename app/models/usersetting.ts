import DS from 'ember-data';

const { attr } = DS;

export default class UserSetting extends DS.Model {

  @attr() booleanAttributes: any;
  @attr() numericAttributes: any;
  @attr() stringAttributes: any;
  
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'usersetting': UserSetting;
  }
}