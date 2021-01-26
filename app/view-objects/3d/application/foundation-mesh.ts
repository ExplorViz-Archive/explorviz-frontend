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
    defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(layout, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = foundation;
  }
}
