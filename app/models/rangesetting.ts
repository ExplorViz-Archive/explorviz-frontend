import DS from 'ember-data';

const { attr } = DS;

export default class RangeSetting extends DS.Model {

  @attr('string') description!: string;

  @attr('string') displayName!: string;

  @attr('number') min!: number;

  @attr('number') max!: number;

  @attr('number') defaultValue!: number;

  @attr('string') origin!: string;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'rangesetting': RangeSetting;
	}
}
