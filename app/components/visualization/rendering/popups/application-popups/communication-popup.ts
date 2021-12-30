import GlimmerComponent from '@glimmer/component';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { getApplicationFromClass } from 'explorviz-frontend/utils/landscape-structure-helpers';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';

interface Args {
  communication: DrawableClassCommunication
  application: Application
  structureData: StructureLandscapeData
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

  get isCommuDistributed() {
    const currentVisualizedApplication = this.args.application;

    const sourceApp = getApplicationFromClass(
      this.args.structureData,
      this.args.communication.sourceClass,
    );

    const targetApp = getApplicationFromClass(
      this.args.structureData,
      this.args.communication.targetClass,
    );

    console.log(this.args.communication.sourceApplications);

    const isSourceAppDistributed = sourceApp !== currentVisualizedApplication;
    const isTargetAppDistributed = targetApp !== currentVisualizedApplication;

    if (isSourceAppDistributed) {
      return { descr: 'Source App Name', app: sourceApp };
    } if (isTargetAppDistributed) {
      return { descr: 'Target App Name', app: targetApp };
    }
    // source and target are in same app
    return null;
  }
}
