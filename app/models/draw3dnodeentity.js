import DS from 'ember-data';
import BaseEntity from './baseentity';
import Ember from 'ember';
import THREE from "npm:three";

const { attr } = DS;

/**
* Ember model for a Draw3DNodeEntity. This model is inherited by all elements
* that compose an application in the respective visualization.
*
* @class Draw3DNodeEntity-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.util
*/
export default BaseEntity.extend({

  width: attr('number'),
  height: attr('number'),
  depth: attr('number'),
  positionX: attr('number'),
  positionY: attr('number'),
  positionZ: attr('number'),

  highlighted: attr('boolean'),
  opened: attr('boolean'),
  visible: attr('boolean'),

  extension: Ember.computed('width', 'height', 'depth', function() {
    let width = this.get('width') / 2.0;
    let height = this.get('height') / 2.0;
    let depth = this.get('depth') / 2.0;

    return new THREE.Vector3(width, height, depth);
  }),

  highlight() {
    this.set('highlighted', true);
  }

});
