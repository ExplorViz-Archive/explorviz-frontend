import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import EntityMesh from '../entity-mesh';

export default class FoundationMesh extends EntityMesh {

  dataModel: Component;

  constructor(layoutPos: THREE.Vector3, layoutHeight: number, layoutWidth: number, layoutDepth: number,
    foundation: Component, defaultColor: THREE.Color, highlightingColor: THREE.Color) {

    super(layoutPos, layoutHeight, layoutWidth, layoutDepth, defaultColor, highlightingColor);

    const material = new THREE.MeshLambertMaterial({ color: defaultColor });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometry = geometry;
    this.material = material;
    this.dataModel = foundation;
  }
}