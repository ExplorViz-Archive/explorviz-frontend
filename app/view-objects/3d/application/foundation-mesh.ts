import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import THREE from 'three';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';

export default class FoundationMesh extends BoxMesh {
  geometry: THREE.BoxGeometry;

  dataModel: Application;

  labelMesh: ComponentLabelMesh | null = null;

  constructor(layout: BoxLayout, foundation: Application,
    defaultColor: THREE.Color, highlightingColor: THREE.Color,
    widthSegments: number = 1, depthSegments: number = 1) {
    super(layout, defaultColor, highlightingColor);

    this.receiveShadow = true;

    const geometry = new THREE.BoxGeometry(1, 1, 1, widthSegments, 1, depthSegments);
    this.geometry = geometry;
    this.setDefaultMaterial();
    this.dataModel = foundation;
  }

  setDefaultMaterial() {
    const material = new THREE.MeshLambertMaterial({ color: this.defaultColor });
    this.material = material;
  }
}
