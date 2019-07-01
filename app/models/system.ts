import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object';
import DS from 'ember-data';
import NodeGroup from './nodegroup';
import Landscape from './landscape';

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
export default class System extends DrawNodeEntity {

  @attr('string') name!: string;

  @hasMany('nodegroup', { inverse: 'parent' })
  nodegroups!: DS.PromiseManyArray<NodeGroup>;

  @belongsTo('landscape', { inverse: 'systems' })
  parent!: DS.PromiseObject<Landscape> & Landscape;

  @attr('boolean', {defaultValue: true}) opened!: boolean;

  // used for text labeling performance in respective labelers
  @computed('opened')
  get state() {
    return this.get('opened');
  }

  setOpened(this: System, openedParam: boolean) {
    if (openedParam) {
      let nodegroups = this.hasMany('nodegroups').value();
      
      if(nodegroups !== null) {
        nodegroups.forEach((nodegroup) => {
          nodegroup.set('visible', true);
          if (nodegroups !== null && nodegroups.get('length') === 1) {
            nodegroup.setOpened(true);
          } else {
            nodegroup.setOpened(false);
          }
        });
      }
    }
    else {
      this.get('nodegroups').forEach((nodegroup) => {
        nodegroup.set('visible', false);
        nodegroup.setAllChildrenVisibility(false);
      });
    }

    this.set('opened', openedParam);
  }

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'system': System;
  }
}
