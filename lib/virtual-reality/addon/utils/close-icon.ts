import THREE from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class CloseIcon extends BaseMesh {
  radius: number;

  constructor(texture: THREE.Texture, radius = 6, segments = 32) {
    super(new THREE.Color());

    this.radius = radius;

    this.geometry = new THREE.SphereGeometry(radius, segments, segments);

    this.material = new THREE.MeshPhongMaterial({
      map: texture,
    });
  }
}
