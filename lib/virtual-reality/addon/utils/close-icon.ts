import THREE from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class CloseIcon extends BaseMesh {
  constructor(texture: THREE.Texture, radius = 0.06, segments = 32) {
    super(new THREE.Color());

    this.geometry = new THREE.SphereGeometry(radius, segments, segments);

    this.material = new THREE.MeshPhongMaterial({
      map: texture,
    });
  }
}
