import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a clazz.
*
* @class Clazz-Model
* @extends Draw3DNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default BaseEntity.extend({

  eventMessage: attr('string'),
  timestamp: attr('number'),

});
