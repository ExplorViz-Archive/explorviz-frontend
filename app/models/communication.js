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
    inverse: 'incomingCommunications'
  }),

  target: belongsTo("application", {
    inverse: 'outgoingCommunications'
  }),

  sourceClazz: attr("clazz"),
  targetClazz: attr("clazz"),

  parent: belongsTo("landscape"), 

  pipeColor: attr(),

  kielerEdgeReferences: [],

  points: []

});
