import DS from 'ember-data';

const { attr } = DS;

export default class FlagSetting extends DS.Model {

  @attr('string') description!: string;
  
  @attr('string') displayName!: string;

  @attr('boolean') defaultValue!: boolean;
}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'flagsetting': FlagSetting;
	}
}
