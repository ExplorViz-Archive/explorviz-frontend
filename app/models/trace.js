import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
 * Ember model for a RuntimeInformation.
 *
 * @class Trace-Model
 * @extends Trace-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default BaseEntity.extend({

  traceId: attr ('number'),
  totalRequests: attr('number'),
  totalTraceDuration: attr('number'),
  averageResponseTime: attr('number'),

  traceSteps: hasMany('tracestep', {
    inverse: 'trace'
  }),

});
