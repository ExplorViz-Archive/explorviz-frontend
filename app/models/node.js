import DS from 'ember-data';
import Ember from 'ember';
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

  applications: hasMany('application', {
    inverse: 'parent'
  }),

  parent: belongsTo('nodegroup', {
    inverse: 'nodes'
  }),

  ipAddress: attr('string'),

  // used for text labeling performance in respective renderers
  state: Ember.computed('visible', function() {
    let visible = this.get('visible');
    return `${visible}`;
  }),

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
