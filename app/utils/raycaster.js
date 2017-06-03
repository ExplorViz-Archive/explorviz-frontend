import Ember from 'ember';
import THREE from "npm:three";

export default Ember.Object.extend({

  raycaster: new THREE.Raycaster(),

  landscapeObjects: ['node', 'system', 'nodegroup', 'application', 'communication'],
  applicationObjects: ['component', 'clazz', 'communication'],
  objectCatalog: 'landscapeObjects',

  raycasting(origin, direction, camera, possibleObjects) {

    const self = this;
    const raycaster = this.get('raycaster');

    if (camera) {
      // direction = mouse
      raycaster.setFromCamera(direction, camera);
    } else if (origin) {
      // vr-raycasting, e.g. ray origin is Vive controller
      raycaster.set(origin, direction);
    }

    // calculate objects intersecting the picking ray (true => recursive)
    const intersections = raycaster.intersectObjects(possibleObjects,
      true);

    if (intersections.length > 0) {

      const result = intersections.filter(function(obj) {
        if (obj.object.userData.model) {
          const modelName = obj.object.userData.model.constructor.modelName;

          return self.get(self.get('objectCatalog')).includes(modelName);
        }
      });
      if (result.length <= 0) {
        return;
      }

      return result[0];

    }
  }
  
});
