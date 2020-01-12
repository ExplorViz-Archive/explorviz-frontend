import { round } from '../helpers/number-helpers';
import System from 'explorviz-frontend/models/system';
import Node from 'explorviz-frontend/models/node';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import Application from 'explorviz-frontend/models/application';
import ApplicationCommunication from 'explorviz-frontend/models/applicationcommunication';
import { tracked } from '@glimmer/tracking';

export default class PopupHandler {

  enableTooltips:boolean = true;

  @tracked
  popupContent: any = null;


  showTooltip(mouse: { x: number, y: number },
    emberModel: System | NodeGroup | Node | Application | ApplicationCommunication) {

    if (!this.enableTooltips) {
      return;
    }

    let popupData: any;

    // Build popup data based upon ember model type
    if (emberModel instanceof System) {
      popupData = this.buildSystemData(emberModel);
    }
    else if (emberModel instanceof NodeGroup) {
      popupData = this.buildNodeGroupData(emberModel);
    }
    else if (emberModel instanceof Node) {
      popupData = this.buildNodeData(emberModel);
    }
    else if (emberModel instanceof Application) {
      popupData = this.buildApplicationData(emberModel);
    }
    else if (emberModel instanceof ApplicationCommunication) {
      popupData = this.buildCommunicationData(emberModel);
    }

    // Add mouse position for calculating div position
    if (popupData) {
      popupData.mouseX = mouse.x;
      popupData.mouseY = mouse.y;
    }

    this.popupContent = popupData;
  }


  hideTooltip() {
    this.popupContent = null;
  }


  buildSystemData(system: System) {
    // String formatting
    let systemName = String(system.get('name'))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    let nodeCount = 0;
    let applicationCount = 0;

    // Calculate node and application count
    const nodeGroups = system.get('nodegroups');

    nodeGroups.forEach((nodeGroup) => {

      nodeCount += nodeGroup.get('nodes').get('length');
      const nodes = nodeGroup.get('nodes');

      nodes.forEach((node) => {
        applicationCount += node.get('applications').get('length');
      });
    });

    let popupData = {
      isShown: true,
      popupType: "system",
      systemName: systemName,
      numOfNodes: nodeCount,
      numOfApps: applicationCount,
    }

    return popupData;
  }


  buildNodeGroupData(nodeGroup: NodeGroup) {
    let avgNodeCPUUtil = 0.0;
    let applicationCount = 0;

    const nodes = nodeGroup.get('nodes');
    const nodeCount = nodes.get('length');

    nodes.forEach((node) => {
      avgNodeCPUUtil += node.get('cpuUtilization');
      applicationCount += node.get('applications').get('length');
    });

    let avgCpuUtilization = round((avgNodeCPUUtil * 100) / nodeCount, 0);

    let popupData = {
      isShown: true,
      popupType: "nodeGroup",
      nodeGroupName: nodeGroup.get('name'),
      numOfNodes: nodeCount,
      numOfApps: applicationCount,
      avgCPUtil: avgCpuUtilization + '%',
    }

    return popupData;
  }


  buildNodeData(node: any) {
    const formatFactor = (1024 * 1024 * 1024);
    let cpuUtilization = round(node.get('cpuUtilization') * 100, 0);
    let freeRAM = round(node.get('freeRAM') / formatFactor, 2).toFixed(2);
    let totalRAM = round((node.get('usedRAM') + node.get('freeRAM')) / formatFactor, 2).toFixed(2);


    let popupData = {
      isShown: true,
      popupType: "node",
      nodeName: node.getDisplayName(),
      cpuUtil: cpuUtilization + '%',
      freeRAM: freeRAM,
      totalRAM: totalRAM,
    }

    return popupData;
  }


  buildApplicationData(application: Application) {
    const lastUsage = new Date(application.get('lastUsage')).toLocaleString();

    let popupData = {
      isShown: true,
      popupType: "application",
      applicatioName: application.get('name'),
      lastUsage: lastUsage,
      language: application.get('programmingLanguage'),
    }

    return popupData;
  }


  buildCommunicationData(communication: ApplicationCommunication) {
    const sourceApplicationName = communication.get('sourceApplication').get('name');
    const targetApplicationName = communication.get('targetApplication').get('name');

    let technology = communication.get('technology') === undefined ? "undefined" : communication.get('technology');

    let popupData = {
      isShown: true,
      popupType: "applicationCommunication",
      sourceApplication: sourceApplicationName,
      targetApplication: targetApplicationName,
      requests: communication.get('requests'),
      technology: technology,
      duration: round(communication.get('averageResponseTime'), 2),
    }

    return popupData;

    function round(value: number, precision: number) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
  }

}