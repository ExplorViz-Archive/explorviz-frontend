import THREE from 'three';
import Application from 'explorviz-frontend/models/application';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';

export default class FoundationMesh extends BoxMesh {
  geometry: THREE.BoxGeometry;

  dataModel: Application;

  labelMesh: ComponentLabelMesh | null = null;

  constructor(layoutPos: THREE.Vector3, layoutHeight: number,
    layoutWidth: number, layoutDepth: number, foundation: Application,
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = foundation;
  }
}
