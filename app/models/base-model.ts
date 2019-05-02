import DS from 'ember-data';

const { Model, attr } = DS;

export default class BaseModel extends Model {

  // @ts-ignore
  @attr("string") name!: string;

  // @ts-ignore
  @attr("number") lastDiscoveryTime!: string;

  // @ts-ignore
  @attr("number") errorMessage!: string;

  // @ts-ignore
  @attr("boolean") errorOccured!: boolean;

  // @ts-ignore
  @attr("boolean") isHidden!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'base-model': BaseModel;
	}
}
