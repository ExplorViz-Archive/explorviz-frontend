import DS from 'ember-data';
const { attr } = DS;

export default class UserSetting extends DS.Model.extend({

  booleanAttributes: attr(),
  numericAttributes: attr(),
  stringAttributes: attr()

}) {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'usersetting': UserSetting;
  }
}