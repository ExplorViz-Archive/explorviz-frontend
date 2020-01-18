import DS from 'ember-data';
import Clazz from './clazz';
import TraceStep from './tracestep';
import BaseEntitity from './baseentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a ClazzCommunication.
 *
 * @class ClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class ClazzCommunication extends BaseEntitity {

  @attr('string') operationName!: string;

  @attr() requests: any;

  @hasMany('tracestep', { inverse: null })
  traceSteps!: DS.PromiseManyArray<TraceStep>;

  @belongsTo('clazz', { inverse: 'clazzCommunications' })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'clazzcommunication': ClazzCommunication;
  }
}
