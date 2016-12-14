import DS from 'ember-data';
import Draw3DNode from './draw3dnode';

const { attr } = DS;

export default Draw3DNode.extend({

  cpuUtilization: attr('number')

});
