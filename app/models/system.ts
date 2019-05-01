import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object'; 
import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a System.
*
* @class System-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class System extends DrawNodeEntity.extend({

  name: attr('string'),

  nodegroups: hasMany('nodegroup', {
    inverse: 'parent'
  }),

  parent: belongsTo('landscape', {
    inverse: 'systems'
  }),

  opened: attr('boolean', {defaultValue: true}),

  // used for text labeling performance in respective labelers
  state: computed('opened', function() {
    return this.get('opened');
  }),

  setOpened: function(openedParam: boolean) {
    if (openedParam) {
      this.get('nodegroups').forEach((nodegroup) => {
        nodegroup.set('visible', true);
        if (nodegroup.get('nodes').get('length') === 1) {
          nodegroup.setOpened(true);
        } else {
          nodegroup.setOpened(false);
        }
      });
    }
    else {
      this.get('nodegroups').forEach((nodegroup) => {
        nodegroup.set('visible', false);
        nodegroup.setAllChildrenVisibility(false);
      });
    }

    this.set('opened', openedParam);
  }

}) {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'system': System;
  }
}
