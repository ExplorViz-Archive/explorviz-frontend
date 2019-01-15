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
export default BaseEntity.extend({

  timestamp: attr('number'),
  statementType: attr('string'),
  sqlStatement: attr('string'),
  returnValue: attr('string'),
  responseTime: attr('number')

});
