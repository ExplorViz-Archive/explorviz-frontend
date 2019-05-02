import DS from 'ember-data';

const { attr } = DS;

export default class StringSettingsDescriptor extends DS.Model {

  // @ts-ignore
  @attr('string') description!: string;
  
  // @ts-ignore
  @attr('string') name!: string;

  // @ts-ignore
  @attr('string') defaultValue!: string;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'stringsettingsdescriptor': StringSettingsDescriptor;
	}
}
