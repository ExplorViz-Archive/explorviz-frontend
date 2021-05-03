import Service, { inject as service } from '@ember/service';
import { enqueueTask } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import Configuration from 'explorviz-frontend/services/configuration';
import { getAllClassesInApplication } from 'explorviz-frontend/utils/application-helpers';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import computeDrawableClassCommunication, { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import THREE from 'three';
import VrApplicationObject3D from 'virtual-reality/utils/view-objects/application/vr-application-object-3d';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import { isObjectClosedResponse, ObjectClosedResponse } from '../utils/vr-message/receivable/response/object-closed';
import VrAssetRepository from './vr-asset-repo';
import VrHighlightingService, { HightlightComponentArgs } from './vr-highlighting';
import VrMessageReceiver from './vr-message-receiver';
import VrMessageSender from './vr-message-sender';
import VrSceneService from './vr-scene';

// Scalar with which the application is scaled (evenly in all dimensions)
const APPLICATION_SCALAR = 0.01;

type LayoutData = {
  height: number;
  width: number;
  depth: number;
  positionX: number;
  positionY: number;
  positionZ: number;
};

export type AddApplicationArgs = {
  position?: THREE.Vector3;
  quaternion?: THREE.Quaternion;
  scale?: THREE.Vector3;
  openComponents?: Set<string>;
  highlightedComponents?: HightlightComponentArgs[];
};

export default class VrApplicationRenderer extends Service {
  debug = debugLogger('VrApplicationRender');

  @service('configuration')
  private configuration!: Configuration;

  @service('vr-asset-repo')
  private assetRepo!: VrAssetRepository;

  @service('vr-highlighting')
  private highlightingService!: VrHighlightingService;

  @service('vr-message-receiver')
  private receiver!: VrMessageReceiver;

  @service('vr-message-sender')
  private sender!: VrMessageSender;

  @service('vr-scene')
  private sceneService!: VrSceneService;

  @service()
  private worker!: any;

  private structureLandscapeData!: StructureLandscapeData;

  private dynamicLandscapeData!: DynamicLandscapeData;

  private openApplications: Map<string, ApplicationObject3D>;

  readonly applicationGroup: THREE.Group;

  readonly appCommRendering: AppCommunicationRendering;

  readonly drawableClassCommunications: Map<
  string,
  DrawableClassCommunication[]
  >;

  constructor(properties?: object) {
    super(properties);
    this.openApplications = new Map();

    this.applicationGroup = new THREE.Group();
    this.sceneService.scene.add(this.applicationGroup);

    this.appCommRendering = new AppCommunicationRendering(this.configuration);
    this.drawableClassCommunications = new Map();
  }

  async updateLandscapeData(
    structureLandscapeData: StructureLandscapeData,
    dynamicLandscapeData: DynamicLandscapeData,
  ): Promise<void> {
    this.structureLandscapeData = structureLandscapeData;
    this.dynamicLandscapeData = dynamicLandscapeData;

    this.removeAllApplicationsLocally();
    this.drawableClassCommunications.clear();
  }

  getApplicationInCurrentLandscapeById(id: string): Application | undefined {
    return getApplicationInLandscapeById(this.structureLandscapeData, id);
  }

  getApplicationById(id: string): ApplicationObject3D | undefined {
    return this.openApplications.get(id);
  }

  getOpenApplications(): ApplicationObject3D[] {
    return Array.from(this.openApplications.values());
  }

  isApplicationOpen(id: string): boolean {
    return this.openApplications.has(id);
  }

  async addApplication(
    applicationModel: Application,
    args: AddApplicationArgs = {},
  ): Promise<ApplicationObject3D> {
    const application = await this.addApplicationLocally(
      applicationModel,
      args,
    );
    this.sender.sendAppOpened(application);
    return application;
  }

  addApplicationLocally(
    applicationModel: Application,
    args: AddApplicationArgs = {},
  ): Promise<ApplicationObject3D> {
    return new Promise((resolve) => {
      perform(this.addApplicationTask, applicationModel, (application) => {
        this.initializeApplication(application, args);
        resolve(application);
      });
    });
  }

  private initializeApplication(
    application: ApplicationObject3D,
    args: AddApplicationArgs,
  ) {
    // Set initial position, rotation and scale.
    if (args.position) application.position.copy(args.position);
    if (args.quaternion) application.quaternion.copy(args.quaternion);
    if (args.scale) application.scale.copy(args.scale);

    // Expand initially open components.
    if (args.openComponents) {
      EntityManipulation.restoreComponentState(
        application,
        args.openComponents,
      );
      this.addLabels(application);
    }

    // Draw communication lines.
    const drawableComm = this.drawableClassCommunications.get(
      application.dataModel.instanceId,
    );
    if (drawableComm) {
      this.appCommRendering.addCommunication(application, drawableComm);
      Highlighting.updateHighlighting(application, drawableComm);
    }

    // Hightlight components.
    args.highlightedComponents?.forEach((highlightedComponent) => {
      this.highlightingService.hightlightComponentLocallyByTypeAndId(
        application,
        highlightedComponent,
      );
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
          this.removeApplicationLocally(application);
          resolve(true);
        },
      });
    });
  }

  removeApplicationLocally(application: ApplicationObject3D) {
    this.openApplications.delete(application.dataModel.instanceId);
    application.parent?.remove(application);
    application.children.forEach((child) => {
      if (child instanceof BaseMesh) {
        child.disposeRecursively();
      }
    });
  }

  removeAllApplicationsLocally() {
    this.openApplications.forEach((app) => this.removeApplicationLocally(app));
  }

  toggleComponent(
    componentMesh: ComponentMesh,
    applicationObject3D: ApplicationObject3D,
  ) {
    this.toggleComponentLocally(componentMesh, applicationObject3D);
    this.sender.sendComponentUpdate(
      applicationObject3D.dataModel.instanceId,
      componentMesh.dataModel.id,
      componentMesh.opened,
      false,
    );
  }

  toggleComponentLocally(
    componentMesh: ComponentMesh,
    applicationObject3D: ApplicationObject3D,
  ) {
    EntityManipulation.toggleComponentMeshState(
      componentMesh,
      applicationObject3D,
    );
    this.addLabels(applicationObject3D);
    this.highlightingService.updateHighlightingLocally(applicationObject3D);
  }

  closeAllComponents(applicationObject3D: ApplicationObject3D) {
    this.closeAllComponentsLocally(applicationObject3D);
    this.sender.sendComponentUpdate(
      applicationObject3D.dataModel.instanceId,
      '',
      false,
      true,
    );
  }

  closeAllComponentsLocally(applicationObject3D: ApplicationObject3D) {
    EntityManipulation.closeAllComponents(applicationObject3D);
    this.highlightingService.updateHighlightingLocally(applicationObject3D);
  }

  @enqueueTask
  private* addApplicationTask(
    applicationModel: Application,
    callback?: (applicationObject3D: ApplicationObject3D) => void,
  ) {
    try {
      if (this.isApplicationOpen(applicationModel.instanceId)) return;

      const layoutedApplication: Map<
      string,
      LayoutData
      > = yield this.worker.postMessage('city-layouter', applicationModel);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(
        layoutedApplication,
      );

      const applicationObject3D = new VrApplicationObject3D(
        applicationModel,
        boxLayoutMap,
        this.dynamicLandscapeData,
      );

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(
        applicationObject3D,
        this.configuration.applicationColors,
      );

      this.createDrawableClassCommunications(applicationObject3D);

      const drawableComm = this.drawableClassCommunications.get(
        applicationObject3D.dataModel.instanceId,
      )!;
      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);

      // Add labels to application
      this.addLabels(applicationObject3D);

      // Scale application to a reasonable size to work with it.
      applicationObject3D.scale.setScalar(APPLICATION_SCALAR);

      // Add close icon to application.
      const closeIcon = new CloseIcon({
        textures: this.assetRepo.closeIconTextures,
        onClose: () => this.removeApplication(applicationObject3D),
      });
      closeIcon.addToObject(applicationObject3D);

      this.applicationGroup.add(applicationObject3D);
      this.openApplications.set(
        applicationModel.instanceId,
        applicationObject3D,
      );

      if (callback) callback(applicationObject3D);
    } catch (e) {
      this.debug(e);
    }
  }

  private createDrawableClassCommunications(
    applicationObject3D: ApplicationObject3D,
  ) {
    if (
      this.drawableClassCommunications.has(
        applicationObject3D.dataModel.instanceId,
      )
    ) {
      return;
    }

    const drawableClassCommunications = computeDrawableClassCommunication(
      this.structureLandscapeData,
      applicationObject3D.traces,
    );

    const allClasses = new Set(
      getAllClassesInApplication(applicationObject3D.dataModel),
    );
    const communicationInApplication = drawableClassCommunications.filter(
      (comm) => allClasses.has(comm.sourceClass) || allClasses.has(comm.targetClass),
    );
    this.drawableClassCommunications.set(
      applicationObject3D.dataModel.instanceId,
      communicationInApplication,
    );
  }

  /**
   * Adds labels to all box meshes of a given application
   */
  private addLabels(applicationObject3D: ApplicationObject3D) {
    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors
      .componentText;
    const foundationTextColor = this.configuration.applicationColors
      .foundationText;

    applicationObject3D.getBoxMeshes().forEach((mesh) => {
      if (!this.assetRepo.font) return;
      // Labeling is time-consuming. Thus, label only visible meshes incrementally
      // as opposed to labeling all meshes up front (as done in application-rendering).
      if (mesh.visible) {
        if (mesh instanceof ClazzMesh) {
          ApplicationLabeler.addClazzTextLabel(
            mesh,
            this.assetRepo.font,
            clazzTextColor,
          );
        } else if (mesh instanceof ComponentMesh) {
          ApplicationLabeler.addBoxTextLabel(
            mesh,
            this.assetRepo.font,
            componentTextColor,
          );
        } else if (mesh instanceof FoundationMesh) {
          ApplicationLabeler.addBoxTextLabel(
            mesh,
            this.assetRepo.font,
            foundationTextColor,
          );
        }
      }
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-application-renderer': VrApplicationRenderer;
  }
}
