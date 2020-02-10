import DS from 'ember-data';
import ApplicationCommunication from './applicationcommunication';
import BaseEntity from './baseentity';
import Event from './event';
import System from './system';
import Timestamp from './timestamp';

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
  systems!: DS.PromiseManyArray<System>;

  // list of applicationCommunication for rendering purposes
  @hasMany('applicationcommunication', { inverse: null })
  totalApplicationCommunications!: DS.PromiseManyArray<ApplicationCommunication>;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'landscape': Landscape;
  }
}
