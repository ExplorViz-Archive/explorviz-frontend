import DS from 'ember-data';
import BaseEntity from './baseentity';
import ClazzCommunication from './clazzcommunication';
import Trace from './trace';

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
export default class TraceStep extends BaseEntity {

  // @ts-ignore
  @attr('number') tracePosition!: number;

  // @ts-ignore
  @attr('number') requests!: number;

  // @ts-ignore
  @attr('number') currentTraceDuration!: number;

  // @ts-ignore
  @attr('number') averageResponseTime!: number;

  // @ts-ignore
  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  // @ts-ignore
  @belongsTo('trace', { inverse: 'traceSteps' })
  parentTrace!: DS.PromiseObject<Trace> & Trace;

  // @ts-ignore
  @belongsTo('clazzcommunication', { inverse: null })
  clazzCommunication!: DS.PromiseObject<ClazzCommunication> & ClazzCommunication;

  openParents(this: TraceStep) {
    let clazzCommunication = this.belongsTo('clazzCommunication').value() as ClazzCommunication;
    clazzCommunication.openParents();
  }

  highlight() {
    this.set('highlighted', true);
  }

  unhighlight() {
    this.set('highlighted', false);
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'tracestep': TraceStep;
  }
}
