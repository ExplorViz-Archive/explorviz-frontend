import DS from 'ember-data';
import BaseEntity from './baseentity';

const { attr } = DS;

export default BaseEntity.extend({

  lineThickness: attr('number'),
  positionZ: attr('number'),
  points: attr()

  //List<Vector3f> pointsFor3D = new ArrayList<Vector3f>


});
