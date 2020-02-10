import { computed } from '@ember/object';
import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';
import System from './system';
import Node from './node';

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
  nodes!: DS.PromiseManyArray<Node>;

  @attr('boolean', { defaultValue: true }) visible!: boolean;

  @attr('boolean', { defaultValue: true }) opened!: boolean;

  // used for text labeling performance in respective renderers
  @computed('visible', 'opened')
  get state() {
    const opened = this.get('opened');
    const visible = this.get('visible');
    return `${opened}/${visible}`;
  }

  setOpened(this: NodeGroup, openedParam: boolean) {
    if (openedParam) {
      this.setAllChildrenVisibility(true);
    } else {
      this.setAllChildrenVisibility(false);
      const nodes = this.hasMany('nodes').value();

      if (nodes !== null && nodes.get('length') > 0) {
        const firstNode = nodes.objectAt(0);
        if (firstNode !== undefined) {
          firstNode.set('visible', true);
        }
      }
    }

    this.set('opened', openedParam);
  }

  setAllChildrenVisibility(this: NodeGroup, visiblity: boolean) {
    const nodes = this.hasMany('nodes').value();

    if (nodes !== null) {
      nodes.forEach((node) => {
        node.set('visible', visiblity);
      });
    }
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'nodegroup': NodeGroup;
  }
}