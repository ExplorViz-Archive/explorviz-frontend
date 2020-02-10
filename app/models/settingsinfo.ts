import DS from 'ember-data';

export default class SettingsInfo extends DS.Model {}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'settingsinfo': SettingsInfo;
  }
}
