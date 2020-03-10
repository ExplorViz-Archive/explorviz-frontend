import THREE from 'three';
import BaseMesh from './base-mesh';

export default class LogoMesh extends BaseMesh {
  texture: THREE.Texture;

  width: number;

  height: number;

  type: string;

  constructor(texture: THREE.Texture, width: number, height: number, type: string, defaultColor = new THREE.Color('white')) {
    super(defaultColor);

    this.texture = texture;
    this.width = width;
    this.height = height;
    this.type = type;

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    this.geometry = new THREE.PlaneGeometry(width, height);
  }
}
