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

  isBidirectional: attr('boolean', { defaultValue: false}),
  requests: attr('number'),
  averageResponseTime: attr('number'),

  sourceClazz: belongsTo('clazz', {
    inverse: null
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

  aggregatedClazzCommunications: hasMany('aggregatedclazzcommunication', {
    inverse: null
  }),

  getContainedTraces(){
    let traceIds = new Set();
    let traces = new Set();

    // Find all belonging traces
    this.get('aggregatedClazzCommunications').forEach( (aggClazzComm) => {
      aggClazzComm.get('clazzCommunications').forEach( (clazzComm) => {
        clazzComm.get('tracesteps').forEach( (traceStep) => {
          let trace = traceStep.get('parentTrace');
          // Avoid adding trace twice (not ensured by Set in this case)
          if (! traceIds.has(trace.get('traceId'))){
            traces.add(trace);
            traceIds.add(trace.get('traceId'));
          }
        });
      });
    });

    return traces;
  },

});
