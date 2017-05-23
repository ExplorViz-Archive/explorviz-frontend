import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a Draw3DNodeEntity. This model is inherited by all elements 
* that compose an application in the respective visualization.
* 
* @class Draw3DNodeEntity
* @extends BaseEntity
*/
export default BaseEntity.extend({

  name: attr('string'),
  fullQualifiedName: attr('string'),

  width: attr('number'),
  height: attr('number'),
  depth: attr('number'),
  positionX: attr('number'),
  positionY: attr('number'),
  positionZ: attr('number'),

  extension: attr(),
  
  highlighted: attr('boolean')

});
