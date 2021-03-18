import THREE, { Object3D } from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import VRController from 'virtual-reality/utils/vr-controller';

export default class CloseIcon extends BaseMesh {
  private radius: number;

  private onClose: () => void;

  constructor({onClose, texture, radius = 0.075, segments = 32}: {
    onClose: () => void, 
    texture: THREE.Texture, 
    radius?: number, 
    segments?: number,
    compensateParentScale?: boolean
  }) {
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
  addToObject(object: Object3D, {compensateScale = true}: {
    compensateScale?: boolean
  } = {}) {
    // Undo scaling of the object.
    if (compensateScale) this.scale.set(1.0 / object.scale.x, 1.0 / object.scale.y, 1.0 / object.scale.z);

    // Reset rotation and scale of the object temporarily such that the axis 
    // are aligned the world axis.
    const originalRotation = object.rotation.clone();
    const originalScale = object.scale.clone();
    object.rotation.set(0, 0, 0);
    if (!compensateScale) object.scale.set(1, 1, 1);
    object.updateMatrixWorld();

    // Get size of the object.
    const boundingBox = new THREE.Box3().setFromObject(object);
    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;
    const depth = boundingBox.max.z - boundingBox.min.z;

    // Restore rotation.
    object.rotation.copy(originalRotation);
    object.scale.copy(originalScale);

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
    // An object cannot be closed when it is grabbed by the local user.
    // The `onClose` callback still has to ask the backend whether the
    // object can be clsoed.
    const controller = VRController.findController(this);
    if (!controller) {
      this.onClose();
      return true;
    }
    return false;
  }
}
