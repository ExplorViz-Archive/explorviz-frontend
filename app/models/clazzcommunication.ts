import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';
import Clazz from './clazz';

const { attr, belongsTo, hasMany } = DS;

/**
 * Ember model for a ClazzCommunication.
 *
 * @class ClazzCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class ClazzCommunication extends DrawEdgeEntity.extend({

  operationName: attr('string'),
  requests: attr(),

  traceSteps: hasMany('tracestep', {
    inverse: null
  }),

  sourceClazz: belongsTo('clazz', {
    inverse: 'clazzCommunications'
  }),

  targetClazz: belongsTo('clazz', {
    inverse: null
  }),

  openParents() {
    let sourceClazz = this.belongsTo('sourceClazz').value() as Clazz;
    if (sourceClazz !== null) {
      sourceClazz.openParents();
    }
    
    let targetClazz = this.belongsTo('targetClazz').value() as Clazz;
    if (targetClazz !== null) {
      targetClazz.openParents();
    }
  }

}) {}
