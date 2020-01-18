import BaseMesh from "./base-mesh";
import THREE from "three";

export default class LabelMesh extends BaseMesh {

  labelText: string;
  font: THREE.Font;

  constructor(font: THREE.Font, labelText: string, textColor = new THREE.Color(0x000000)) {
    super(textColor);
    this.font = font;
    this.labelText = labelText;
  }
}