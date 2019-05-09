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

  @attr('number') timestamp!: number;

  @attr('string') statementType!: string;

  @attr('string') sqlStatement!: string;

  @attr('string') returnValue!: string;

  @attr('number') responseTime!: number;

  @attr('boolean', {defaultValue: false}) isSelected!: boolean;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'databasequery': DatabaseQuery;
	}
}
