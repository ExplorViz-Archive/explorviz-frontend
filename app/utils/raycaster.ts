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
    this.set('applicationObjects', ['component', 'clazz', 'drawableclazzcommunication']);
    this.set('objectCatalog', 'landscapeObjects');
    this.set('raycaster', new THREE.Raycaster());
  },


  raycasting(origin: THREE.Vector3, direction: THREE.Vector3, camera: THREE.Camera, possibleObjects: THREE.Object3D[]): THREE.Object3D | null {
    const raycaster: any = this.get('raycaster');
    if (!raycaster) {
      return null;
    }

    if (camera) {
      // Direction = mouse
      raycaster.setFromCamera(direction, camera);
    } else if (origin) {
      // Vr-raycasting, e.g. ray origin is Vive controller
      raycaster.set(origin, direction);
    }

    // Calculate objects intersecting the picking ray (true => recursive)
    const intersections = raycaster.intersectObjects(possibleObjects,
      true);

    if (intersections.length > 0) {
      const result = intersections.filter((obj: any) => {
        if (obj.object.userData.model) {
          const modelName = obj.object.userData.model.constructor.modelName;
          let objectCatalog: any = this.get('objectCatalog');
          if (objectCatalog) {
            return this.get(objectCatalog).includes(modelName);
          }
        }
      });

      if (result.length <= 0) {
        return null;
      } else {
        return result[0];
      }
    }
    return null;
  }

});
