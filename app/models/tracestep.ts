import DS from 'ember-data';
import BaseEntity from './baseentity';
import ClazzCommunication from './clazzcommunication';

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
export default class TraceStep extends BaseEntity.extend({

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
    let clazzCommunication = this.belongsTo('clazzCommunication').value() as ClazzCommunication;

    if (clazzCommunication !== null) {
      clazzCommunication.openParents();
    }
  },

  highlight() {
    this.set('highlighted', true);
  },

  unhighlight() {
    this.set('highlighted', false);
  }

}) {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tracestep': TraceStep;
  }
}
