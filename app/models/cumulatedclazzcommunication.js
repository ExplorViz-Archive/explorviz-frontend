import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for an CumulatedClazzCommunication
 * Bi-directional between two clazzes
 *
 * @class CumulatedClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default DrawEdgeEntity.extend({

  requests: attr(),

  sourceClazz: belongsTo('clazz', {
    inverse: null
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

  aggregatedClazzCommunications: hasMany('aggregatedclazzcommunication', {
    inverse: null
  }),

  // returns boolean to tell whether the communication contains a trace with the given id
  containsTrace(traceId) {
    let runtimeInformations = this.getRuntimeInformations();
    let found = false;

    runtimeInformations.forEach( (runtimeInformation) => {
      if (runtimeInformation.get('traceId') == traceId){
        found = true;
      }
    });

    return found;
  },

  // Returns a list of all underlying runtimeinformations
  getRuntimeInformations(){
    let containedRuntimeInformations = [];

    this.get('aggregatedClazzCommunications').forEach((aggregatedClazzCommunication) => {

      const clazzCommunications = aggregatedClazzCommunication.get('outgoingClazzCommunications');

      clazzCommunications.forEach((clazzCommunication) => {
          const runtimeInformations = clazzCommunication.get('runtimeInformations');
          runtimeInformations.forEach((runtimeInformation) => {
            containedRuntimeInformations.push(runtimeInformation);
          });

      });
    });
    
    return containedRuntimeInformations;
  }

});
