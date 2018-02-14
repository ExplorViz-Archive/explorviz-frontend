import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo } = DS;

/**
 * Ember model for an ApplicationCommunication.
 *
 * @class ApplicationCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default DrawEdgeEntity.extend({

  requests: attr('number'),
  technology: attr('string'),

  averageResponseTime: attr('number'),

  sourceApplication: belongsTo('application', {
    inverse: 'outgoingCommunications'
  }),

  targetApplication: belongsTo('application', {
    inverse: 'incomingCommunications'
  }),

  sourceClazz: belongsTo('clazz'),
  targetClazz: belongsTo('clazz'),

  parent: belongsTo('landscape', {
    inverse: 'applicationCommunication'
  }),

  pipeColor: attr(),

  kielerEdgeReferences: [],

  points: []

});
