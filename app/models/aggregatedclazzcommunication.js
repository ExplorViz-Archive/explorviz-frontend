import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for an AggregatedClazzCommunication.
 *
 * @class AggregatedClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default DrawEdgeEntity.extend({

  requests: attr(),

  clazzCommunications: hasMany('clazzcommunication', {
    inverse: null
  }),

  sourceClazz: belongsTo('clazz', {
    inverse: null
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

});

