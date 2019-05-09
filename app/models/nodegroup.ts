import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object'; 
import DS from 'ember-data';
import System from './system';

const { attr, hasMany, belongsTo } = DS;

/**
* Ember model for a NodeGroup.
*
* @class NodeGroup-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class NodeGroup extends DrawNodeEntity {

  @attr('string') name!: string;

  @belongsTo('system', { inverse: 'nodegroups' })
  parent!: DS.PromiseObject<System> & System;

  @hasMany('node', { inverse: 'parent' })
  nodes!: DS.PromiseObject<Node> & Node;

  @attr('boolean', {defaultValue: true}) visible!: boolean;

  @attr('boolean', {defaultValue: true}) opened!: boolean;

  // used for text labeling performance in respective renderers
  @computed('visible', 'opened')
  get state() {
    let opened = this.get('opened');
    let visible = this.get('visible');
    return `${opened}/${visible}`;
  }

  setOpened(this: NodeGroup, openedParam: boolean) {
    if (openedParam) {
      this.setAllChildrenVisibility(true);
    } else {
      this.setAllChildrenVisibility(false);
      let nodes = this.hasMany('nodes').value();
      
      if (nodes !== null && nodes.get('length') > 0) {
        const firstNode = nodes.objectAt(0);
        if(firstNode !== undefined) {
          firstNode.set('visible', true);
        }
      }
    }

    this.set('opened', openedParam);
  }

  setAllChildrenVisibility(this: NodeGroup, visiblity: boolean) {
    let nodes = this.hasMany('nodes').value();

    if(nodes !== null) {
      nodes.forEach((node) => {
        node.set('visible', visiblity);
      });
    }
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'nodegroup': NodeGroup;
  }
}
