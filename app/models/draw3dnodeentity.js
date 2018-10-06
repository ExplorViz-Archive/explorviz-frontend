import BaseEntity from './baseentity';
import THREE from "three";
import { computed } from '@ember/object';
import DS from 'ember-data';

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

  width: attr('number', { defaultValue: 0}),
  height: attr('number', { defaultValue: 0}),
  depth: attr('number', { defaultValue: 0}),
  positionX: attr('number', { defaultValue: 0}),
  positionY: attr('number', { defaultValue: 0}),
  positionZ: attr('number', { defaultValue: 0}),

  highlighted: attr('boolean', { defaultValue: false}),
  opened: attr('boolean', { defaultValue: false}),
  visible: attr('boolean', { defaultValue: true}),

  extension: computed('width', 'height', 'depth', function() {
    let width = this.get('width') / 2.0;
    let height = this.get('height') / 2.0;
    let depth = this.get('depth') / 2.0;

    return new THREE.Vector3(width, height, depth);
  }),

  // used to mark entities as transparent or normal for highlighting
  state: attr('string', { defaultValue: 'NORMAL'}),

  highlight() {
    this.set('highlighted', true);
  }

});
