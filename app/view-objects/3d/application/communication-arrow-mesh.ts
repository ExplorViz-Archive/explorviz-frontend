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
    const { line } = this;
    line.geometry.dispose();

    if (line.material instanceof THREE.Material) { line.material.dispose(); }

    const { cone } = this;
    cone.geometry.dispose();
    if (cone.material instanceof THREE.Material) { cone.material.dispose(); }
  }

  changeOpacity(opacity: number) {
    const isTransparent = opacity < 1;
    if (this.line.material instanceof THREE.Material) {
      this.line.material.opacity = opacity;
      this.line.material.transparent = isTransparent;
    }
    if (this.cone.material instanceof THREE.Material) {
      this.cone.material.opacity = opacity;
      this.cone.material.transparent = isTransparent;
    }
  }

  turnTransparent(opacity: number) {
    this.changeOpacity(opacity);
  }

  turnOpaque() {
    this.changeOpacity(1);
  }
}
