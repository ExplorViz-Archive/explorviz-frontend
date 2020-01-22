import THREE from "three";

export default class PlaneLayout {

  height: number = 1;
  width: number = 1;
  positionX: number = 0;
  positionY: number = 0;

  get position() {
    return new THREE.Vector2(this.positionX, this.positionY);
  }

  set position(position: THREE.Vector2) {
    this.positionX = position.x;
    this.positionY = position.y;
  }

}