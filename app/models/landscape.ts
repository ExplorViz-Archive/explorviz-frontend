import DS from 'ember-data';
import BaseEntity from './baseentity';

const { belongsTo, hasMany } = DS;

/**
* Ember model for a landscape.
*
* @class Landscape-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class Landscape extends BaseEntity.extend({

  timestamp: belongsTo('timestamp'),
  
  events: hasMany('event', {
    inverse: null
  }),

  systems: hasMany('system', {
    inverse: 'parent'
  }),

  // list of applicationCommunication for rendering purposes
  totalApplicationCommunications: hasMany('applicationcommunication', {
    inverse: null
  })

}) {}
