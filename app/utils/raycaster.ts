import THREE from 'three';

export default class Raycaster extends THREE.Raycaster {

  /**
   * Calculate objects intersecting the ray - given by coordinates and camera
   * 
   * @param coords x- and y-coordinates of the pointer, e.g. a mouse
   * @param camera Camera - contains view information
   * @param possibleObjects Objects to check for raycasting
   */
  raycasting(coords: {x: number, y: number}, camera: THREE.Camera, possibleObjects: THREE.Object3D[]): THREE.Intersection | null {
    this.setFromCamera(coords, camera);

    // Calculate objects intersecting the picking ray (true => recursive)
    const intersections = this.intersectObjects(possibleObjects);

    if (intersections.length > 0) {
      return intersections[0];
    }
    return null;
  }

}
