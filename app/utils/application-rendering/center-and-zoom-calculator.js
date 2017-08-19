import Ember from 'ember';

export default Ember.Object.extend({

  centerPoint : null,

  calculateAppCenterAndZZoom(emberApplication) {

    const MIN_X = 0;
    const MAX_X = 1;
    const MIN_Y = 2;
    const MAX_Y = 3;
    const MIN_Z = 4;
    const MAX_Z = 5;

    const foundation = emberApplication.get('components').objectAt(0);

    const rect = [];
    rect.push(foundation.get('positionX'));
    rect.push(foundation.get('positionY') + foundation.get('width'));
    rect.push(foundation.get('positionY'));
    rect.push(foundation.get('positionY') + foundation.get('height'));
    rect.push(foundation.get('positionZ'));
    rect.push(foundation.get('positionZ') + foundation.get('depth'));

    //const SPACE_IN_PERCENT = 0.02;

    const viewCenterPoint = new THREE.Vector3(rect.get(MIN_X) + 
      ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
      rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0),
      rect.get(MIN_Z) + ((rect.get(MAX_Z) - rect.get(MIN_Z)) / 2.0));

    /*let requiredWidth = Math.abs(rect.get(MAX_X) - rect.get(MIN_X));
    requiredWidth += requiredWidth * SPACE_IN_PERCENT;

    let requiredHeight = Math.abs(rect.get(MAX_Y) - rect.get(MIN_Y));
    requiredHeight += requiredHeight * SPACE_IN_PERCENT;

    const viewPortSize = self.get('webglrenderer').getSize();

    let viewportRatio = viewPortSize.width / viewPortSize.height;

    const newZ_by_width = requiredWidth / viewportRatio;
    const newZ_by_height = requiredHeight;

    const center = new THREE.Vector3(rect.get(MIN_X) + ((rect.get(MAX_X) 
    - rect.get(MIN_X)) / 2.0),
      rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0), 0);

    const camera = self.get('camera');

    camera.position.z = Math.max(Math.max(newZ_by_width, newZ_by_height), 
    10.0);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.updateProjectionMatrix();*/

    this.set('centerPoint', viewCenterPoint);

  }

});
