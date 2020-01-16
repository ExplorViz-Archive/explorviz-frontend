import THREE from 'three';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';

export default class CommunicationArrowMesh extends THREE.ArrowHelper {

  dataModel: DrawableClazzCommunication;


  constructor(dataModel: DrawableClazzCommunication, dir: THREE.Vector3,
    origin: THREE.Vector3, length: number, color: number, headLength: number, headWidth: number) {
    super(dir, origin, length, color, headLength, headWidth);
    this.dataModel = dataModel;
  }

  delete() {
    if (this.parent) {
      this.parent.remove(this);
    }
    let line = this.line;
    line.geometry.dispose();

    if (line.material instanceof THREE.Material)
      line.material.dispose();

    let cone = this.cone;
    cone.geometry.dispose();
    if (cone.material instanceof THREE.Material)
      cone.material.dispose();
  }
}