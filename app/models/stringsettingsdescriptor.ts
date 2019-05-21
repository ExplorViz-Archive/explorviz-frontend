import DS from 'ember-data';

const { attr } = DS;

export default class StringSettingsDescriptor extends DS.Model {

  @attr('string') description!: string;

  @attr('string') name!: string;

  @attr('string') defaultValue!: string;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'stringsettingsdescriptor': StringSettingsDescriptor;
	}
}
