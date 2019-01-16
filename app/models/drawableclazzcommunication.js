import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';
import { computed } from '@ember/object';

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

  containedTraces: computed('aggregatedClazzCommunications', function(){
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
  }),

  // most inner component which common to both source and target clazz of communication
  parentComponent: computed('sourceClazz', 'targetClazz', function(){
    // contains all parent components of source clazz incl. foundation in hierarchical order
    let sourceClazzComponents = [];
    let parentComponent = this.belongsTo('sourceClazz').value().belongsTo('parent').value();
    sourceClazzComponents.push(parentComponent);
    while (!parentComponent.get('foundation')){
      parentComponent = parentComponent.belongsTo('parentComponent').value();
      sourceClazzComponents.push(parentComponent);
    }

    // contains all parent components of target clazz incl. foundation in hierarchical order
    let targetClazzComponents = [];
    parentComponent = this.belongsTo('targetClazz').value().belongsTo('parent').value();
    targetClazzComponents.push(parentComponent);
    while (!parentComponent.get('foundation')){
      parentComponent = parentComponent.belongsTo('parentComponent').value();
      targetClazzComponents.push(parentComponent);
    }

    // let component arrays start with foundation (reversed hierarchical order)
    sourceClazzComponents.reverse();
    targetClazzComponents.reverse();

    // find the most inner common component
    let commonComponent = sourceClazzComponents[0];
    for (let i = 0; i < sourceClazzComponents.length && i < targetClazzComponents.length ; i++){
      if (sourceClazzComponents[i] === targetClazzComponents[i]){
        commonComponent = sourceClazzComponents[i];
      } else {
        break;
      }
    }

    return commonComponent;
  }),

  isVisible() {
    return this.get('parentComponent').get('opened');
  },

});
