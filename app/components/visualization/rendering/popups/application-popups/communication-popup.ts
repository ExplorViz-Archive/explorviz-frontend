import GlimmerComponent from '@glimmer/component';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { getApplicationFromClass } from 'explorviz-frontend/utils/landscape-structure-helpers';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import { inject as service } from '@ember/service';

interface Args {
  communication: DrawableClassCommunication
}

export default class CommunicationPopup extends GlimmerComponent<Args> {
  @service('landscape-listener') landscapeListener!: LandscapeListener;

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

  get sourceApplication() {
    if (this.landscapeListener.latestStructureData) {
      return getApplicationFromClass(
        this.landscapeListener.latestStructureData, this.args.communication.sourceClass,
      );
    }
    return 'UNKNOWN';
  }
}
