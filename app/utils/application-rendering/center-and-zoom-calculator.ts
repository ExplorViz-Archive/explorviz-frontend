import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  centerPoint : null,

  calculateAppCenterAndZZoom(emberApplication : any) {
    const MIN_X = 0;
    const MAX_X = 1;
    const MIN_Y = 2;
    const MAX_Y = 3;
    const MIN_Z = 4;
    const MAX_Z = 5;

    const foundation = emberApplication.get('components').objectAt(0);

    const rect : number[] = [];
    rect.push(foundation.get('positionX'));
    rect.push(foundation.get('positionY') + foundation.get('width'));
    rect.push(foundation.get('positionY'));
    rect.push(foundation.get('positionY') + foundation.get('height'));
    rect.push(foundation.get('positionZ'));
    rect.push(foundation.get('positionZ') + foundation.get('depth'));

    const viewCenterPoint = new THREE.Vector3(rect.get(MIN_X) + 
      ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
      rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0),
      rect.get(MIN_Z) + ((rect.get(MAX_Z) - rect.get(MIN_Z)) / 2.0));

    this.set('centerPoint', viewCenterPoint);
  }

});
