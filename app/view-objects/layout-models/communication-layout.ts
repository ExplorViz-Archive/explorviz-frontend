import THREE from 'three';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';

export default class CommunicationLayout {
  model: DrawableClassCommunication;

  startX: number = 0;

  startY: number = 0;

  startZ: number = 0;

  endX: number = 0;

  endY: number = 0;

  endZ: number = 0;

  lineThickness: number = 1;

  pointsFor3D: THREE.Vector3[] = [];

  constructor(model: DrawableClassCommunication) {
    this.model = model;
  }

  get startPoint() {
    return new THREE.Vector3(this.startX, this.startY, this.startZ);
  }

  set startPoint(start: THREE.Vector3) {
    this.startX = start.x;
    this.startY = start.y;
    this.startZ = start.z;
  }

  get endPoint() {
    return new THREE.Vector3(this.endX, this.endY, this.endZ);
  }

  set endPoint(end: THREE.Vector3) {
    this.endX = end.x;
    this.endY = end.y;
    this.endZ = end.z;
  }
}
