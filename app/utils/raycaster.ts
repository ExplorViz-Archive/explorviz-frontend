import THREE from 'three';

export default class Raycaster extends THREE.Raycaster {
  /**
   * Calculate objects which intersect the ray - given by coordinates and camera
   *
   * @param coords x- and y-coordinates of the pointer, e.g. a mouse
   * @param camera Camera - contains view information
   * @param possibleObjects Objects to check for raycasting
   */
  raycasting(coords: {x: number, y: number}, camera: THREE.Camera,
    possibleObjects: THREE.Object3D[], raycastFilter: any): THREE.Intersection | null {
    this.setFromCamera(coords, camera);

    // Calculate objects intersecting the picking ray
    let intersections = this.intersectObjects(possibleObjects, true);

    if (raycastFilter) {
      intersections = intersections.filter(raycastFilter);
    }

    // Returns the nearest hit object if one exists
    if (intersections.length > 0) {
      return intersections[0];
    }

    // Return null to indicate that no object was found
    return null;
  }
}
