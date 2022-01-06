import GlimmerComponent from '@glimmer/component';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { action } from '@ember/object';
import ClazzCommuMeshDataModel from 'explorviz-frontend/view-objects/3d/application/utils/clazz-communication-mesh-data-model';

interface Args {
  communication: ClazzCommuMeshDataModel
  application: Application
  structureData: StructureLandscapeData
  showApplication(applicationId: string): void;
}

export default class CommunicationPopup extends GlimmerComponent<Args> {
  get calculateAggregatedRequestCount() {
    let aggregatedReqCount = 0;

    this.args.communication.drawableClassCommus.forEach((drawableClassComm) => {
      aggregatedReqCount += drawableClassComm.totalRequests;
    });
    return aggregatedReqCount;
  }

  @action
  loadApplication(app: Application) {
    this.args.showApplication(app.id);
  }
}
