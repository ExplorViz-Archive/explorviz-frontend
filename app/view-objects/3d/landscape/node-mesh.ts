import THREE from 'three';
import Node from 'explorviz-frontend/models/node';
import PlaneMesh from './plane-mesh';
import PlaneLayout from '../../layout-models/plane-layout';
import PlaneLabelMesh from './plane-label-mesh';


export default class NodeMesh extends PlaneMesh {
  dataModel: Node;

  material: THREE.MeshBasicMaterial;

  constructor(layout: PlaneLayout, nodeModel: Node,
    defaultColor: THREE.Color, highlightingColor: THREE.Color = new THREE.Color(255, 0, 0)) {
    super(defaultColor, highlightingColor, layout);

    this.dataModel = nodeModel;
    this.material = new THREE.MeshBasicMaterial({ color: defaultColor });
    this.geometry = new THREE.PlaneGeometry(layout.width, layout.height);
  }

  setToDefaultPosition(centerPoint: THREE.Vector3) {
    const centerX = this.layout.positionX + this.layout.width / 2 - centerPoint.x;
    const centerY = this.layout.positionY - this.layout.height / 2 - centerPoint.y;

    this.position.set(centerX, centerY, 0.02);
  }

  createLabel(font: THREE.Font, fontSize: number = 0.22,
    color: THREE.Color = new THREE.Color(255, 255, 255)) {
    const labelMesh = new PlaneLabelMesh(font, this.dataModel.getDisplayName(), fontSize, color);
    this.positionLabel(labelMesh, 0.2);
    this.add(labelMesh);
  }

  positionLabel(labelMesh: THREE.Mesh, offset: number) {
    this.geometry.computeBoundingBox();
    const bboxParent = this.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelLength = Math.abs(labelBoundingBox.max.x)
      - Math.abs(labelBoundingBox.min.x);

    labelMesh.position.x = -(labelLength / 2.0);
    labelMesh.position.y = bboxParent.min.y + offset;
    labelMesh.position.z = this.position.z + 0.001;
  }
}
