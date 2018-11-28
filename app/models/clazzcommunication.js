import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

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
export default DrawEdgeEntity.extend({

  operationName: attr('string'),
  requests: attr(),

  traces: hasMany('trace', {
    inverse: null
  }),

  sourceClazz: belongsTo('clazz', {
    inverse: 'clazzcommunication'
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

});
