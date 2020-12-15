import DS from 'ember-data';
import Model from 'ember-data/model';

const { attr } = DS;

/**
 * Ember model for a Timestamp.
 *
 * @class Timestamp
 *
 * @module explorviz
 * @submodule model
 */
export default class Timestamp extends Model {
  @attr('number') timestamp!: number;

  @attr('number') totalRequests!: number;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'timestamp': Timestamp;
  }
}
