import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

/**
* Ember model for a Timestamp.
*
* @class Timestamp-Model
* @extends @extends BaseEntity-Model
*
* @module explorviz
* @submodule model
*/
export default BaseEntity.extend({

  timestamp: attr('number'),
  calls: attr('number')

});
