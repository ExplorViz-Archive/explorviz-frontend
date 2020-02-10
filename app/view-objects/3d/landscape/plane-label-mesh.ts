import THREE from 'three';
import LabelMesh from '../label-mesh';

export default class PlaneLabelMesh extends LabelMesh {
  constructor(font: THREE.Font, labelText: string, fontSize = 0.4,
    textColor = new THREE.Color(0x000000)) {
    super(font, labelText, textColor);
    this.computeLabel(labelText, fontSize);
  }

  computeLabel(text: string, fontSize: number) {
    const labelGeo = new THREE.TextBufferGeometry(text, {
      font: this.font,
      size: fontSize,
      height: 0,
    });

    this.geometry = labelGeo;

    const material = new THREE.MeshBasicMaterial({
      color: this.defaultColor,
    });

    this.material = material;
  }
}
