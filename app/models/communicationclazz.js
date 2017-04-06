import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a CommunicationClazz.
* 
* @class CommunicationClazz
* @extends BaseEntity
*/
export default BaseEntity.extend({

  requestsCacheCount: attr('number'),

  methodName: attr('string'),
  
  //traceIdToRuntimeMap = new HashMap<Long, RuntimeInformation>

  source: attr('clazz'),
  target: attr('clazz'),
  
  hidden: attr('boolean')

});