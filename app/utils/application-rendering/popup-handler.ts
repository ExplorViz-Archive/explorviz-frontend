import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import { tracked } from '@glimmer/tracking';

export default class PopupHandler {

  enableTooltips:boolean = true;

  @tracked
  popupContent: any = null;

  showTooltip(mouse:{x:number, y:number}, emberModel:any) : void {

    if (!this.enableTooltips){
      return;
    }

    let popupData: any = {};

    if(emberModel instanceof Component)
      popupData = this.buildComponentData(emberModel);
    else if(emberModel instanceof Clazz)
      popupData = this.buildClazzData(emberModel);
    else if(emberModel instanceof DrawableClazzCommunication)
      popupData = this.buildCommunicationData(emberModel);
    else
      popupData = null;


    // add mouse position for calculating div position
    if (popupData){
      popupData.mouseX = mouse.x;
      popupData.mouseY = mouse.y;
    }

    this.popupContent = popupData;
  }

  hideTooltip() : void {
    this.popupContent = null;
  }


  buildComponentData(component:Component){
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

    function getClazzesCount(component:Component) : number {
      let result = component.get('clazzes').get('length');
      const children = component.get('children');
      children.forEach((child) => {
        result += getClazzesCount(child);
      });
      return result;
    }
    function getPackagesCount(component:Component) : number {
      let result = component.get('children').get('length');
      const children = component.get('children');
      children.forEach((child) => {
        result += getPackagesCount(child);
      });
      return result;
    }
  }

  buildClazzData(clazz:Clazz){
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
  }

  buildCommunicationData(drawableClazzCommunication:DrawableClazzCommunication) {
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

    
    function round(value:number, precision:number) : number {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    } 
  }

}
