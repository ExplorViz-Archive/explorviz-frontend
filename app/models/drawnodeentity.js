import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a DrawNodeEntity.
*
* @class DrawNodeEntity-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.util
*/
export default BaseEntity.extend({

  visible: attr('boolean'),
  opened: attr('boolean'),

  plusColor: attr(),
  backgroundColor: attr(),
  highlighted: attr('boolean'),

  width: attr('number'),
  height: attr('number'),
  depth: attr('number'),
  positionX: attr('number'),
  positionY: attr('number'),
  positionZ: attr('number'),
  threeJSModel: attr(),

  kielerGraphReference: null,

  sourcePorts: {},
  targetPorts: {}

});
