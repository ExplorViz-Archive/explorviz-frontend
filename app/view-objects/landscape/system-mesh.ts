import THREE from 'three';
import PlaneMesh from './plane-mesh';
import PlaneLayout from '../layout-models/plane-layout';


export default class SystemMesh extends PlaneMesh {

  material: THREE.MeshBasicMaterial;

  constructor(layout: PlaneLayout, defaultColor: THREE.Color, highlightingColor: THREE.Color = new THREE.Color(255,0,0)) {
    super(defaultColor, highlightingColor, layout);

    this.material = new THREE.MeshBasicMaterial({color: defaultColor});
    this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
  }

  setToDefaultPosition(centerPoint: THREE.Vector3){
    let centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    let centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;
  
    this.position.set(centerX, centerY, 0);
    console.log("Position X", this.layout.positionX);
  }

  // TODO
  createLabel(font: THREE.Font, color: THREE.Color){}

}