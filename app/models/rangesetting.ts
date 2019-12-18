import DS from 'ember-data';
import Setting from './setting';

const { attr } = DS;

export default class RangeSetting extends Setting {

  @attr('number') min!: number;

  @attr('number') max!: number;

  @attr('number') defaultValue!: number;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'rangesetting': RangeSetting;
	}
}
