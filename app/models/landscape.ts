import DS from 'ember-data';
import BaseEntity from './baseentity';
import Timestamp from './timestamp';
import Event from './event';
import ApplicationCommunication from './applicationcommunication';

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
export default class Landscape extends BaseEntity {

  @belongsTo('timestamp')
  timestamp!: DS.PromiseObject<Timestamp> & Timestamp;

  @hasMany('event', { inverse: null })
  events!: DS.PromiseManyArray<Event>;

  @hasMany('system', { inverse: 'parent' })
  systems!: DS.PromiseManyArray<Event>;

  // list of applicationCommunication for rendering purposes
  @hasMany('applicationcommunication', { inverse: null })
  totalApplicationCommunications!: DS.PromiseManyArray<ApplicationCommunication>;

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'landscape': Landscape;
	}
}
