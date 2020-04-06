import { computed } from '@ember/object';
import DS from 'ember-data';
import AggregatedClazzCommunication from './aggregatedclazzcommunication';
import Clazz from './clazz';
import ClazzCommunication from './clazzcommunication';
import Component from './component';
import TraceStep from './tracestep';
import BaseEntitity from './baseentity';
import Trace from './trace';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a DrawableClazzCommunication
 * Bi-directional between two clazzes
 *
 * @class DrawableClazzCommunication-Model
 * @extends BaseEntitity
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class DrawableClazzCommunication extends BaseEntitity {
  @attr('boolean', { defaultValue: false }) isBidirectional!: boolean;

  @attr('number') requests!: number;

  @attr('number') averageResponseTime!: number;

  @belongsTo('clazz', { inverse: null })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;

  @hasMany('aggregatedclazzcommunication', { inverse: null })
  aggregatedClazzCommunications!: DS.PromiseManyArray<AggregatedClazzCommunication>;

  @computed('aggregatedClazzCommunications')
  get containedTraces() {
    const traces: Set<Trace> = new Set();

    // Find all belonging traces
    this.get('aggregatedClazzCommunications').forEach((aggClazzComm: AggregatedClazzCommunication) => {
      aggClazzComm.get('clazzCommunications').forEach((clazzComm: ClazzCommunication) => {
        clazzComm.get('traceSteps').forEach((traceStep: TraceStep) => {
          const containedTrace = traceStep.belongsTo('parentTrace').value() as Trace;
          if (containedTrace) {
            traces.add(containedTrace);
          }
        });
      });
    });

    return traces;
  }

  @computed('aggregatedClazzCommunications')
  get containedTraceSteps() {
    const traceSteps: Set<TraceStep> = new Set();

    // Find all belonging traceSteps
    this.get('aggregatedClazzCommunications').forEach((aggClazzComm: AggregatedClazzCommunication) => {
      aggClazzComm.get('clazzCommunications').forEach((clazzComm: ClazzCommunication) => {
        clazzComm.get('traceSteps').forEach((traceStep: TraceStep) => {
          traceSteps.add(traceStep);
        });
      });
    });

    return traceSteps;
  }

  // most inner component which common to both source and target clazz of communication
  @computed('sourceClazz', 'targetClazz')
  get parentComponent(this: DrawableClazzCommunication) {
    // contains all parent components of source clazz incl. foundation in hierarchical order
    const sourceClazzComponents = [];
    const sourceClazz = this.belongsTo('sourceClazz').value() as Clazz;
    if (sourceClazz !== null) {
      let parentComponent = sourceClazz.belongsTo('parent').value() as Component;
      if (parentComponent !== null) {
        sourceClazzComponents.push(parentComponent);
        while (parentComponent !== null) {
          parentComponent = parentComponent.belongsTo('parentComponent').value() as Component;
          sourceClazzComponents.push(parentComponent);
        }
      }
    }

    // contains all parent components of target clazz incl. foundation in hierarchical order
    const targetClazzComponents = [];
    const targetClazz = this.belongsTo('targetClazz').value() as Clazz;
    if (targetClazz !== null) {
      let parentComponent = targetClazz.belongsTo('parent').value() as Component;
      if (parentComponent !== null) {
        targetClazzComponents.push(parentComponent);
        while (parentComponent !== null) {
          parentComponent = parentComponent.belongsTo('parentComponent').value() as Component;
          targetClazzComponents.push(parentComponent);
        }
      }
    }

    // let component arrays start with foundation (reversed hierarchical order)
    sourceClazzComponents.reverse();
    targetClazzComponents.reverse();

    // find the most inner common component
    let commonComponent = sourceClazzComponents[0];
    for (let i = 0; i < sourceClazzComponents.length && i < targetClazzComponents.length; i++) {
      if (sourceClazzComponents[i] === targetClazzComponents[i]) {
        commonComponent = sourceClazzComponents[i];
      } else {
        break;
      }
    }

    return commonComponent;
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'drawableclazzcommunication': DrawableClazzCommunication;
  }
}
