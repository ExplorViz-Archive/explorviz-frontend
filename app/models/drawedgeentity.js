import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a DrawEdgeEntity. This model is mainly used for 
* communications. 
* 
* @class DrawEdgeEntity-Model
* @extends BaseEntity-Model
*/
export default BaseEntity.extend({

  /**
  * Indicates the line thickness (a.k.a. width) for a edge.
  *
  * @property lineThickness
  * @type number
  */
  lineThickness: attr('number'),

  /**
  * Z-position of this edge.
  *
  * @property positionZ
  * @type number
  */ 
  positionZ: attr('number'),

  /**
  * All points of the edge.
  *
  * @property points
  * @type objects
  */
  points: attr(),

  pointsFor3D: attr()

  //List<Vector3f> pointsFor3D = new ArrayList<Vector3f>


});
