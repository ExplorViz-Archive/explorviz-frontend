import DS from 'ember-data';

const { attr } = DS;

export default class NumericSettingsDescriptor extends DS.Model {

  @attr('string') description!: string;

  @attr('string') name!: string;

  @attr('number') min!: number;

  @attr('number') max!: number;

  @attr('number') defaultValue!: number;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'numericsettingsdescriptor': NumericSettingsDescriptor;
	}
}
