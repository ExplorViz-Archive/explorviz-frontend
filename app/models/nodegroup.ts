import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object'; 
import DS from 'ember-data';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a NodeGroup.
*
* @class NodeGroup-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class NodeGroup extends DrawNodeEntity.extend({

  name: attr('string'),

  parent: belongsTo('system', {
    inverse: 'nodegroups'
  }),

  nodes: hasMany('node', {
    inverse: 'parent'
  }),

  visible: attr('boolean', {defaultValue: true}),
  opened: attr('boolean', {defaultValue: true}),

  // used for text labeling performance in respective renderers
  state: computed('visible', 'opened', function() {
    let opened = this.get('opened');
    let visible = this.get('visible');
    return `${opened}/${visible}`;
  }),


  setOpened: function(openedParam: boolean) {
    if (openedParam) {
      this.setAllChildrenVisibility(true);
    } else {
      this.setAllChildrenVisibility(false);
      if (this.get('nodes').get('length') > 0) {
        const firstNode = this.get('nodes').objectAt(0);
        if(firstNode !== undefined) {
          firstNode.set('visible', true);
        }
      }
    }

    this.set('opened', openedParam);
  },


  setAllChildrenVisibility: function(visiblity: boolean) {
    this.get('nodes').forEach((node) => {
      node.set('visible', visiblity);
    });
  }

}) {}
