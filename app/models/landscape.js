import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, hasMany } = DS;


/**
* Ember model for a landscape.
*
* @class Landscape-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default BaseEntity.extend({

  timestamp: attr('number'),
  overallCalls: attr('number', { defaultValue: 0 }),
  events: attr(),
  exceptions: attr(),

  systems: hasMany('system', {
    inverse: 'parent'
  }),

  // generated list of applicationCommunication for rendering purposes
  applicationCommunication: attr(),

});
