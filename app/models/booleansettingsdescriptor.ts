import DS from 'ember-data';

const { attr } = DS;

export default class BooleanSettingsDescriptor extends DS.Model {

  @attr('string') description!: string;
  
  @attr('string') name!: string;

  @attr('boolean') defaultValue!: boolean;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'booleansettingsdescriptor': BooleanSettingsDescriptor;
	}
}
