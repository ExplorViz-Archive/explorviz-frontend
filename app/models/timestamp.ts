import BaseEntity from './baseentity';
import DS from 'ember-data';

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

  // @ts-ignore
  @attr('number') timestamp!: number;

  // @ts-ignore
  @attr('number') totalRequests!: number;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'timestamp': Timestamp;
  }
}
