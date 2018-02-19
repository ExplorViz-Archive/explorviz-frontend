import DS from 'ember-data';
import BaseEntity from "./baseentity";

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

  calledTimes: attr('number'),
  overallTracaeDuration: attr('number'),
  requests: attr('number'),
  averageResponseTime: attr('number'),
  orderIndexes: attr(),

});
