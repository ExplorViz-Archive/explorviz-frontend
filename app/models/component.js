import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo, hasMany } = DS;

/**
* Ember model for a Component, e.g. a Java package.
* 
* @class Component
* @extends Draw3DNodeEntity
*/
export default Draw3DNodeEntity.extend({

  synthetic: attr('boolean'),
  foundation: attr('boolean'),

  children: hasMany('component', {
    inverse: 'parentComponent'
  }),

  clazzes: hasMany('clazz'),

  parentComponent: belongsTo('component', {
    inverse: 'children'
  }),

  belongingApplication: belongsTo('application', {
    inverse: 'components'
  }),

  opened: attr('boolean'),

  setOpenedStatus: function(status) {

    this.get('children').forEach((child) => {
      child.set('highlighted', false);
      child.setOpenedStatus(false);
    });

    this.set('opened', status);
  }

});