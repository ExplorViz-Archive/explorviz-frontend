import DS from 'ember-data';
import Application from './application';
import NodeGroup from './nodegroup';
import BaseEntitity from './baseentity';

const { attr, hasMany, belongsTo } = DS;

/**
 * Ember model for a Node.
 *
 * @class Node-Model
 * @extends BaseEntitity
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class Node extends BaseEntitity {
  @attr('string') name!: string;

  @attr('string') ipAddress!: string;

  @attr('number') cpuUtilization!: number;

  @attr('number') freeRAM!: number;

  @attr('number') usedRAM!: number;

  @hasMany('application', { inverse: 'parent' })
  applications!: DS.PromiseManyArray<Application>;

  @belongsTo('nodegroup', { inverse: 'nodes' })
  parent!: DS.PromiseObject<NodeGroup> & NodeGroup;
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'node': Node;
  }
}
