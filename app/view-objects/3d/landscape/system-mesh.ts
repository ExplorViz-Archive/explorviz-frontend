import THREE from 'three';
import System from 'explorviz-frontend/models/system';
import PlaneMesh from './plane-mesh';
import PlaneLabelMesh from './plane-label-mesh';
import PlaneLayout from '../../layout-models/plane-layout';
import LabelMesh from '../label-mesh';


export default class SystemMesh extends PlaneMesh {
  dataModel: System;

  material: THREE.MeshBasicMaterial;

  constructor(layout: PlaneLayout, systemModel: System,
    defaultColor: THREE.Color, highlightingColor: THREE.Color = new THREE.Color(255, 0, 0)) {
    super(defaultColor, highlightingColor, layout);

    this.dataModel = systemModel;
    this.material = new THREE.MeshBasicMaterial({ color: defaultColor });
    this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
  }

  setToDefaultPosition(centerPoint: THREE.Vector3) {
    const centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    const centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, 0.0);
  }

  createLabel(font: THREE.Font, fontSize: number = 0.4,
    color: THREE.Color = new THREE.Color(0, 0, 0)) {
    const labelMesh = new PlaneLabelMesh(font, this.dataModel.get('name'), fontSize, color);
    this.positionLabel(labelMesh, -0.6);
    this.add(labelMesh);
  }

  createCollapseSymbol(font: THREE.Font, fontSize: number = 0.35,
    color: THREE.Color = new THREE.Color(0, 0, 0)) {
    const collapseText = this.dataModel.opened ? '-' : '+';

    const collapseSymbolMesh = new PlaneLabelMesh(font, collapseText, fontSize, color);
    this.positionCollapseSymbol(collapseSymbolMesh);
    this.add(collapseSymbolMesh);
  }

  positionLabel(labelMesh: THREE.Mesh, offset: number) {
    this.geometry.computeBoundingBox();
    const bboxParent = this.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelLength = Math.abs(labelBoundingBox.max.x)
      - Math.abs(labelBoundingBox.min.x);

    labelMesh.position.x = -(labelLength / 2.0);
    labelMesh.position.y = bboxParent.max.y + offset;
    labelMesh.position.z = this.position.z + 0.001;
  }

  positionCollapseSymbol(collapseSymbol: LabelMesh) {
    const bboxSystem = this.geometry.boundingBox;
    collapseSymbol.position.x = bboxSystem.max.x - 0.35;
    collapseSymbol.position.y = bboxSystem.max.y - 0.35;
    collapseSymbol.position.z = this.position.z + 0.01;
  }
}
