import GlimmerComponent from '@glimmer/component';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { action } from '@ember/object';

interface Args {
  communication: DrawableClassCommunication
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

  get sourceAppsContainApp() {
    return this.doAppsContainCurrentApp(this.args.communication.sourceApplications);
  }

  get targetAppsContainApp() {
    return this.doAppsContainCurrentApp(this.args.communication.targetApplications);
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
