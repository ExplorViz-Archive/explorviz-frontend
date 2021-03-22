import { enqueueTask } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import Configuration from 'explorviz-frontend/services/configuration';
import { getAllClassesInApplication } from 'explorviz-frontend/utils/application-helpers';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import computeDrawableClassCommunication, { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import THREE from 'three';
import VrApplicationObject3D from 'virtual-reality/utils/view-objects/application/vr-application-object-3d';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';

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

type RemoveApplicationCallback = (application: ApplicationObject3D) => Promise<boolean>;

export default class VrApplicationRenderer {
  debug = debugLogger('VrApplicationRender');

  readonly appCommRendering: AppCommunicationRendering;
  private closeButtonTexture: THREE.Texture;
  private configuration: Configuration;
  private font: THREE.Font;
  private landscapeData: LandscapeData;
  private onRemoveApplication: RemoveApplicationCallback;
  private worker: any;

  readonly applicationGroup: ApplicationGroup;
  readonly drawableClassCommunications: Map<string, DrawableClassCommunication[]>;

  constructor({
    appCommRendering,
    closeButtonTexture,
    configuration,
    font,
    landscapeData,
    onRemoveApplication,
    worker
  }: {
    appCommRendering: AppCommunicationRendering,
    closeButtonTexture: THREE.Texture,
    configuration: Configuration,
    font: THREE.Font,
    landscapeData: LandscapeData,
    onRemoveApplication: RemoveApplicationCallback,
    worker: any
  }) {
    this.appCommRendering = appCommRendering;
    this.closeButtonTexture = closeButtonTexture;
    this.configuration = configuration;
    this.font = font;
    this.landscapeData = landscapeData;
    this.onRemoveApplication = onRemoveApplication;
    this.worker = worker;

    this.applicationGroup = new ApplicationGroup();
    this.drawableClassCommunications = new Map();
  }

  addApplication(applicationModel: Application): Promise<ApplicationObject3D> {
    return new Promise((resolve) => {
      perform(this.addApplicationTask, applicationModel, resolve);
    });
  }

  @enqueueTask
  private *addApplicationTask(applicationModel: Application, callback?: (applicationObject3D: ApplicationObject3D) => void) {
    try {
      if (this.applicationGroup.hasApplication(applicationModel.pid)) {
        return;
      }

      const { dynamicLandscapeData } = this.landscapeData;

      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', applicationModel);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);

      const applicationObject3D = new VrApplicationObject3D(applicationModel, boxLayoutMap,
        dynamicLandscapeData);

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(applicationObject3D,
        this.configuration.applicationColors);

      this.updateDrawableClassCommunications(applicationObject3D);

      const drawableComm = this.drawableClassCommunications.get(applicationObject3D.dataModel.pid)!;

      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);

      // Add labels to application
      this.addLabels(applicationObject3D);

      // Scale application to a reasonable size to work with it
      const scalar = APPLICATION_SCALAR;
      applicationObject3D.scale.set(scalar, scalar, scalar);

      // Add close icon to application.
      const closeIcon = new CloseIcon({
        texture: this.closeButtonTexture,
        onClose: () => this.onRemoveApplication(applicationObject3D)
      });
      closeIcon.addToObject(applicationObject3D);

      this.applicationGroup.addApplication(applicationObject3D);

      if (callback) callback(applicationObject3D);
    } catch (e) {
      this.debug(e);
    }
  }

  private updateDrawableClassCommunications(applicationObject3D: ApplicationObject3D) {
    if (this.drawableClassCommunications.has(applicationObject3D.dataModel.pid)) {
      return;
    }

    const { structureLandscapeData } = this.landscapeData;
    const drawableClassCommunications = computeDrawableClassCommunication(
      structureLandscapeData,
      applicationObject3D.traces,
    );

    const allClasses = new Set(getAllClassesInApplication(applicationObject3D.dataModel));

    const communicationInApplication = drawableClassCommunications.filter(
      (comm) => allClasses.has(comm.sourceClass) || allClasses.has(comm.targetClass),
    );

    this.drawableClassCommunications.set(applicationObject3D.dataModel.pid,
      communicationInApplication);
  }

  /**
   * Adds labels to all box meshes of a given application
   */
  addLabels(applicationObject3D: ApplicationObject3D) {
    if (!this.font) { return; }

    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors.componentText;
    const foundationTextColor = this.configuration.applicationColors.foundationText;

    applicationObject3D.getBoxMeshes().forEach((mesh) => {
      /* Labeling is time-consuming. Thus, label only visible meshes incrementally
         as opposed to labeling all meshes up front (as done in application-rendering) */
      if (!mesh.visible) return;

      if (mesh instanceof ClazzMesh) {
        ApplicationLabeler.addClazzTextLabel(mesh, this.font, clazzTextColor);
      } else if (mesh instanceof ComponentMesh) {
        ApplicationLabeler.addBoxTextLabel(mesh, this.font, componentTextColor);
      } else if (mesh instanceof FoundationMesh) {
        ApplicationLabeler.addBoxTextLabel(mesh, this.font, foundationTextColor);
      }
    });
  }
}
