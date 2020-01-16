import Component from "explorviz-frontend/models/component";
import Clazz from "explorviz-frontend/models/clazz";
import THREE from "three";

export default class BoxLayout {

  model: Component | Clazz;
  height: number = 1;
  width: number = 1;
  depth: number = 1;
  positionX: number = 0;
  positionY: number = 0;
  positionZ: number = 0;

  constructor(model: Component | Clazz) {
    this.model = model;
  }

  get position() {
    return new THREE.Vector3(this.positionX, this.positionY, this.positionZ);
  }

  set position(position: THREE.Vector3) {
    this.positionX = position.x;
    this.positionY = position.y;
    this.positionZ = position.z;
  }

}