import DS from 'ember-data';
import Clazz from './clazz';
import ClazzCommunication from './clazzcommunication';
import BaseEntitity from './baseentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for an AggregatedClazzCommunication.
 * Uni-directional between two clazzes
 * @class AggregatedClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class AggregatedClazzCommunication extends BaseEntitity {

  @attr('number') totalRequests!: number;

  @attr('number') averageResponseTime!: number;

  @belongsTo('clazz', { inverse: null })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;

  @hasMany('clazzcommunication', { inverse: null })
  clazzCommunications!: DS.PromiseManyArray<ClazzCommunication>;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'aggregatedclazzcommunication': AggregatedClazzCommunication;
  }
}

