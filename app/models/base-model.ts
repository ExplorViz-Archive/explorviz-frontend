import DS from 'ember-data';

const { Model, attr } = DS;

export default class BaseModel extends Model {

  @attr("string") name!: string;

  @attr("number") lastDiscoveryTime!: string;

  @attr("number") errorMessage!: string;

  @attr("boolean") errorOccured!: boolean;

  @attr("boolean") isHidden!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'base-model': BaseModel;
	}
}
