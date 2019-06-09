import DS from 'ember-data';

export default class SettingsInfo extends DS.Model {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'settingsinfo': SettingsInfo;
  }
}