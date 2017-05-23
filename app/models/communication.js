import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo } = DS;

/**
* Ember model for a Communication.
* 
* @class Communication
* @extends DrawEdgeEntity
*/
export default DrawEdgeEntity.extend({

  requests: attr("number"),
  technology: attr("string"),

  averageResponseTimeInNanoSec: attr("number"),

  source: belongsTo("application", {
    inverse: 'outgoingCommunications'
  }),

  target: belongsTo("application", {
    inverse: 'incomingCommunications'
  }),

  sourceClazz: attr("clazz"),
  targetClazz: attr("clazz"),

  parent: belongsTo("landscape", {
    inverse: 'applicationCommunication'
  }), 

  pipeColor: attr(),

  kielerEdgeReferences: [],

  points: []

});
