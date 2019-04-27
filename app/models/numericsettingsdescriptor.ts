import DS from 'ember-data';

const { attr } = DS;

export default class NumericSettingsDescriptor extends DS.Model.extend({
  description: attr('string'),
  name: attr('string'),
  min: attr('number'),
  max: attr('number'),
  defaultValue: attr('number')
}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'numericsettingsdescriptor': NumericSettingsDescriptor;
	}
}
