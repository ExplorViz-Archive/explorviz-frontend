import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import { tracked } from '@glimmer/tracking';

export default class PopupHandler {

  @tracked
  popupContent: any = null;

  showTooltip(mouse:{x:number, y:number}, emberModel:any) : void {

    let popupData: any = {};

    if(emberModel instanceof DrawableClazzCommunication)
      popupData = this.buildCommunicationData(emberModel);

    popupData.entity = emberModel;

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
