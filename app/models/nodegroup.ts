import DS from 'ember-data';
import System from './system';
import Node from './node';
import BaseEntitity from './baseentity';

const { attr, hasMany, belongsTo } = DS;

/**
 * Ember model for a NodeGroup.
 *
 * @class NodeGroup-Model
 * @extends BaseEntitity
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class NodeGroup extends BaseEntitity {
  @attr('string') name!: string;

  @belongsTo('system', { inverse: 'nodegroups' })
  parent!: DS.PromiseObject<System> & System;

  @hasMany('node', { inverse: 'parent' })
  nodes!: DS.PromiseManyArray<Node>;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'nodegroup': NodeGroup;
  }
}
