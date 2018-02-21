import DS from 'ember-data';
import Ember from 'ember';
import DrawNodeEntity from './drawnodeentity';

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
export default DrawNodeEntity.extend({

  name: attr('string'),

  nodegroups: hasMany('nodegroup', {
    inverse: 'parent'
  }),

  parent: belongsTo('landscape', {
    inverse: 'systems'
  }),

  // used for text labeling performance in respective labelers
  state: Ember.computed('opened', function() {
    return this.get('opened');
  }),

  setOpened: function(openedParam) {
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
});
