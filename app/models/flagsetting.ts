import DS from 'ember-data';
import Setting from './setting';

const { attr } = DS;

export default class FlagSetting extends Setting {

  @attr('boolean') defaultValue!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'flagsetting': FlagSetting;
	}
}
