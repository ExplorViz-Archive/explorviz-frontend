import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

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
export default class AggregatedClazzCommunication extends DrawEdgeEntity.extend({

  totalRequests: attr('number'),
  averageResponseTime: attr('number'),

  sourceClazz: belongsTo('clazz', {
    inverse: null
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

  clazzCommunications: hasMany('clazzcommunication', {
    inverse: null
  })

}) {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'aggregatedclazzcommunication': AggregatedClazzCommunication;
  }
}

