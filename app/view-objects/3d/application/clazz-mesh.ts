import THREE from 'three';
import Clazz from 'explorviz-frontend/models/clazz';
import BoxMesh from './box-mesh';
import ClazzLabelMesh from './clazz-label-mesh';

export default class ClazzMesh extends BoxMesh {
  geometry: THREE.BoxGeometry;

  material: THREE.MeshLambertMaterial;

  // Set by labeler
  labelMesh: ClazzLabelMesh | null = null;

  dataModel: Clazz;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number,
    layoutWidth: number, layoutDepth: number, clazz: Clazz, defaultColor: THREE.Color,
    highlightingColor: THREE.Color) {
    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = clazz;
  }
}
