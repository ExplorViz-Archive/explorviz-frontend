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
export default class Timestamp extends BaseEntity.extend({

  timestamp: attr('number'),
  totalRequests: attr('number')

}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'timestamp': Timestamp;
	}
}
