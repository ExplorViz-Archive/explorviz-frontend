import DrawNodeEntity from './drawnodeentity';
import { computed } from '@ember/object'; 
import attr from 'ember-data/attr';
import belongsTo from 'ember-data/belongsTo';
import { hasMany } from 'ember-data/relationships';

/**
* Ember model for a Node.
*
* @class Node-Model
* @extends DrawNodeEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default DrawNodeEntity.extend({

  name: attr('string'),
  ipAddress: attr('string'),
  cpuUtilization: attr('number'),
  freeRAM: attr('number'),
  usedRAM: attr('number'),

  visible: attr('boolean', {defaultValue: true}),

  applications: hasMany('application', {
    inverse: 'parent'
  }),

  parent: belongsTo('nodegroup', {
    inverse: 'nodes'
  }),

  // used for text labeling performance in respective labelers
  state: computed('visible', function() {
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
