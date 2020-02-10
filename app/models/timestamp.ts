import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
 * Ember model for a Timestamp.
 *
 * @class Timestamp-Model
 * @extends @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model
 */
export default class Timestamp extends BaseEntity {
  @attr('number') timestamp!: number;

  @attr('number') totalRequests!: number;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'timestamp': Timestamp;
  }
}
