import DS from 'ember-data';

const { attr } = DS;

export default class NumericSettingsDescriptor extends DS.Model {

  // @ts-ignore
  @attr('string') description!: string;

  // @ts-ignore
  @attr('string') name!: string;

  // @ts-ignore
  @attr('number') min!: number;

  // @ts-ignore
  @attr('number') max!: number;

  // @ts-ignore
  @attr('number') defaultValue!: number;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'numericsettingsdescriptor': NumericSettingsDescriptor;
	}
}
