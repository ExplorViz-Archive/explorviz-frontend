import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, hasMany, belongsTo } = DS;

/**
* Ember model for a Node.
* 
* @class Node
* @extends DrawNodeEntity
*/
export default DrawNodeEntity.extend({

  cpuUtilization: attr('number'),
  freeRAM: attr('number'),
  usedRAM: attr('number'),

  visible: attr('boolean'),

  applications: hasMany('application'),

  parent: belongsTo('nodegroup'),

  ipAddress: attr('string'),

  color: attr(),

  getDisplayName: function() {
    if (this.get('parent').get('opened')) {
      if (this.get('name') && this.get('name').length > 0 && !this.get('name').startsWith("<")) {
        return this.get('name');
      } else {
        return this.get('ipAddress');
      }
    } else {
      return this.get('parent').get('name');
    }
  }

});
