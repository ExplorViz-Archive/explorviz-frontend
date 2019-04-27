import DS from 'ember-data';

const { attr } = DS;

export default class BooleanSettingsDescriptor extends DS.Model.extend({
  description: attr('string'),
  name: attr('string'),
  defaultValue: attr('boolean')
}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'booleansettingsdescriptor': BooleanSettingsDescriptor;
	}
}
