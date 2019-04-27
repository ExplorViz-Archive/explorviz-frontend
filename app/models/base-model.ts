import DS from 'ember-data';
const { attr, Model } = DS;

export default class BaseModel extends Model.extend({

  name: attr("string"),
  lastDiscoveryTime: attr("number"),

  errorMessage: attr("string"),
  errorOccured: attr("boolean"),

  isHidden: attr("boolean")

}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'base-model': BaseModel;
	}
}
