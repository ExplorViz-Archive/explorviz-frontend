import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, hasMany, belongsTo } = DS;

export default DrawNodeEntity.extend({
  opened: attr('boolean'),  
  nodegroups: hasMany('nodegroup'),
  parent: belongsTo('landscape'),
  plusColor : attr(),
  foregroundColor : attr(),
  backgroundColor : attr(),

  setOpenedStatus: function(status) {

    this.get('nodegroups').forEach((nodegroup) => {
        nodegroup.set('visible', !nodegroup.get('visible'));      
    });

    this.set('opened', status);
  }
});
