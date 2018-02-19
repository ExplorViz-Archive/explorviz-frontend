import BaseEntity from './baseentity';
import attr from 'ember-data/attr';

/**
 * Ember model for a databaseQuery.
 *
 * @class DatabaseQuery-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default BaseEntity.extend({

  timestamp: attr('number'),
	sqlStatement: attr('string'),
	returnValue: attr('string'),
	timeInNanos: attr('number')

});
