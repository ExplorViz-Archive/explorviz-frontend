import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object'; 
import DS from 'ember-data';
import Application from './application';
import NodeGroup from './nodegroup';

const { attr, hasMany, belongsTo } = DS;

/**
* Ember model for a Node.
*
* @class Node-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class Node extends DrawNodeEntity {

  // @ts-ignore
  @attr('string') name!: string;

  // @ts-ignore
  @attr('string') ipAddress!: string;

  // @ts-ignore
  @attr('number') cpuUtilization!: number;

  // @ts-ignore
  @attr('number') freeRAM!: number;

  // @ts-ignore
  @attr('number') usedRAM!: number;

  // @ts-ignore
  @attr('boolean', {defaultValue: true}) visible!: boolean;

  // @ts-ignore
  @hasMany('application', { inverse: 'parent' })
  applications!: DS.PromiseManyArray<Application>;

  // @ts-ignore
  @belongsTo('nodegroup', { inverse: 'nodes' })
  parent!: DS.PromiseObject<NodeGroup> & NodeGroup;

  // used for text labeling performance in respective labelers
  @computed('visible')
  get state() {
    let visible = this.get('visible');
    return `${visible}`;
  }

  getDisplayName() {
    if (this.get('parent').get('opened')) {
      if (this.get('name') && this.get('name').length > 0 && !this.get('name').startsWith("<")) {
        return this.get('name');
      } else {
        return this.get('ipAddress');
      }
    } else {
      return this.get('parent').get('name');
    }
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'node': Node;
  }
}
