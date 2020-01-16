import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import EntityMesh from '../entity-mesh';

export default class ComponentMesh extends EntityMesh {

  geometry: THREE.BoxGeometry;
  material: THREE.MeshLambertMaterial;
  dataModel: Component;
  opened: boolean = false;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    component: Component, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    let material = new THREE.MeshLambertMaterial({ color: defaultColor });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = component;
  }
}