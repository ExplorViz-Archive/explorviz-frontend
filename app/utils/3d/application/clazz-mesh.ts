import THREE from 'three';
import EntityMesh from '../entity-mesh';
import Clazz from 'explorviz-frontend/models/clazz';

export default class ClazzMesh extends EntityMesh {

  dataModel: Clazz;
  highlighted: boolean;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    clazz: Clazz, color: THREE.Color, highlighted: boolean = false) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth);

    let material = new THREE.MeshLambertMaterial({ color });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.highlighted = highlighted;
    this.dataModel = clazz;
  }
}