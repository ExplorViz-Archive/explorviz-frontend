import THREE from "three";
import LabelMesh from "../label-mesh";

export default class ClazzLabelMesh extends LabelMesh {

  constructor(font: THREE.Font, labelText: string, textColor = new THREE.Color(0x000000)) {
    super(font, labelText, textColor);
    this.computeLabel(labelText);
  }

  computeLabel(labelText: string){
    // Adjust desired text size with possible scaling
    const TEXT_SIZE = 0.5;
    // Text should look like it is written on the parent's box (no height required)
    const TEXT_HEIGHT = 0.0;

    // Prevent overlapping clazz labels by truncating
    if (labelText.length > 10) {
      labelText = labelText.substring(0, 8) + '...';
    }

    this.geometry = new THREE.TextGeometry(labelText, {
      font: this.font,
      size: TEXT_SIZE,
      height: TEXT_HEIGHT,
      curveSegments: 1,
    });

    this.material = new THREE.MeshBasicMaterial({ color: this.defaultColor })
  }
}