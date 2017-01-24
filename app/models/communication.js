import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo } = DS;

export default DrawEdgeEntity.extend({

  requests: attr("number"),
  technology: attr("string"),

  averageResponseTimeInNanoSec: attr("number"),

  source: belongsTo("application"),
  target: belongsTo("application"),

  sourceClazz: attr("clazz"),
  targetClazz: attr("clazz"),

  parent: belongsTo("landscape"), 

  pipeColor: attr(),

  kielerEdgeReferences: [],

  points: []

});
