import Service, { inject as service } from '@ember/service';
import { enqueueTask } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import Configuration from 'explorviz-frontend/services/configuration';
import { getAllClassesInApplication } from 'explorviz-frontend/utils/application-helpers';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import computeDrawableClassCommunication, { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import VrApplicationObject3D from 'virtual-reality/utils/view-objects/application/vr-application-object-3d';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import VrAssetRepository from "./vr-asset-repo";
import VrSceneService from "./vr-scene";
import VrMessageSender from "./vr-message-sender";
import VrMessageReceiver from "./vr-message-receiver";
import { isObjectClosedResponse, ObjectClosedResponse } from "../utils/vr-message/receivable/response/object-closed";

// Scalar with which the application is scaled (evenly in all dimensions)
const APPLICATION_SCALAR = 0.01;

type LayoutData = {
  height: number,
  width: number,
  depth: number,
  positionX: number,
  positionY: number,
  positionZ: number
};

export default class VrApplicationRenderer extends Service {
  debug = debugLogger('VrApplicationRender');

  @service('configuration') private configuration!: Configuration;
  @service('vr-asset-repo') private assetRepo!: VrAssetRepository;
  @service('vr-message-receiver') private receiver!: VrMessageReceiver;
  @service('vr-message-sender') private sender!: VrMessageSender;
  @service('vr-scene') private sceneService!: VrSceneService;
  @service() private worker!: any;

  private structureLandscapeData!: StructureLandscapeData;
  private dynamicLandscapeData!: DynamicLandscapeData;

  readonly applicationGroup: ApplicationGroup;
  readonly appCommRendering: AppCommunicationRendering;
  readonly drawableClassCommunications: Map<string, DrawableClassCommunication[]>;

  constructor(properties?: object) {
    super(properties);

    this.applicationGroup = new ApplicationGroup();
    this.sceneService.scene.add(this.applicationGroup);

    this.appCommRendering = new AppCommunicationRendering(this.configuration);
    this.drawableClassCommunications = new Map();
  }

  async updateLandscapeData(structureLandscapeData: StructureLandscapeData, dynamicLandscapeData: DynamicLandscapeData): Promise<void> {
    this.structureLandscapeData = structureLandscapeData;
    this.dynamicLandscapeData = dynamicLandscapeData;

    this.removeAllApplicationsLocally();
  }

  getApplicationInCurrentLandscapeById(id: string) {
    return getApplicationInLandscapeById(this.structureLandscapeData, id);
  }

  async addApplication(applicationModel: Application): Promise<ApplicationObject3D> {
    const application = await this.addApplicationLocally(applicationModel);
    if (application) this.sender.sendAppOpened(application);
    return application;
  }

  addApplicationLocally(applicationModel: Application): Promise<ApplicationObject3D> {
    return new Promise((resolve) => {
      perform(this.addApplicationTask, applicationModel, resolve);
    });
  }

  removeApplication(application: ApplicationObject3D): Promise<boolean> {
    return new Promise((resolve) => {
      // Ask backend to close the application.
      const nonce = this.sender.sendAppClosed(application.dataModel.instanceId);

      // Remove the application only when the backend allowed the application to be closed.
      this.receiver.awaitResponse({
        nonce,
        responseType: isObjectClosedResponse,
        onResponse: (response: ObjectClosedResponse) => {
          if (response.isSuccess) this.removeApplicationLocally(application);
          resolve(response.isSuccess);
        },
        onOffline: () => {
          this.removeApplicationLocally(application)
          resolve(true);
        }
      });
    });
  }

  removeApplicationLocally(application: ApplicationObject3D) {
    this.applicationGroup.removeApplicationById(application.dataModel.instanceId);
  }

  removeAllApplicationsLocally() {
    this.applicationGroup.clear();
  }

  @enqueueTask
  private *addApplicationTask(applicationModel: Application, callback?: (applicationObject3D: ApplicationObject3D) => void) {
    try {
      if (this.applicationGroup.hasApplication(applicationModel.instanceId)) {
        return;
      }

      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', applicationModel);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);

      const applicationObject3D = new VrApplicationObject3D(applicationModel, boxLayoutMap,
        this.dynamicLandscapeData);

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(applicationObject3D,
        this.configuration.applicationColors);

      this.updateDrawableClassCommunications(applicationObject3D);

      const drawableComm = this.drawableClassCommunications.get(applicationObject3D.dataModel.instanceId)!;

      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);

      // Add labels to application
      this.addLabels(applicationObject3D);

      // Scale application to a reasonable size to work with it
      const scalar = APPLICATION_SCALAR;
      applicationObject3D.scale.set(scalar, scalar, scalar);

      // Add close icon to application.
      const closeIcon = new CloseIcon({
        textures: this.assetRepo.closeIconTextures,
        onClose: () => this.removeApplication(applicationObject3D)
      });
      closeIcon.addToObject(applicationObject3D);

      this.applicationGroup.addApplication(applicationObject3D);

      if (callback) callback(applicationObject3D);
    } catch (e) {
      this.debug(e);
    }
  }

  private updateDrawableClassCommunications(applicationObject3D: ApplicationObject3D) {
    if (this.drawableClassCommunications.has(applicationObject3D.dataModel.instanceId)) {
      return;
    }

    const drawableClassCommunications = computeDrawableClassCommunication(
      this.structureLandscapeData,
      applicationObject3D.traces,
    );

    const allClasses = new Set(getAllClassesInApplication(applicationObject3D.dataModel));

    const communicationInApplication = drawableClassCommunications.filter(
      (comm) => allClasses.has(comm.sourceClass) || allClasses.has(comm.targetClass),
    );

    this.drawableClassCommunications.set(applicationObject3D.dataModel.instanceId,
      communicationInApplication);
  }

  /**
   * Adds labels to all box meshes of a given application
   */
  addLabels(applicationObject3D: ApplicationObject3D) {
    if (!this.assetRepo.font) { return; }

    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors.componentText;
    const foundationTextColor = this.configuration.applicationColors.foundationText;

    for (const mesh of applicationObject3D.getBoxMeshes()) {
      // Labeling is time-consuming. Thus, label only visible meshes incrementally
      // as opposed to labeling all meshes up front (as done in application-rendering).
      if (!mesh.visible) continue;

      if (mesh instanceof ClazzMesh) {
        ApplicationLabeler.addClazzTextLabel(mesh, this.assetRepo.font, clazzTextColor);
      } else if (mesh instanceof ComponentMesh) {
        ApplicationLabeler.addBoxTextLabel(mesh, this.assetRepo.font, componentTextColor);
      } else if (mesh instanceof FoundationMesh) {
        ApplicationLabeler.addBoxTextLabel(mesh, this.assetRepo.font, foundationTextColor);
      }
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-application-renderer': VrApplicationRenderer;
  }
}
