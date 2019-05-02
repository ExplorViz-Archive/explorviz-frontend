import BaseEntity from './baseentity';
import DS from 'ember-data';

const { attr } = DS;

/**
 * Ember model for a databaseQuery.
 *
 * @class DatabaseQuery-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class DatabaseQuery extends BaseEntity {

  // @ts-ignore
  @attr('number') timestamp!: number;

  // @ts-ignore
  @attr('string') statementType!: string;

  // @ts-ignore
  @attr('string') sqlStatement!: string;

  // @ts-ignore
  @attr('string') returnValue!: string;

  // @ts-ignore
  @attr('number') responseTime!: number;

  // @ts-ignore
  @attr('boolean', {defaultValue: false}) isSelected!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'databasequery': DatabaseQuery;
	}
}
