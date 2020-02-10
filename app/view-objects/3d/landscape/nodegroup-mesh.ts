import THREE from 'three';
import PlaneMesh from './plane-mesh';
import PlaneLabelMesh from './plane-label-mesh';
import PlaneLayout from '../../layout-models/plane-layout';
import LabelMesh from '../label-mesh';
import NodeGroup from 'explorviz-frontend/models/nodegroup';


export default class NodeGroupMesh extends PlaneMesh {

  dataModel: NodeGroup;
  material: THREE.MeshBasicMaterial;

  constructor(layout: PlaneLayout, nodeGroupModel: NodeGroup, defaultColor: THREE.Color, highlightingColor: THREE.Color = new THREE.Color(255, 0, 0)) {
    super(defaultColor, highlightingColor, layout);

    this.dataModel = nodeGroupModel;
    this.material = new THREE.MeshBasicMaterial({ color: defaultColor });
    this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
  }

  setToDefaultPosition(centerPoint: THREE.Vector3) {
    let centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    let centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, 0.0001);
  }

  createLabel(font: THREE.Font, fontSize: number = 0.4, color: THREE.Color = new THREE.Color(0, 0, 0)) {
  }

  createCollapseSymbol(font: THREE.Font, fontSize: number = 0.35, color: THREE.Color = new THREE.Color(255, 255, 255)) {
    let collapseText = this.dataModel.opened ? '-' : '+';

    let collapseSymbolMesh = new PlaneLabelMesh(font, collapseText, fontSize, color);
    this.positionCollapseSymbol(collapseSymbolMesh);
    this.add(collapseSymbolMesh);
  }

  positionCollapseSymbol(collapseSymbol: LabelMesh) {
    this.geometry.computeBoundingBox();
    const bboxSystem = this.geometry.boundingBox;
    collapseSymbol.position.x = bboxSystem.max.x - 0.35;
    collapseSymbol.position.y = bboxSystem.max.y - 0.35;
    collapseSymbol.position.z = this.position.z + 0.0001;
  }

}