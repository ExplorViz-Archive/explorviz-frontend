import THREE from "three";
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import Application from 'explorviz-frontend/models/application';
import PlaneLabelMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-label-mesh';
import NodeMesh from "explorviz-frontend/view-objects/3d/landscape/node-mesh";
import SystemMesh from "explorviz-frontend/view-objects/3d/landscape/system-mesh";
import NodeGroupMesh from "explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh";

export function addSystemTextLabel(systemMesh: SystemMesh, text: string, font: THREE.Font, color: THREE.Color) {
  const labelMesh = new PlaneLabelMesh(font, text, 0.4, color);

  systemMesh.geometry.computeBoundingBox();
  const bboxParent = systemMesh.geometry.boundingBox;

  labelMesh.geometry.computeBoundingBox();
  const labelBoundingBox = labelMesh.geometry.boundingBox;

  const labelLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

  labelMesh.position.x = -(labelLength / 2.0);
  labelMesh.position.y = bboxParent.max.y - 0.6;
  labelMesh.position.z = systemMesh.position.z + 0.001;

  systemMesh.add(labelMesh);
}

export function addCollapseSymbol(entityMesh: SystemMesh | NodeGroupMesh, font: THREE.Font, color: THREE.Color) {
  const collapseSymbol = entityMesh.dataModel.opened ? '-' : '+';
  const collapseSymbolMesh = new PlaneLabelMesh(font, collapseSymbol, 0.35, color);

  entityMesh.geometry.computeBoundingBox();
  const bboxSystem = entityMesh.geometry.boundingBox;
  collapseSymbolMesh.position.x = bboxSystem.max.x - 0.35;
  collapseSymbolMesh.position.y = bboxSystem.max.y - 0.35;
  collapseSymbolMesh.position.z = entityMesh.position.z + 0.01;

  entityMesh.add(collapseSymbolMesh);
}

export function addNodeTextLabel(nodeMesh: NodeMesh, text: string, font: THREE.Font, color: THREE.Color) {
  const labelMesh = new PlaneLabelMesh(font, text, 0.22, color);

  nodeMesh.geometry.computeBoundingBox();
  const bboxParent = nodeMesh.geometry.boundingBox;

  labelMesh.geometry.computeBoundingBox();
  const labelBoundingBox = labelMesh.geometry.boundingBox;

  const labelLength = Math.abs(labelBoundingBox.max.x)
    - Math.abs(labelBoundingBox.min.x);

  labelMesh.position.x = -(labelLength / 2.0);
  labelMesh.position.y = bboxParent.min.y + 0.2;
  labelMesh.position.z = nodeMesh.position.z + 0.001;

  nodeMesh.add(labelMesh);
}

export function addApplicationTextLabel(applicationMesh: ApplicationMesh, text: string, font: THREE.Font, color: THREE.Color) {
  const labelMesh = new PlaneLabelMesh(font, text, 0.25, color);

  // Position label
  applicationMesh.geometry.computeBoundingBox();
  const bboxParent = applicationMesh.geometry.boundingBox;

  labelMesh.geometry.computeBoundingBox();
  const labelBoundingBox = labelMesh.geometry.boundingBox;

  const labelHeight = Math.abs(labelBoundingBox.max.y) -
    Math.abs(labelBoundingBox.min.y);

  const PADDING_LEFT = 0.1;

  labelMesh.position.x = bboxParent.min.x + PADDING_LEFT;
  labelMesh.position.y = -(labelHeight / 2.0);
  labelMesh.position.z = applicationMesh.position.z + 0.001;

  applicationMesh.add(labelMesh);
}

export function addApplicationLogo(applicationMesh: ApplicationMesh,
  application: Application, imageLoader: any) {
  // Create logos
  applicationMesh.geometry.computeBoundingBox();

  const logoSize = {
    width: 0.4,
    height: 0.4
  };
  const appBBox = applicationMesh.geometry.boundingBox;

  const logoPos = new THREE.Vector3();

  const logoRightPadding = logoSize.width * 0.7;

  logoPos.x = appBBox.max.x - logoRightPadding;

  const texturePartialPath = application.get('programmingLanguage').toLowerCase();

  imageLoader.createPicture(logoPos, logoSize.width, logoSize.height,
    texturePartialPath, applicationMesh, "label");
}