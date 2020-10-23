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
    defaultColor: THREE.Color, highlightingColor: THREE.Color,
    widthSegments: number = 1, depthSegments: number = 1) {
    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    this.setDefaultMaterial();

    const geometry = new THREE.BoxGeometry(1, 1, 1, widthSegments, 1, depthSegments);
    this.geometry = geometry;

    this.dataModel = foundation;
  }

  setDefaultMaterial() {
    const material = new THREE.MeshLambertMaterial({ color: this.defaultColor });
    this.material = material;
  }
}
