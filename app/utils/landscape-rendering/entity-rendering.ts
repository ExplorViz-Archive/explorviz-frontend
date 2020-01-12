import THREE from 'three';
import DrawNodeEntity from 'explorviz-frontend/models/drawnodeentity';
import Configuration from 'explorviz-frontend/services/configuration';
import System from 'explorviz-frontend/models/system';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import Node from 'explorviz-frontend/models/node';
import Application from 'explorviz-frontend/models/application';


export function createPlane(model: DrawNodeEntity, color: THREE.Color) {
  const material = new THREE.MeshBasicMaterial({
    color
  });

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(model.get('width'),
    model.get('height')), material);

  plane.userData['model'] = model;
  return plane;
}


export function renderSystem(system: System, centerPoint: THREE.Vector3, configuration: Configuration, labeler: any, font: THREE.Font) {
  let systemColor = new THREE.Color(configuration.landscapeColors.system);
  let labelColor = new THREE.Color(configuration.landscapeColors.systemText);

  let centerX = system.get('positionX') + system.get('width') / 2 - centerPoint.x;
  let centerY = system.get('positionY') - system.get('height') / 2 - centerPoint.y;

  let systemMesh = createPlane(system, systemColor);
  systemMesh.position.set(centerX, centerY, system.get('positionZ'));
  system.set('threeJSModel', systemMesh);

  labeler.drawCollapseSymbol(systemMesh, font, labelColor);
  labeler.drawSystemTextLabel(systemMesh, font, labelColor);

  return systemMesh;
}


export function renderNodeGroup(nodegroup: NodeGroup, centerPoint: THREE.Vector3, configuration: Configuration, labeler: any, font: THREE.Font) {
  let nodes = nodegroup.get('nodes');

  // Add box for nodegroup if it contains more than one node
  if (nodes.content.length < 2) {
    return null;
  }

  let nodegroupMesh;

  let centerX = nodegroup.get('positionX') + nodegroup.get('width') / 2 - centerPoint.x;
  let centerY = nodegroup.get('positionY') - nodegroup.get('height') / 2 - centerPoint.y;

  let nodeGroupColor = new THREE.Color(configuration.landscapeColors.nodegroup);
  let labelColor = new THREE.Color(configuration.landscapeColors.nodeText);

  nodegroupMesh = createPlane(nodegroup, nodeGroupColor);
  nodegroupMesh.position.set(centerX, centerY,
    nodegroup.get('positionZ') + 0.001);

  nodegroup.set('threeJSModel', nodegroupMesh);
  labeler.drawCollapseSymbol(nodegroupMesh, font, labelColor);

  return nodegroupMesh;
}


export function renderNode(node: Node, centerPoint: THREE.Vector3, configuration: Configuration, labeler: any, font: THREE.Font) {
  let centerX = node.get('positionX') + node.get('width') / 2 - centerPoint.x;
  let centerY = node.get('positionY') - node.get('height') / 2 - centerPoint.y;

  let nodeColor = new THREE.Color(configuration.landscapeColors.node);
  let labelColor = new THREE.Color(configuration.landscapeColors.nodeText);

  let nodeMesh = createPlane(node, nodeColor);
  nodeMesh.position.set(centerX, centerY, node.get('positionZ') + 0.002);

  node.set('threeJSModel', nodeMesh);
  labeler.drawNodeTextLabel(nodeMesh, font, labelColor);

  return nodeMesh;
}


export function renderApplication(application: Application, centerPoint: THREE.Vector3, imageLoader: any,
  configuration: Configuration, labeler: any, font: THREE.Font) {
  let centerX = application.get('positionX') + application.get('width') / 2 -
    centerPoint.x;
  let centerY = application.get('positionY') - application.get('height') / 2 -
    centerPoint.y;

  let applicationColor = new THREE.Color(configuration.landscapeColors.application);
  let labelColor = new THREE.Color(configuration.landscapeColors.applicationText);


  let applicationMesh = createPlane(application, applicationColor);

  applicationMesh.position.set(centerX, centerY,
    application.get('positionZ') + 0.003);

  application.set('threeJSModel', applicationMesh);

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

  // Create text labels
  labeler.drawApplicationTextLabel(applicationMesh, font, labelColor);

  return applicationMesh;
}