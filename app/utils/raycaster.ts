import THREE from "three";

export default class Raycaster extends THREE.Raycaster {

  raycasting(coords: {x: number, y: number}, camera: THREE.Camera, possibleObjects: THREE.Object3D[]): THREE.Intersection | null {
    // coords = mouse
    this.setFromCamera(coords, camera);

    // Calculate objects intersecting the picking ray (true => recursive)
    const intersections = this.intersectObjects(possibleObjects);

    if (intersections.length > 0) {
      return intersections[0];
    }
    return null;
  }

}
