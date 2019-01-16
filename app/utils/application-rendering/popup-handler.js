import Object from '@ember/object';
import { inject as service } from '@ember/service';

export default Object.extend({

  additionalData: service("additional-data"),

  enableTooltips: true,

  showTooltip(mouse, emberModel) {

    if (!this.get('enableTooltips')){
      return;
    }

    let popupData;
    let modelType = emberModel.constructor.modelName;

    switch (modelType) {
        case "component":
            popupData = this.buildComponentData(emberModel);
            break;
        case "clazz":
            popupData = this.buildClazzData(emberModel);
            break;
        case "drawableclazzcommunication":
            popupData = this.buildCommunicationData(emberModel);
            break;
        default:
            popupData = null;
            break;
    }


    // add mouse position for calculating div position
    if (popupData){
      popupData.mouseX = mouse.x;
      popupData.mouseY = mouse.y;
    }

    this.get("additionalData").setPopupContent(popupData);
  },

  hideTooltip() {
    this.get("additionalData").removePopup();
  },


  buildComponentData(component){
    let name = component.get("name");
    let clazzCount = getClazzesCount(component);
    let packageCount = getPackagesCount(component);

    let popupData = {
        isShown: true,
        popupType: "component",
        componentName: name,
        containedClazzes: clazzCount,
        containedPackages: packageCount,
      }
  
      return popupData;

      function getClazzesCount(component) {
        let result = component.get('clazzes').get('length');
        const children = component.get('children');
        children.forEach((child) => {
          result += getClazzesCount(child);
        });
        return result;
      }
      function getPackagesCount(component) {
        let result = component.get('children').get('length');
        const children = component.get('children');
        children.forEach((child) => {
          result += getPackagesCount(child);
        });
        return result;
      }
  },

  buildClazzData(clazz){
    let clazzName = clazz.get('name');
    let instanceCount = clazz.get('instanceCount');

    const clazzCommunications = clazz.get('clazzCommunications');
    let operationCount = clazzCommunications.get('length');

    let popupData = {
        isShown: true,
        popupType: "clazz",
        clazzName: clazzName,
        activeInstances: instanceCount,
        calledOps: operationCount,
      }
  
      return popupData;
  },

  buildCommunicationData(drawableClazzCommunication) {
    // let runtimeStats = getRuntimeInformations(drawableClazzCommunication);

    // TODO: check if this is correct way to check for bidirectionality
    const isBidirectional = drawableClazzCommunication.get("isBidirectional");

    const traces = drawableClazzCommunication.get('containedTraces');

    let popupData = {
      isShown: true,
      popupType: "clazzCommunication",
      sourceClazz: drawableClazzCommunication.get("sourceClazz").get("name"),
      targetClazz: drawableClazzCommunication.get("targetClazz").get("name"),
      isBidirectional: isBidirectional,
      requests: drawableClazzCommunication.get("requests"),
      traces: traces.size,
      responseTime: round(drawableClazzCommunication.get("averageResponseTime"), 2),
    }

    return popupData;

    
    function round(value, precision) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    } 
  },

});
