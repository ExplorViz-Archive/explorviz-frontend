import DS from 'ember-data';

const { attr } = DS;

export default class StringSettingsDescriptor extends DS.Model.extend({
  description: attr('string'),
  name: attr('string'),
  defaultValue: attr('string')
}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'stringsettingsdescriptor': StringSettingsDescriptor;
	}
}
