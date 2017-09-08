import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, belongsTo } = DS;

/**
* Ember model for a CommunicationClazz.
* 
* @class CommunicationClazz-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default BaseEntity.extend({

  requestsCacheCount: attr(),

  methodName: attr('string'),
  
  traceIdToRuntimeMap: attr(),

  source: belongsTo('clazz', { inverse: null }),
  target: belongsTo('clazz', { inverse: null }),
  
  hidden: attr('boolean')

});