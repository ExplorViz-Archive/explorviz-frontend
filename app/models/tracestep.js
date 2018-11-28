import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
 * Ember model for a step in a trace.
 *
 * @class TraceStep-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default BaseEntity.extend({

  tracePosition: attr ('number'),
  requests: attr('number'),
  currentTraceDuration: attr('number'),
  averageResponseTime: attr('number'),

  parentTrace: belongsTo('trace', {
    inverse: 'tracestep'
  }),

});
