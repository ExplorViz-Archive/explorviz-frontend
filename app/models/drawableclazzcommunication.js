import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a DrawableClazzCommunication
 * Bi-directional between two clazzes
 *
 * @class DrawableClazzCommunication-Model
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
    let traces = new Set();

    // Find all belonging traces
    this.get('aggregatedClazzCommunications').forEach((aggClazzComm) => {
      aggClazzComm.get('clazzCommunications').forEach((clazzComm) => {
        clazzComm.get('tracesteps').forEach((traceStep) => {
          let containedTrace = traceStep.belongsTo('parentTrace').value();
          if (containedTrace){
            traces.add(containedTrace);
          }
        });
      });
    });

    return traces;
  },

  isVisible() {
    let sourceClazzModel = this.belongsTo('sourceClazz').value();
    let targetClazzModel = this.belongsTo('targetClazz').value();

    if (!sourceClazzModel || !targetClazzModel) {
      return false;
    } else {
      // consider also as visible if only a part of communication line is visible
      return sourceClazzModel.isVisible() || targetClazzModel.isVisible();
    }
  },

});
