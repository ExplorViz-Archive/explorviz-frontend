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
  get isBidirectional() {
    return this.args.communication.bidirectional;
  }

  get sourceClazz() {
    return this.args.communication.sourceClass.name;
  }

  get targetClazz() {
    return this.args.communication.targetClass.name;
  }

  get requests() {
    return this.args.communication.totalRequests;
  }

  get operationName() {
    return this.args.communication.operationName;
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
