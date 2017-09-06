import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo } = DS;

/**
* Ember model for a Communication.
* 
* @class Communication-Model
* @extends DrawEdgeEntity-Model
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

  sourceClazz: belongsTo("clazz"),
  targetClazz: belongsTo("clazz"),

  parent: belongsTo("landscape", {
    inverse: 'applicationCommunication'
  }), 

  pipeColor: attr(),

  kielerEdgeReferences: [],

  points: []

});
