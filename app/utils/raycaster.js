import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  raycaster: null,

  landscapeObjects: null,
  applicationObjects: null,
  objectCatalog: null,

  init() {
    this._super(...arguments);

    this.set('landscapeObjects', ['system', 'nodegroup', 'node', 'application', 'applicationcommunication']);
    this.set('applicationObjects', ['component', 'clazz', 'cumulatedclazzcommunication']);
    this.set('objectCatalog', 'landscapeObjects');
    this.set('raycaster', new THREE.Raycaster());
  },


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
