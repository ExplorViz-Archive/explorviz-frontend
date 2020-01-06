import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import EntityMesh from '../entity-mesh';

export default class ComponentMesh extends EntityMesh {

  dataModel: Component;
  opened: boolean;
  highlighted: boolean;


  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    component: Component, color: THREE.Color, opened: boolean = false, highlighted: boolean = false) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth);

    let material = new THREE.MeshLambertMaterial({ color });
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.opened = opened;
    this.highlighted = highlighted;
    this.dataModel = component;
  }
}