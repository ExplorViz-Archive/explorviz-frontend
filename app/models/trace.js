import DS from 'ember-data';
import BaseEntity from './baseentity';
import { computed } from '@ember/object';

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

  length: computed('traceSteps', function(){
    return this.get('traceSteps').length;
  }),

  sourceClazz: computed('traceSteps', function(){
    let traceSteps = this.get('traceSteps');
    // assumption: Tracesteps non-empty and in order
    let firstTraceStep = traceSteps.objectAt(0);
    let sourceClazz = firstTraceStep.get('clazzCommunication').get('sourceClazz');
    return sourceClazz;
  }),

  targetClazz: computed('traceSteps', function(){
    let traceSteps = this.get('traceSteps');
    // assumption: Tracesteps non-empty and in order
    let lastTraceStep = traceSteps.objectAt(this.get('length') - 1);
    let targetClazz = lastTraceStep.get('clazzCommunication').get('targetClazz');
    return targetClazz;
  }),

  unhighlight() {
    this.set('isSelected', false);
  },

  openParents() {
    let traceSteps = this.hasMany('traceSteps').value();

    traceSteps.forEach((traceStep) => {
      if (traceStep !== null) {
        traceStep.openParents();
      }
    });
  },

});
