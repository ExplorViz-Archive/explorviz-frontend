import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr, belongsTo, hasMany } = DS;

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

  timestamp: belongsTo('timestamp'),
  events: attr(),
  exceptions: attr(),

  systems: hasMany('system', {
    inverse: 'parent'
  }),

  // list of applicationCommunication for rendering purposes
  outgoingApplicationCommunications: hasMany('applicationcommunication', {
    inverse: null
  }),

});
