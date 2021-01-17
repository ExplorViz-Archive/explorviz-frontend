import { IdentifiableMesh } from 'collaborative-mode/utils/collaborative-data';
import { Package } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import THREE from 'three';
import BoxMesh from './box-mesh';
import ComponentLabelMesh from './component-label-mesh';

export default class ComponentMesh extends BoxMesh implements IdentifiableMesh {
  geometry: THREE.BoxGeometry;

  material: THREE.MeshLambertMaterial;

  dataModel: Package;

  opened: boolean = false;

  colabId: String;

  // Set by labeler
  labelMesh: ComponentLabelMesh | null = null;

  constructor(layoutPos: THREE.Vector3, layoutHeight: number,
    layoutWidth: number, layoutDepth: number,
    component: Package, defaultColor: THREE.Color, highlightingColor: THREE.Color) {
    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = component;
    this.colabId = component.id
  }
}
