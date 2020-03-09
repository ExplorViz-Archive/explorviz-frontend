import THREE from "three";
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import Application from 'explorviz-frontend/models/application';
import PlaneLabelMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-label-mesh';

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