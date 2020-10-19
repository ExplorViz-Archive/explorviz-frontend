import Component from 'explorviz-frontend/models/component';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import System from 'explorviz-frontend/models/system';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import THREE from 'three';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import NodeGroupMesh from 'explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';

export type DetailedInfo= {
  title: string,
  entries: {key: string, value: string}[],
};

// #region HELPER

function avgNodeGroupCpuUtilization(nodeGroup: NodeGroup) {
  let avgCpuUtil = 0;
  const nodes = nodeGroup.get('nodes');

  nodes.forEach((node) => {
    avgCpuUtil += node.get('cpuUtilization');
  });

  avgCpuUtil /= nodes.get('length');

  return Math.round((avgCpuUtil) * 100) / 100;
}

function countNodeGroupElements(nodeGroup: NodeGroup) {
  let nodeCount = 0;
  let applicationCount = 0;

  nodeCount += nodeGroup.get('nodes').get('length');

  const nodes = nodeGroup.get('nodes');
  nodes.forEach((node) => {
    applicationCount += node.get('applications').get('length');
  });

  return { nodeCount, applicationCount };
}

function countSystemElements(system: System) {
  let nodeGroupCount = 0;
  let nodeCount = 0;
  let applicationCount = 0;

  const nodeGroups = system.get('nodegroups');
  nodeGroups.forEach((nodeGroup) => {
    const nodeGroupElements = countNodeGroupElements(nodeGroup);

    nodeGroupCount++;
    nodeCount += nodeGroupElements.nodeCount;
    applicationCount += nodeGroupElements.applicationCount;
  });

  return { nodeGroupCount, nodeCount, applicationCount };
}

function countComponentElements(component: Component) {
  let clazzCount = component.get('clazzes').get('length');
  let componentCount = 0;

  const children = component.get('children');

  children.forEach((child) => {
    const elementCount = countComponentElements(child);

    clazzCount += elementCount.clazzCount;
    componentCount += elementCount.componentCount;
  });

  return { componentCount, clazzCount };
}

// #endregion HELPER

// #region LANDSCAPE CONTENT COMPOSER

function composeSystemContent(mesh: SystemMesh) {
  const system = mesh.dataModel;
  const { nodeGroupCount, nodeCount, applicationCount } = countSystemElements(system);

  const content: DetailedInfo = { title: system.get('name'), entries: [] };

  content.entries.push({ key: 'Nodes: ', value: nodeCount.toString() });
  content.entries.push({ key: 'NodeGroups: ', value: nodeGroupCount.toString() });
  content.entries.push({ key: 'Applications: ', value: applicationCount.toString() });

  return content;
}

function composeNodeGroupContent(nodeGroupMesh: NodeGroupMesh) {
  const nodeGroup = nodeGroupMesh.dataModel;
  const { nodeCount, applicationCount } = countNodeGroupElements(nodeGroup);

  const content: DetailedInfo = { title: nodeGroup.get('name'), entries: [] };

  content.entries.push({ key: 'Nodes: ', value: nodeCount.toString() });
  content.entries.push({ key: 'Applications: ', value: applicationCount.toString() });
  content.entries.push({ key: 'Avg. CPU Utilization: ', value: avgNodeGroupCpuUtilization(nodeGroup).toString() });

  return content;
}

function composeNodeContent(nodeMesh: NodeMesh) {
  const node = nodeMesh.dataModel;

  const Mb2Gb = 1 / (1024 * 1024 * 1024);
  const cpuUtilization = Math.round((node.get('cpuUtilization')) * 100) / 100;
  const freeRam = Math.round((node.get('freeRAM') * Mb2Gb) * 100) / 100;
  const totalRam = Math.round((node.get('usedRAM') * Mb2Gb) * 100) / 100;

  const content: DetailedInfo = { title: nodeMesh.getDisplayName(), entries: [] };

  content.entries.push({ key: 'CPU Utilization: ', value: cpuUtilization.toString() });
  content.entries.push({ key: 'Free RAM: ', value: `${freeRam} GB` });
  content.entries.push({ key: 'Total RAM: ', value: `${totalRam} GB` });

  return content;
}

function composeApplicationContent(applicationMesh: ApplicationMesh) {
  const application = applicationMesh.dataModel;

  const content: DetailedInfo = { title: application.get('name'), entries: [] };

  content.entries.push({ key: 'Last Usage: ', value: new Date(application.get('lastUsage')).toLocaleString() });
  content.entries.push({ key: 'Language: ', value: application.get('programmingLanguage') });

  return content;
}

// #endregion LANDSCAPE CONTENT COMPOSER

// #region APPLICATION CONTENT COMPOSER

function composeComponentContent(componentMesh: ComponentMesh) {
  const component = componentMesh.dataModel;
  const { componentCount, clazzCount } = countComponentElements(component);

  const content: DetailedInfo = { title: component.get('name'), entries: [] };

  content.entries.push({ key: 'Contained Packages: ', value: componentCount.toString() });
  content.entries.push({ key: 'Contained Classes: ', value: clazzCount.toString() });

  return content;
}

function composeClazzContent(clazzMesh: ClazzMesh) {
  const clazz = clazzMesh.dataModel;

  const content: DetailedInfo = { title: clazz.get('name'), entries: [] };

  content.entries.push({ key: 'Active Instances: ', value: clazz.get('instanceCount').toString() });
  content.entries.push({ key: 'Method Calls: ', value: clazz.get('clazzCommunications').length.toString() });

  return content;
}

function composeDrawableClazzCommunicationContent(communicationMesh: ClazzCommunicationMesh) {
  const communication = communicationMesh.dataModel;

  const commDirection = communication.isBidirectional ? ' <-> ' : ' -> ';
  const title = communication.get('sourceClazz').get('name') + commDirection + communication.get('targetClazz').get('name');
  const avgResponseTime = Math.round((communication.get('averageResponseTime') / 1000000) * 10000) / 10000;

  const content: DetailedInfo = { title, entries: [] };

  content.entries.push({ key: 'Requests: ', value: communication.get('requests').toString() });
  content.entries.push({ key: 'Avg. Response Time (ms): ', value: avgResponseTime.toString() });

  return content;
}

// #endregion APPLICATION CONTENT COMPOSER

export default function composeContent(object: THREE.Object3D) {
  let content: DetailedInfo|null = null;

  // Landscape Content
  if (object instanceof SystemMesh) {
    content = composeSystemContent(object);
  } else if (object instanceof NodeGroupMesh) {
    content = composeNodeGroupContent(object);
  } else if (object instanceof NodeMesh) {
    content = composeNodeContent(object);
  } else if (object instanceof ApplicationMesh) {
    content = composeApplicationContent(object);
  // Application Content
  } else if (object instanceof ComponentMesh) {
    content = composeComponentContent(object);
  } else if (object instanceof ClazzMesh) {
    content = composeClazzContent(object);
  } else if (object instanceof ClazzCommunicationMesh) {
    content = composeDrawableClazzCommunicationContent(object);
  }

  return content;
}
