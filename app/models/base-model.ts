import DS from 'ember-data';

const { Model, attr } = DS;

export default class BaseModel extends Model {
  @attr('string') name!: string;

  @attr('number') lastDiscoveryTime!: number;

  @attr('string') errorMessage!: string;

  @attr('boolean') errorOccured!: boolean;

  @attr('boolean') isHidden!: boolean;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'base-model': BaseModel;
  }
}
