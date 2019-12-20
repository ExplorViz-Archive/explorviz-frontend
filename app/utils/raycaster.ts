import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  raycaster: null,

  landscapeObjects: null,
  applicationObjects: null,

  init() {
    this._super(...arguments);
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
      return intersections[0];
    }
    return null;
  }

});
