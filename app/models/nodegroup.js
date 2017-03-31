import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, belongsTo, hasMany } = DS;

export default DrawNodeEntity.extend({
  visible: attr('boolean'),
  parent: belongsTo('system'),
  nodes: hasMany('node'),
  plusColor: attr(),
  backgroundColor: attr(),
  opened: attr('boolean'),

  setOpenedStatus: function(openedStatus) {

    const nodes = this.get('nodes');

    nodes.forEach((node) => {

      if (openedStatus) {
        node.set('visible', true);
      } else {
        node.set('visible', false);
      }    

    });

    if (!openedStatus && nodes.get('length') > 0) {
      nodes.objectAt(0).set('visible', true);
    }

    this.set('opened', openedStatus);
    
  }



});
