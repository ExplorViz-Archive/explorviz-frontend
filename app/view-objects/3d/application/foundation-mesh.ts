import THREE from 'three';
import BoxMesh from './box-mesh';
import Application from 'explorviz-frontend/models/application';

export default class FoundationMesh extends BoxMesh {

  dataModel: Application;

  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    foundation: Application, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = foundation;
  }

  // Foundation is not labeled
  createLabel(){}
}