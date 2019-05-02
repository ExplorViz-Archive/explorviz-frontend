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

  // @ts-ignore
  @attr('number') timestamp!: number;

  // @ts-ignore
  @attr('string') eventType!: string;

  // @ts-ignore
  @attr('string') eventMessage!: string;

  // @ts-ignore
  @attr('boolean', { defaultValue: false }) isSelected!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'event': Event;
	}
}

