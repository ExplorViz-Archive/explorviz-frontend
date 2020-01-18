import DS from 'ember-data';
import BaseEntity from './baseentity';
import { computed } from '@ember/object';
import TraceStep from './tracestep';

const { attr, hasMany } = DS;

/**
 * Ember model for a Trace.
 *
 * @class Trace-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class Trace extends BaseEntity {

  @attr('string') traceId!: string;

  @attr('number') totalRequests!: number;

  @attr('number') totalTraceDuration!: number;

  @attr('number') averageResponseTime!: number;

  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  @hasMany('tracestep', { inverse: 'parentTrace' })
  traceSteps!: DS.PromiseManyArray<TraceStep>;

  @computed('traceSteps')
  get length() {
    return this.get('traceSteps').length;
  }

  @computed('traceSteps')
  get sourceClazz () {
    let traceSteps = this.get('traceSteps');
    // Assumption: Tracesteps non-empty and in order
    let firstTraceStep = traceSteps.objectAt(0);

    if(firstTraceStep === undefined)
      return undefined;

    let sourceClazz = firstTraceStep.get('clazzCommunication').get('sourceClazz');
    return sourceClazz;
  }

  @computed('traceSteps')
  get targetClazz () {
    let traceSteps = this.get('traceSteps');
    // Assumption: Tracesteps non-empty and in order
    let lastTraceStep = traceSteps.objectAt(this.get('length') - 1);

    if(lastTraceStep === undefined)
      return undefined;

    let targetClazz = lastTraceStep.get('clazzCommunication').get('targetClazz');
    return targetClazz;
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'trace': Trace;
  }
}

