import Object from '@ember/object';
import { encodeStringForPopUp } from '../helpers/string-helpers';
import { round } from '../helpers/number-helpers';
import { inject as service } from '@ember/service';

export default Object.extend({

  additionalData: service(),
  enableTooltips: true,

  showTooltip(mouse : {x : number, y : number}, emberModel : any) {

    if (!this.get('enableTooltips')) {
      return;
    }

    let popupData : any;
    const modelType = emberModel.constructor.modelName;

    switch (modelType) {
      case "system":
        popupData = this.buildSystemData(emberModel);
        break;
      case "nodegroup":
        popupData = this.buildNodeGroupData(emberModel);
        break;
      case "node":
        popupData = this.buildNodeData(emberModel);
        break;
      case "application":
        popupData = this.buildApplicationData(emberModel);
        break;
      case "applicationcommunication":
        popupData = this.buildCommunicationData(emberModel);
        break;
      default:
        popupData = null;
        break;
    }

    // Add mouse position for calculating div position
    if (popupData){
      popupData.mouseX = mouse.x;
      popupData.mouseY = mouse.y;
    }

    const additionalData : any = this.get("additionalData");
    additionalData.setPopupContent(popupData);
  },


  hideTooltip() {
    const additionalData : any = this.get("additionalData");
    additionalData.removePopup();
  },

  buildSystemData(system : any) {
    let systemName = encodeStringForPopUp(system.get('name'));

    let nodeCount = 0;
    let applicationCount = 0;

    // Calculate node and application count
    const nodeGroups = system.get('nodegroups');

    nodeGroups.forEach((nodeGroup : any) => {

      nodeCount += nodeGroup.get('nodes').get('length');
      const nodes = nodeGroup.get('nodes');

      nodes.forEach((node : any) => {
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
  },

  buildNodeGroupData(nodeGroup : any){

    let avgNodeCPUUtil = 0.0;
    let applicationCount = 0;

    const nodes = nodeGroup.get('nodes');
    const nodeCount = nodes.get('length');

    nodes.forEach((node : any) => {
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
  },

  buildNodeData(node : any){
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
    }

    return popupData;
  },

  buildApplicationData(application : any){
    const lastUsage = new Date(application.get('lastUsage')).toLocaleString();

    let popupData = {
      isShown: true,
      popupType: "application",
      applicatioName: application.get('name'),
      lastUsage: lastUsage,
      language: application.get('programmingLanguage'),
    }

    return popupData;
  },

  buildCommunicationData(communication : any){
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

    function round(value : number, precision : number) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    } 
  },

});
