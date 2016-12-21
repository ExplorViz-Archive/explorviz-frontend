import DS from 'ember-data';
import DrawNodeEntity from './drawnodeentity';

const { attr, hasMany, belongsTo } = DS;

export default DrawNodeEntity.extend({

  cpuUtilization: attr('number'),
  freeRAM: attr('number'),
  usedRAM: attr('number'),

  visible: attr('boolean'),

  applications: hasMany('application'),

  parent: belongsTo('nodegroup'),

  ipAddress: attr('string'),

  color: attr()

});
