import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, belongsTo } = DS;

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

  tracePosition: attr('number'),
  requests: attr('number'),
  currentTraceDuration: attr('number'),
  averageResponseTime: attr('number'),
  highlighted: attr('boolean', { defaultValue: false }),

  parentTrace: belongsTo('trace', {
    inverse: 'traceSteps'
  }),

  clazzCommunication: belongsTo('clazzcommunication', {
    inverse: null
  }),

  openParents() {
    let clazzCommunication = this.belongsTo('clazzCommunication').value();

    if (clazzCommunication !== null) {
      clazzCommunication.openParents();
    }
  },

  highlight() {
    this.set('highlighted', true);
  },

  unhighlight() {
    this.set('highlighted', false);
  },

});
