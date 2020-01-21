import THREE from 'three';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';
import Application from 'explorviz-frontend/models/application';

export default class FoundationMesh extends BoxMesh {

  geometry: THREE.BoxGeometry;
  dataModel: Application;
  labelMesh: ComponentLabelMesh | null = null;

  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    foundation: Application, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = foundation;
  }

  createLabel(font: THREE.Font, color: THREE.Color) {
    let label = new ComponentLabelMesh(this, font, color);
    this.labelMesh = label;

    this.positionLabel();
    this.add(label);
  }

  positionLabel() {
    let label = this.labelMesh;
    if (!label)
      return;

    label.geometry.center();

    // Set y-position just above the box of the parent mesh
    label.position.y = this.geometry.parameters.height / 2 + 0.01;

    // Align text with component parent
    label.rotation.x = -(Math.PI / 2);
    label.rotation.z = -(Math.PI / 2);

    const OFFSET_BOTTOM = 1.5;

    // Position Label just above the bottom edge
    label.position.x = - this.geometry.parameters.width / 2 + OFFSET_BOTTOM / this.scale.x;
  }
}