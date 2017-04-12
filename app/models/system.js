import DS from 'ember-data';
import Ember from 'ember';
import DrawNodeEntity from './drawnodeentity';

const { attr, hasMany, belongsTo } = DS;

/**
* Ember model for a System.
* 
* @class System
* @extends DrawNodeEntity
*/
export default DrawNodeEntity.extend({
  opened: attr('boolean'),  
  nodegroups: hasMany('nodegroup'),
  parent: belongsTo('landscape'),
  plusColor : attr(),
  foregroundColor : attr(),
  backgroundColor : attr(),

  // used for text labeling performance in respective renderers
  state: Ember.computed('opened', function() {
    let opened = this.get('opened');   
    return `${opened}`;
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
