import Object from '@ember/object';
import { encodeStringForPopUp } from '../helpers/string-helpers';
import { round } from '../helpers/number-helpers';
import { inject as service } from '@ember/service';

export default Object.extend({

  additionalData: service("additional-data"),
  enableTooltips: true,

  showTooltip(mouse, emberModel) {

    if (!this.get('enableTooltips')) {
      return;
    }

    let popupData;
    const modelType = emberModel.constructor.modelName;

    switch (modelType) {
      case "system":
        popupData = this.buildSystemData(mouse, emberModel);
        break;
      case "nodegroup":
        popupData = this.buildNodeGroupData(mouse, emberModel);
        break;
      case "node":
        popupData = this.buildNodeData(mouse, emberModel);
        break;
      case "application":
        popupData = this.buildApplicationData(mouse, emberModel);
        break;
      case "applicationcommunication":
        popupData = this.buildCommunicationData(mouse, emberModel);
        break;
      default:
        popupData = null;
        break;
    }

    this.get("additionalData").setPopupContent(popupData);

  },


  hideTooltip() {
    this.get("additionalData").removePopup();
  },

  buildSystemData(mouse, system) {

    let systemName = encodeStringForPopUp(system.get('name'));

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
      top: mouse.y - 105, // incorporate popup height
      left: mouse.x - 62, // incorporate popup width / 2
    }

    return popupData;
  },

  buildNodeGroupData(mouse, nodeGroup){

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
      top: mouse.y - 128, // incorporate popup height
      left: mouse.x - 96, // incorporate popup width / 2
    }

    return popupData;
  },

  buildNodeData(mouse, node){
    const formatFactor = (1024 * 1024 * 1024);
    let cpuUtilization = round(node.get('cpuUtilization') * 100, 0);
    let freeRAM =  round(node.get('freeRAM') / formatFactor, 2).toFixed(2);
    let totalRAM = round((node.get('usedRAM') + node.get('freeRAM')) / formatFactor, 2).toFixed(2);


    let popupData = {
      isShown: true,
      popupType: "node",
      nodeName: node.getDisplayName(),
      cpuUtil: cpuUtilization + '%',
      freeRAM: freeRAM,
      totalRAM: totalRAM,
      top: mouse.y - 130, // incorporate popup height
      left: mouse.x - 80, // incorporate popup width / 2
    }

    return popupData;
  },

  buildApplicationData(mouse, application){

    const lastUsage = new Date(application.get('lastUsage')).toLocaleString();

    let popupData = {
      isShown: true,
      popupType: "application",
      applicatioName: application.get('name'),
      lastUsage: lastUsage,
      language: application.get('programmingLanguage'),
      top: mouse.y - 107, // incorporate popup height
      left: mouse.x - 105, // incorporate popup width / 2
    }

    return popupData;
  },

  buildCommunicationData(mouse, communication){

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
      duration: communication.get('averageResponseTime') + 'ns',
      top: mouse.y - 130, // incorporate popup height
      left: mouse.x - 107, // incorporate popup width / 2
    }

    return popupData;
  },

});
