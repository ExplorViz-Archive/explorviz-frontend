import BaseEntity from './baseentity';
import DS from 'ember-data';

const { attr } = DS;


/**
* Ember model for a DrawEdgeEntity. This model is mainly used for
* communications.
*
* @class DrawEdgeEntity-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.util
*/
export default BaseEntity.extend({

  /**
  * Indicates the line thickness (a.k.a. width) for a edge.
  *
  * @property lineThickness
  * @type number
  */
  lineThickness: attr('number', { defaultValue: 0.0}),

  /**
  * Z-position of this edge.
  *
  * @property positionZ
  * @type number
  */
  positionZ: attr('number', { defaultValue: 0.0}),

  /**
  * All points of the edge.
  *
  * @property points
  * @type objects
  */
  points: attr(),
  pointsFor3D: attr(),

  startPoint: attr(),
  endPoint: attr(),

  state: attr(),

  pipeSize: attr(),

  pipeColor: attr(),
  kielerEdgeReferences: null,
  hidden: attr('boolean', { defaultValue: false }),
  highlighted: attr('boolean', { defaultValue: false}),

  init() {
    this._super(...arguments);
    this.set('kielerEdgeReferences', []);
  },

  highlight() {
    this.set('highlighted', true);
    this.set('state', 'NORMAL');
  },

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', 'TRANSPARENT');
  },

});
