import DS from 'ember-data';

const {Model, attr} = DS;

/**
* Ember model for a Timestamp.
*
* @class Timestamp-Model
* @extends DS.Model
*
* @module explorviz
* @submodule model
*/
export default Model.extend({

  timestamp: attr('number'),
  overallCalls: attr('number')
});
