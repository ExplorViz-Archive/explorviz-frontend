import DS from 'ember-data';
import Draw3DNodeEntity from './draw3dnodeentity';

const { attr, belongsTo, hasMany } = DS;

export default Draw3DNodeEntity.extend({

  synthetic: attr('boolean'),
  foundation: attr('boolean'),

  children: hasMany('component', {
    inverse: 'parentComponent'
  }),

  clazzes: hasMany('clazz'),

  parentComponent: belongsTo('component'),

  belongingApplication: belongsTo('application'),

  opened: attr('boolean')

  //color: attr('vector4f')

});