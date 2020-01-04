import THREE from 'three';
import Component from 'explorviz-frontend/models/component';

export default class FoundationMesh extends THREE.Mesh {

  height:number;
  width:number;
  depth:number;

  positionX:number;
  positionY:number;
  positionZ:number;

  hightlighted:boolean;
  opened:boolean;
  visible:boolean;

  constructor(foundation: Component, color: string, height: number = 0, width: number = 0, depth: number = 0, opened: boolean = false) {
    const material = FoundationMesh.createMaterial(color);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    super(geometry, material);
    this.height = 1;
    this.width = 1;
    this.depth = 1;

    this.scale.x = width / 2;
    this.scale.y = height;
    this.scale.z = depth / 2;
  
    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 0;
  
    this.hightlighted = false;
    this.opened = opened;
    this.visible = true;

    this.userData.dataModel = foundation;
  }

  static createMaterial(color: string) {
    let transparent = false;
    let opacityValue = 1.0;
    const material = new THREE.MeshLambertMaterial({
      opacity: opacityValue,
      transparent: transparent
    });

    material.color = new THREE.Color(color);
    return material;
  }
}