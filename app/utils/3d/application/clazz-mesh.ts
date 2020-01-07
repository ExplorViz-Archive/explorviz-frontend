import THREE from 'three';
import EntityMesh from '../entity-mesh';
import Clazz from 'explorviz-frontend/models/clazz';

export default class ClazzMesh extends EntityMesh {

  geometry: THREE.BoxGeometry;
  material: THREE.MeshLambertMaterial;
  dataModel: Clazz;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    clazz: Clazz, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    let material = new THREE.MeshLambertMaterial({ color: defaultColor });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = clazz;
  }
}