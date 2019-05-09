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
export default class DrawEdgeEntity extends BaseEntity {

  /**
  * Indicates the line thickness (a.k.a. width) for a edge.
  *
  * @property lineThickness
  * @type number
  */
  @attr('number', { defaultValue: 0.0}) lineThickness!: number;

  /**
  * Z-position of this edge.
  *
  * @property positionZ
  * @type number
  */
  @attr('number', { defaultValue: 0.0}) positionZ!: number;

  /**
  * All points of the edge.
  *
  * @property points
  * @type objects
  */
  @attr() points: any;
  @attr() pointsFor3D: any;

  @attr() startPoint: any;
  @attr() endPoint: any;

  @attr() state: any;

  @attr() pipeSize: any;
  @attr() pipeColor: any;

  kielerEdgeReferences = null;

  @attr('boolean', { defaultValue: false }) hidden!: boolean;

  @attr('boolean', { defaultValue: false }) highlighted!: boolean;

  init() {
    super.init();
    this.set('kielerEdgeReferences', []);
  }

  highlight() {
    this.set('highlighted', true);
    this.set('state', 'NORMAL');
  }

  unhighlight() {
    this.set('highlighted', false);
    this.set('state', 'TRANSPARENT');
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'drawedgeentity': DrawEdgeEntity;
  }
}
