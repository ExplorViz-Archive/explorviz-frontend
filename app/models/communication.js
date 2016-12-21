import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo } = DS;

export default DrawEdgeEntity.extend({

  requests: attr("number"),
  technology: attr("string"),

  averageResponseTimeInNanoSec: attr("number"),

  source: attr("application"),
  target: attr("application"),

  sourceClazz: attr("clazz"),
  targetClazz: attr("clazz"),

  parent: belongsTo('landscape')

});
