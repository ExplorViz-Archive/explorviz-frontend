import BaseEntity from './baseentity';
import DS from 'ember-data';
const { attr } = DS;

/**
 * Ember model for an event occurring in the landscape.
 *
 * @class Event-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class Event extends BaseEntity.extend({

  timestamp: attr('number'),
  eventType: attr('string'),
  eventMessage: attr('string'),

  isSelected: attr('boolean', { defaultValue: false }),

}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'event': Event;
	}
}

