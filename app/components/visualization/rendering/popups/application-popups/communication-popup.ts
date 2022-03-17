import GlimmerComponent from '@glimmer/component';
import { StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import ClazzCommuMeshDataModel from 'explorviz-frontend/view-objects/3d/application/utils/clazz-communication-mesh-data-model';

interface Args {
  communication: ClazzCommuMeshDataModel
  structureData: StructureLandscapeData
  showApplication(applicationId: string): void;
}

export default class CommunicationPopup extends GlimmerComponent<Args> {
  get application() {
    return this.args.communication.application;
  }

  get calculateAggregatedRequestCount() {
    let aggregatedReqCount = 0;

    this.args.communication.drawableClassCommus.forEach((drawableClassComm) => {
      aggregatedReqCount += drawableClassComm.totalRequests;
    });
    return aggregatedReqCount;
  }
}
