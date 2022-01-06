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
  doAppsContainCurrentApp(apps: (Application | undefined)[]) {
    if (!apps) {
      return false;
    }

    const currentAppId = this.args.application.id;

    const hasAtLeastOneDifferentApp = apps.some(
      (app: Application) => currentAppId !== app.id,
    );

    return hasAtLeastOneDifferentApp;
  }

  @action
  isCurrentVisualizedApp(app: Application) {
    return app.id === this.args.application.id;
  }

  @action
  loadApplication(app: Application) {
    this.args.showApplication(app.id);
  }
}
