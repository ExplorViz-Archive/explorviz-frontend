import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
 * Ember model for a RuntimeInformation.
 *
 * @class RuntimeInformation-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default BaseEntity.extend({

  traceId: attr ('number'),
  calledTimes: attr('number'),
  overallTraceDuration: attr('number'),
  requests: attr('number'),
  averageResponseTime: attr('number'),
  orderIndexes: attr(),

});
