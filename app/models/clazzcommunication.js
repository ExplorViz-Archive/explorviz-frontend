import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a ClazzCommunication.
 *
 * @class ClazzCommunication-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default DrawEdgeEntity.extend({

  operationName: attr('string'),
  requestsCacheCount: attr(),

  runtimeInformations:  hasMany('runtimeInformation', {
    inverse: null
}),

  sourceClazz: belongsTo('clazz', {
    inverse: 'outgoingClazzCommunications'
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

});
