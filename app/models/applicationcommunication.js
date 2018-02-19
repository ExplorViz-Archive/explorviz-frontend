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
    inverse: 'outgoingApplicationCommunication'
  }),

  targetApplication: belongsTo('application', {
    inverse: null
  }),

  sourceClazz: belongsTo('clazz', {
    inverse: null
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

  parent: belongsTo('landscape', {
    inverse: 'applicationCommunication'
  }),

});
