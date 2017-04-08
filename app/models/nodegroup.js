import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a NodeGroup.
* 
* @class NodeGroup
* @extends DrawNodeEntity
*/
export default DrawNodeEntity.extend({
  visible: attr('boolean'),
  parent: belongsTo('system'),
  nodes: hasMany('node'),
  plusColor: attr(),
  backgroundColor: attr(),
  opened: attr('boolean'),


  setOpened: function(openedParam) {
    if (openedParam) {
      this.setAllChildrenVisibility(true);
    } else {
      this.setAllChildrenVisibility(false);
      if (this.get('nodes').get('length') > 0) {
        const firstNode = this.get('nodes').objectAt(0);       
        firstNode.set('visible', true); 
      }
    }

    this.set('opened', openedParam);
  },


  setAllChildrenVisibility: function(visiblity) {
    this.get('nodes').forEach((node) => {
          node.set('visible', visiblity); 
    });
  }


});
