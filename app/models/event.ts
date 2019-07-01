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
export default class Event extends BaseEntity {

  @attr('number') timestamp!: number;

  @attr('string') eventType!: string;

  @attr('string') eventMessage!: string;

  @attr('boolean', { defaultValue: false }) isSelected!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'event': Event;
	}
}

