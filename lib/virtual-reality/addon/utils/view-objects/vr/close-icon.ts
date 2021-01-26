import THREE, { Object3D } from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class CloseIcon extends BaseMesh {
  radius: number;

  onClose: () => void;

  constructor(onClose: () => void, texture: THREE.Texture, radius = 0.075, segments = 32) {
    super(new THREE.Color());

    this.onClose = onClose;

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

    // Reset rotation of the object temporarily such that the axis are aligned
    // the world axis.
    const originalRotation = object.rotation.clone();
    object.rotation.set(0, 0, 0);
    object.updateMatrixWorld();

    // Get size of the object.
    const boundingBox = new THREE.Box3().setFromObject(object);
    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;
    const depth = boundingBox.max.z - boundingBox.min.z;

    // Restore rotation.
    object.rotation.copy(originalRotation);

    // Position the close button in the top-right corner.
    this.position.x = (width / 2 + this.radius) * this.scale.x;
    if (height > depth) {
      this.position.y = (height / 2 + this.radius) * this.scale.y;
    } else {
      this.position.z = (depth / 2 + this.radius) * this.scale.z;

      // Rotate such that the cross faces forwards.
      this.geometry.rotateX(90 * THREE.MathUtils.DEG2RAD);
      this.geometry.rotateY(90 * THREE.MathUtils.DEG2RAD);
    }
    
    object.add(this);
  }

  close() {
    this.onClose();
  }
}
