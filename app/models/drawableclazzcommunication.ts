import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';
import { computed } from '@ember/object';
import AggregatedClazzCommunication from './aggregatedclazzcommunication';
import ClazzCommunication from './clazzcommunication';
import TraceStep from './tracestep';
import Clazz from './clazz';
import Component from './component';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a DrawableClazzCommunication
 * Bi-directional between two clazzes
 *
 * @class DrawableClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class DrawableClazzCommunication extends DrawEdgeEntity {

  @attr('boolean', { defaultValue: false}) isBidirectional!: boolean;

  @attr('number') requests!: number;

  @attr('number') averageResponseTime!: number;

  @belongsTo('clazz', { inverse: null })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;

  @hasMany('aggregatedclazzcommunication', { inverse: null })
  aggregatedClazzCommunications!: DS.PromiseManyArray<AggregatedClazzCommunication>;

  @computed('aggregatedClazzCommunications')
  get containedTraces(){
    let traces = new Set();

    // Find all belonging traces
    this.get('aggregatedClazzCommunications').forEach((aggClazzComm: AggregatedClazzCommunication) => {
      aggClazzComm.get('clazzCommunications').forEach((clazzComm: ClazzCommunication) => {
        clazzComm.get('traceSteps').forEach((traceStep: TraceStep) => {
          let containedTrace = traceStep.belongsTo('parentTrace').value();
          if (containedTrace){
            traces.add(containedTrace);
          }
        });
      });
    });

    return traces;
  }

  // most inner component which common to both source and target clazz of communication
  @computed('sourceClazz', 'targetClazz')
  get parentComponent(this: DrawableClazzCommunication){
    // contains all parent components of source clazz incl. foundation in hierarchical order
    let sourceClazzComponents = [];
    let sourceClazz = this.belongsTo('sourceClazz').value() as Clazz;
    if(sourceClazz !== null) {
      let parentComponent = sourceClazz.belongsTo('parent').value() as Component;
      if(parentComponent !== null) {
        sourceClazzComponents.push(parentComponent);
        while (parentComponent !== null && !parentComponent.get('foundation')){
          parentComponent = parentComponent.belongsTo('parentComponent').value() as Component;
          sourceClazzComponents.push(parentComponent);
        }
      }
    }

    // contains all parent components of target clazz incl. foundation in hierarchical order
    let targetClazzComponents = [];
    let targetClazz = this.belongsTo('targetClazz').value() as Clazz;
    if(targetClazz !== null) {
      let parentComponent = targetClazz.belongsTo('parent').value() as Component;
      if(parentComponent !== null) {
        targetClazzComponents.push(parentComponent);
        while (parentComponent !== null && !parentComponent.get('foundation')){
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
    for (let i = 0; i < sourceClazzComponents.length && i < targetClazzComponents.length ; i++){
      if (sourceClazzComponents[i] === targetClazzComponents[i]){
        commonComponent = sourceClazzComponents[i];
      } else {
        break;
      }
    }

    return commonComponent;
  }

  toggleCommunicationDirection() {

    // Toggle of communication direction only sensible for bidirectional communication
    if (!this.get('isBidirectional')){
      return;
    }

    // Swap source and target clazz
    let oldSourceClazz = this.get('sourceClazz');
    let oldTargetClazz = this.get('targetClazz');
    this.set('sourceClazz', oldTargetClazz);
    this.set('targetClazz', oldSourceClazz);

    // Swap start and end point for rendering (e.g. drawing of arrows)
    let oldStartPoint = this.get('startPoint');
    let oldEndPoint = this.get('endPoint');
    this.set('startPoint', oldEndPoint);
    this.set('endPoint', oldStartPoint);
  }

  isVisible() {
    return this.get('parentComponent').get('opened');
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'drawableclazzcommunication': DrawableClazzCommunication;
  }
}
