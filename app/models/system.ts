import DS from 'ember-data';
import Landscape from './landscape';
import NodeGroup from './nodegroup';
import BaseEntitity from './baseentity';

const { attr, hasMany, belongsTo } = DS;

/**
 * Ember model for a System.
 *
 * @class System-Model
 * @extends DrawNodeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class System extends BaseEntitity {
  @attr('string') name!: string;

  @hasMany('nodegroup', { inverse: 'parent' })
  nodegroups!: DS.PromiseManyArray<NodeGroup>;

  @belongsTo('landscape', { inverse: 'systems' })
  parent!: DS.PromiseObject<Landscape> & Landscape;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'system': System;
  }
}
