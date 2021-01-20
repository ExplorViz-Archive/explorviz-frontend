import THREE, { Object3D } from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class CloseIcon extends BaseMesh {
  radius: number;

  constructor(texture: THREE.Texture, radius = 0.075, segments = 32) {
    super(new THREE.Color());

    this.radius = radius;

    this.geometry = new THREE.SphereGeometry(radius, segments, segments);

    this.material = new THREE.MeshPhongMaterial({
      map: texture,
    });
  }

  /**
   * Calculates the position at the top right corner of the given application object
   * and adds the close icon to the application at that position.
   *
   * @param Object3D Object to which the icon shall be added
   */
  addToObject(object: Object3D) {
    // Undo scaling of the object.
    this.scale.set(1.0 / object.scale.x, 1.0 / object.scale.y, 1.0 / object.scale.z);

    const bboxApp3D = new THREE.Box3().setFromObject(object);
    this.position.x = (bboxApp3D.max.x + this.radius) * this.scale.x;
    this.position.z = (bboxApp3D.max.z + this.radius) * this.scale.z;

    // Rotate such that the cross faces forwards.
    this.geometry.rotateX(90 * THREE.MathUtils.DEG2RAD);
    this.geometry.rotateY(90 * THREE.MathUtils.DEG2RAD);
    object.add(this);
  }
}
