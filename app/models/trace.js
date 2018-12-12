import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, hasMany } = DS;

/**
 * Ember model for a Trace.
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
  isSelected: attr('boolean', { defaultValue: false}),

  traceSteps: hasMany('tracestep', {
    inverse: 'parentTrace'
  }),

  unhighlight() {
    this.set('isSelected', false);
  },

});
