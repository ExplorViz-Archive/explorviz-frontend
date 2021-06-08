import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import THREE, { MathUtils } from 'three';
import { tracked } from '@glimmer/tracking';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import Configuration from 'explorviz-frontend/services/configuration';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import Interaction from 'explorviz-frontend/utils/interaction';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import {
  Class, Package, Application, Node,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import LocalVrUser from 'explorviz-frontend/services/local-vr-user';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import DeltaTime from 'virtual-reality/services/delta-time';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import CommunicationArrowMesh from 'explorviz-frontend/view-objects/3d/application/communication-arrow-mesh';
import ArSettings from 'virtual-reality/services/ar-settings';
import VrApplicationRenderer from 'virtual-reality/services/vr-application-renderer';
import VrAssetRepository from 'virtual-reality/services/vr-asset-repo';
import TimestampRepository, { Timestamp } from 'explorviz-frontend/services/repos/timestamp-repository';
import VrTimestampService from 'virtual-reality/services/vr-timestamp';
import VrHighlightingService from 'virtual-reality/services/vr-highlighting';
import ArZoomHandler from 'virtual-reality/utils/ar-helpers/ar-zoom-handler';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';
import VrSceneService from 'virtual-reality/services/vr-scene';
import VrLandscapeRenderer from 'virtual-reality/services/vr-landscape-renderer';
import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import { SelfConnectedMessage } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import { ForwardedMessage } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping_update';
import { TimestampUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/timetsamp_update';
import { UserDisconnectedMessage } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { InitialLandscapeMessage } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import WebSocketService from 'virtual-reality/services/web-socket';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import * as VrPoses from 'virtual-reality/utils/vr-helpers/vr-poses';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import HeatmapConfiguration, { Metric } from 'heatmap/services/heatmap-configuration';
import applySimpleHeatOnFoundation, { addHeatmapHelperLine, computeHeatMapViewPos, removeHeatmapHelperLines } from 'heatmap/utils/heatmap-helper';
import { invokeRecoloring, setColorValues } from 'heatmap/utils/array-heatmap';
import { simpleHeatmap } from 'heatmap/utils/simple-heatmap';
import { updateHighlighting } from 'explorviz-frontend/utils/application-rendering/highlighting';
import { perform } from 'ember-concurrency-ts';
import VrRoomSerializer from '../services/vr-room-serializer';

interface Args {
  readonly landscapeData: LandscapeData;
  readonly font: THREE.Font;
  readonly components: string[];
  readonly showDataSelection: boolean;
  readonly selectedTimestampRecords: Timestamp[];
  addComponent(componentPath: string): void; // is passed down to the viz navbar
  removeComponent(component: string): void;
  openDataSelection(): void;
  closeDataSelection(): void;
}

type DataModel = Node | Application |Package | Class | DrawableClassCommunication;

type PopupData = {
  id: number,
  posX: number,
  posY: number,
  isPinned: boolean,
  entity: DataModel
};

declare const THREEx: any;

export default class ArRendering extends Component<Args> implements VrMessageListener {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  deltaTimeService!: DeltaTime;

  @service('heatmap-configuration')
  heatmapConf!: HeatmapConfiguration;

  @service('vr-highlighting')
  private highlightingService!: VrHighlightingService;

  @service('ar-settings')
  arSettings!: ArSettings;

  @service('vr-message-sender')
  private sender!: VrMessageSender;

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  @service('repos/timestamp-repository')
  private timestampRepo!: TimestampRepository;

  @service('vr-landscape-renderer')
  private vrLandscapeRenderer!: VrLandscapeRenderer;

  @service('vr-message-receiver')
  private receiver!: VrMessageReceiver;

  @service('vr-scene')
  private sceneService!: VrSceneService;

  @service('vr-timestamp')
  private timestampService!: VrTimestampService;

  @service('vr-application-renderer')
  private vrApplicationRenderer!: VrApplicationRenderer;

  @service('vr-asset-repo')
  private assetRepo!: VrAssetRepository;

  @service('vr-room-serializer')
  private roomSerializer!: VrRoomSerializer;

  @service('web-socket')
  private webSocket!: WebSocketService;

  @service()
  worker!: any;

  debug = debugLogger('ArRendering');

  // Used to register (mouse) events
  interaction!: Interaction;

  outerDiv!: HTMLElement;

  canvas!: HTMLCanvasElement;

  arZoomHandler: ArZoomHandler | undefined;

  arToolkitSource: any;

  arToolkitContext: any;

  landscapeMarker = new THREE.Group();

  applicationMarkers: THREE.Group[] = [];

  private willDestroyController: AbortController = new AbortController();

  pinchedObj: THREE.Object3D | ApplicationObject3D | null = null;

  rotatedObj: THREE.Object3D | null | undefined;

  pannedObject: THREE.Object3D | null | undefined;

  @tracked
  popupDataMap: Map<number, PopupData> = new Map();

  @tracked
  hammerInteraction: HammerInteraction;

  @tracked
  showSettings = false;

  // #endregion CLASS FIELDS AND GETTERS

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.vrLandscapeRenderer.setLargestSide(2);

    this.hammerInteraction = HammerInteraction.create();

    AlertifyHandler.setAlertifyPosition('bottom-center');
    document.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  // #region COMPONENT AND SCENE INITIALIZATION

  /**
     * Calls all three related init functions and adds the three
     * performance panel if it is activated in user settings
     */
  private initRendering() {
    this.initServices();
    this.initRenderer();
    this.initCamera();
    this.configureScene();
    this.initArJs();
    this.initCameraCrosshair();
    this.initHammerJS();
    this.initInteraction();
    this.initWebSocket();
  }

  updateArToolkit() {
    // update artoolkit on every frame
    if (this.arToolkitSource.ready !== false) {
      this.arToolkitContext.update(this.arToolkitSource.domElement);
    }
  }

  private initServices() {
    this.debug('Initializing services...');

    // Use given font for landscape and application rendering.
    this.assetRepo.font = this.args.font;
    this.remoteUsers.displayHmd = false;

    // Initialize timestamp and landscape data. If no timestamp is selected,
    // the latest timestamp is used. When there is no timestamp, we fall back
    // to the current time.
    if (this.args.landscapeData) {
      const { landscapeToken } = this.args.landscapeData.structureLandscapeData;
      const timestamp = this.args.selectedTimestampRecords[0]?.timestamp
        || this.timestampRepo.getLatestTimestamp(landscapeToken)?.timestamp
        || new Date().getTime();
      this.timestampService.setTimestampLocally(
        timestamp,
        this.args.landscapeData.structureLandscapeData,
        this.args.landscapeData.dynamicLandscapeData,
      );
    } else {
      AlertifyHandler.showAlertifyWarning('No landscape found!');
    }
  }

  /**
     * Creates a PerspectiveCamera according to canvas size and sets its initial position
     */
  private initCamera() {
    // Set camera properties
    this.localUser.defaultCamera = new THREE.PerspectiveCamera();
    this.sceneService.scene.add(this.localUser.defaultCamera);

    this.arZoomHandler = new ArZoomHandler(this.localUser.defaultCamera, this.outerDiv);
  }

  private initCameraCrosshair() {
    const geometry = new THREE.RingGeometry(0.0001, 0.0003, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const crosshairMesh = new THREE.Mesh(geometry, material);

    this.localUser.defaultCamera.add(crosshairMesh);
    // Position just in front of camera
    crosshairMesh.position.z = -0.1;
  }

  private initHammerJS() {
    this.hammerInteraction.setupHammer(this.canvas, 500);

    this.hammerInteraction.on('lefttap', () => {
      this.handleSecondaryCrosshairInteraction();
    });

    this.hammerInteraction.on('doubletap', () => {
      this.handlePrimaryCrosshairInteraction();
    });

    this.hammerInteraction.on('press', () => {
      this.handleInfoInteraction();
    });

    this.hammerInteraction.on('pinchstart', () => {
      const intersection = this.interaction.raycastCanvasCenter();
      const pinchObject = intersection?.object?.parent;

      if (pinchObject instanceof LandscapeObject3D || pinchObject instanceof ApplicationObject3D) {
        this.pinchedObj = pinchObject;
      }
    });

    this.hammerInteraction.on('pinch', (deltaScaleInPercent: number) => {
      if (!this.pinchedObj) return;

      this.pinchedObj.scale.copy(this.pinchedObj.scale.multiplyScalar(1 + deltaScaleInPercent));
    });

    this.hammerInteraction.on('pinchend', () => {
      this.pinchedObj = null;
    });

    this.hammerInteraction.on('rotatestart', () => {
      const intersection = this.interaction.raycastCanvasCenter();
      this.rotatedObj = intersection?.object?.parent;
    });

    this.hammerInteraction.on('rotate', (deltaRotation: number) => {
      if (this.rotatedObj instanceof LandscapeObject3D) {
        this.rotatedObj.rotation.z += deltaRotation * MathUtils.DEG2RAD;
      } else if (this.rotatedObj instanceof ApplicationObject3D) {
        this.rotatedObj.rotation.y += deltaRotation * MathUtils.DEG2RAD;
      }
    });

    this.hammerInteraction.on('rotateend', () => {
      this.rotatedObj = null;
    });

    this.hammerInteraction.on('panstart', () => {
      const intersection = this.interaction.raycastCanvasCenter();
      this.pannedObject = intersection?.object?.parent;
    });

    this.hammerInteraction.on('panning', (delta: {x: number, y: number}) => {
      if (this.pannedObject instanceof LandscapeObject3D) {
        this.pannedObject.position.x += delta.x * 0.0045;
        this.pannedObject.position.z += delta.y * 0.0045;
      }

      if (this.pannedObject instanceof ApplicationObject3D) {
        this.pannedObject.position.x += delta.x * 0.0045;
        this.pannedObject.position.z += delta.y * 0.0045;
      }
    });
  }

  /**
  * Initiates a WebGLRenderer
  */
  private initRenderer() {
    this.localUser.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.canvas,
    });

    this.localUser.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    this.localUser.renderer.setSize(this.outerDiv.clientWidth, this.outerDiv.clientHeight);
  }

  /**
   * Binds this context to all event handling functions and
   * passes them to a newly created Interaction object
   */
  private initInteraction() {
    this.interaction = new Interaction(this.canvas, this.localUser.defaultCamera,
      this.localUser.renderer,
      this.getIntersectableObjects(), {}, ArRendering.raycastFilter);

    // Add key listener for room positioning
    window.onkeydown = (event: any) => {
      this.handleKeyboard(event);
    };
  }

  private configureScene() {
    this.sceneService.setSceneTransparent();
    this.sceneService.removeSkylight();
  }

  private async initWebSocket() {
    this.debug('Initializing websocket...');

    this.webSocket.socketCloseCallback = () => this.onSelfDisconnected();
    this.receiver.addMessageListener(this);
  }

  private getIntersectableObjects() {
    const intersectableObjects: THREE.Object3D[] = [this.vrLandscapeRenderer.landscapeObject3D];

    this.applicationMarkers.forEach((appMarker) => {
      intersectableObjects.push(appMarker);
    });

    return intersectableObjects;
  }

  static raycastFilter(intersection: THREE.Intersection) {
    return !(intersection.object instanceof LabelMesh || intersection.object instanceof LogoMesh);
  }

  private initArJs() {
    this.initArJsCamera();

    // handle resize event
    window.addEventListener('resize', () => {
      this.resize(this.outerDiv);
    });

    /// /////////////////////////////////////////////////////////
    // setup arToolkitContext
    /// /////////////////////////////////////////////////////////

    // create atToolkitContext
    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'ar_data/camera_para.dat',
      detectionMode: 'mono',
    });

    // copy projection matrix to camera when initialization complete
    this.arToolkitContext.init(() => {
      this.localUser.defaultCamera.projectionMatrix.copy(
        this.arToolkitContext.getProjectionMatrix(),
      );
      this.localUser.defaultCamera.aspect = 1.33;
      this.localUser.defaultCamera.fov = 44;
      this.localUser.defaultCamera.updateProjectionMatrix();
    });

    this.landscapeMarker.add(this.vrLandscapeRenderer.landscapeObject3D);
    this.sceneService.scene.add(this.landscapeMarker);

    // Init controls for camera
    // eslint-disable-next-line
    new THREEx.ArMarkerControls(this.arToolkitContext, this.landscapeMarker, {
      type: 'pattern',
      patternUrl: 'ar_data/pattern-angular_L_thick.patt',
    });

    const applicationMarkerNames = ['pattern-angular_1', 'pattern-angular_2', 'pattern-angular_3', 'pattern-angular_4', 'pattern-angular_5'];

    applicationMarkerNames.forEach((markerName) => {
      const applicationMarker = new THREE.Group();
      this.sceneService.scene.add(applicationMarker);
      this.applicationMarkers.push(applicationMarker);

      // Init controls for camera
      // eslint-disable-next-line
      new THREEx.ArMarkerControls(this.arToolkitContext, applicationMarker, {
        type: 'pattern',
        patternUrl: `ar_data/${markerName}.patt`,
      });
    });
  }

  initArJsCamera(width = 640, height = 480) {
    ArRendering.cleanUpAr();

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
      sourceWidth: width,
      sourceHeight: height,
    });

    this.arToolkitSource.init(() => {
      setTimeout(() => {
        this.resize(this.outerDiv);
      }, 1000);
    });

    // Adapt aspect and fov to other parameters
    this.localUser.defaultCamera.aspect = width / height;
    this.localUser.defaultCamera.fov = 44;
    this.localUser.defaultCamera.updateProjectionMatrix();
  }
  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region ACTIONS

  @action
  async outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.outerDiv = outerDiv;

    this.initRendering();

    this.resize(outerDiv);

    // Initiate rendering
    this.animate = this.animate.bind(this);
    this.animate();
  }

  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug('Canvas inserted');

    this.canvas = canvas;

    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }

  /**
     * Call this whenever the canvas is resized. Updated properties of camera
     * and renderer.
     *
     * @param outerDiv HTML element containing the canvas
     */
  @action
  resize(outerDiv: HTMLElement) {
    this.localUser.renderer.setSize(outerDiv.clientWidth, outerDiv.clientHeight);
    if (!this.arToolkitContext) return;

    this.arToolkitSource.onResizeElement();
    this.arToolkitSource.copyElementSizeTo(this.localUser.renderer.domElement);

    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
    }
  }

  @action
  updateMetric(metric: Metric) {
    this.heatmapConf.set('selectedMetric', metric);
    this.heatmapConf.triggerMetricUpdate();

    this.applyHeatmap();
  }

  @action
  handlePrimaryCrosshairInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (intersection) {
      this.handlePrimaryInputOn(intersection);
    }
  }

  @action
  handleSecondaryCrosshairInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (intersection) {
      this.handleSecondaryInputOn(intersection);
    }
  }

  @action
  handleZoomActivation() {
    this.arZoomHandler?.enableZoom();
  }

  @action
  handleZoomDeactivation() {
    this.arZoomHandler?.disableZoom();
  }

  @action
  async handleOpenAllComponents() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (!(intersection?.object.parent instanceof ApplicationObject3D)) {
      return;
    }

    const applicationObject3D = intersection.object.parent;

    this.vrApplicationRenderer.openAllComponents(applicationObject3D);
  }

  @action
  async handleHeatmapToggle() {
    const currentHeatmapAppId = this.heatmapConf.currentApplication?.id;
    this.removeHeatmap();

    const intersection = this.interaction.raycastCanvasCenter();

    if (intersection && intersection.object.parent instanceof ApplicationObject3D
      && currentHeatmapAppId !== intersection.object.parent.id) {
      const applicationObject3D = intersection.object.parent;
      perform(this.vrApplicationRenderer.calculateHeatmapTask, applicationObject3D, () => {
        this.applyHeatmap();
      });
    }
  }

  @action
  handleInfoInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (!intersection) {
      this.removeUnpinnedPopups();
      return;
    }

    const mesh = intersection.object;

    // Show information as popup is mouse stopped on top of a mesh
    if ((mesh instanceof NodeMesh || mesh instanceof ApplicationMesh
      || mesh instanceof ClazzMesh || mesh instanceof ComponentMesh
      || mesh instanceof ClazzCommunicationMesh)) {
      // Remove popup if it is already opened at default position
      if (this.popupDataMap.has(mesh.id) && !this.popupDataMap.get(mesh.id)?.isPinned) {
        this.removeUnpinnedPopups();
      } else {
        this.removeUnpinnedPopups();

        const popupData = {
          id: mesh.id,
          isPinned: false,
          posX: this.canvas.width / 2,
          posY: this.canvas.height / 2,
          entity: mesh.dataModel,
        };

        this.popupDataMap.set(mesh.id, popupData);
        this.popupDataMap = new Map(this.popupDataMap);
      }
    }
  }

  @action
  toggleSettingsPane() {
    this.args.openDataSelection();
  }

  @action
  updateColors() {
    this.sceneService.scene.traverse((object3D) => {
      if (object3D instanceof BaseMesh) {
        object3D.updateColor();
        // Special case because communication arrow is no base mesh
      } else if (object3D instanceof CommunicationArrowMesh) {
        object3D.updateColor(this.configuration.applicationColors.communicationArrow);
      }
    });
  }

  // #endregion ACTIONS

  // #region MOUSE & KEYBOARD EVENT HANDLER

  @action
  handleDoubleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    this.handlePrimaryInputOn(intersection);
  }

  @action
  handleSingleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    this.handleSecondaryInputOn(intersection);
  }

  handleKeyboard(event: any) {
    // Handle keys
    switch (event.key) {
      case 'c':
        this.initArJsCamera(1920, 1080);
        break;
      /*
      case 'm':
        this.localUser.defaultCamera.aspect += 0.05;
        this.localUser.defaultCamera.updateProjectionMatrix();
        console.log('Aspect: ', this.localUser.defaultCamera.aspect);
        break;
      case 'n':
        this.localUser.defaultCamera.aspect -= 0.05;
        this.localUser.defaultCamera.updateProjectionMatrix();
        console.log('Aspect: ', this.localUser.defaultCamera.aspect);
        break;
      case 'k':
        this.localUser.defaultCamera.fov += 0.05;
        this.localUser.defaultCamera.updateProjectionMatrix();
        console.log('Fov: ', this.localUser.defaultCamera.fov);
        break;
      case 'j':
        this.localUser.defaultCamera.fov -= 0.05;
        this.localUser.defaultCamera.updateProjectionMatrix();
        console.log('Fov: ', this.localUser.defaultCamera.fov);
        break;
      */
      default:
        break;
    }
  }

  // #endregion MOUSE & KEYBOARD EVENT HANDLER

  // #region RENDERING

  /**
   * Sends a message if a given interval (in seconds) has passed to keep websocket alive
   */
  private sendKeepAliveMessage(interval = 1) {
    if (this.deltaTimeService.getCurrentDeltaTime() > interval) {
      this.deltaTimeService.update();

      // Send camera pose as dummy message
      const cameraPose = VrPoses.getCameraPose(this.localUser.defaultCamera);
      this.sender.sendPoseUpdate(cameraPose);
    }
  }

  render() {
    this.localUser.renderer.render(this.sceneService.scene, this.localUser.defaultCamera);

    this.arZoomHandler?.renderZoomCamera(this.localUser.renderer, this.sceneService.scene);
  }

  animate() {
    if (this.isDestroyed) {
      return;
    }

    requestAnimationFrame(this.animate);
    // Update time dependent services

    if (this.webSocket.isWebSocketOpen()) {
      this.sendKeepAliveMessage();
    }

    this.remoteUsers.updateRemoteUsers(this.deltaTimeService.getDeltaTime());

    this.updateArToolkit();

    this.render();
  }

  // #endregion RENDERING

  // #region APLICATION RENDERING

  async addApplication(applicationModel: Application) {
    if (applicationModel.packages.length === 0) {
      const message = `Sorry, there is no information for application <b>
        ${applicationModel.name}</b> available.`;

      AlertifyHandler.showAlertifyWarning(message);
    } else if (this.vrApplicationRenderer.isApplicationOpen(applicationModel.id)) {
      // ToDo: Add info about occupied marker
      AlertifyHandler.showAlertifyWarning('Application already opened.');
    } else {
      // data available => open application-rendering
      AlertifyHandler.closeAlertifyMessages();

      for (let i = 0; i < this.applicationMarkers.length; i++) {
        if (this.applicationMarkers[i].children.length === 0) {
          break;
        } else if (i === (this.applicationMarkers.length - 1)) {
          AlertifyHandler.showAlertifyWarning('All markers are occupied.');
          return;
        }
      }

      const applicationObject3D = await this.vrApplicationRenderer
        .addApplication(applicationModel, {});

      this.addLocalApplicationToMarker(applicationObject3D);
    }
  }

  addLocalApplicationToMarker(applicationObject3D: ApplicationObject3D) {
    // Set default scale such that application approximately fits on the printed marker
    applicationObject3D.setLargestSide(1.5);

    this.addApplicationToMarker(applicationObject3D);
  }

  addApplicationToMarker(applicationObject3D: ApplicationObject3D) {
    applicationObject3D.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0),
      90 * THREE.MathUtils.DEG2RAD);

    if (!applicationObject3D.highlightedEntity) {
      applicationObject3D.setBoxMeshOpacity(this.arSettings.applicationOpacity);
    }

    const applicationModel = applicationObject3D.dataModel;

    for (let i = 0; i < this.applicationMarkers.length; i++) {
      if (this.applicationMarkers[i].children.length === 0) {
        this.applicationMarkers[i].add(applicationObject3D);

        const message = `Application '${applicationModel.name}' successfully opened <br>
          on marker #${i + 1}.`;

        AlertifyHandler.showAlertifySuccess(message);

        break;
      }
    }
  }

  // #endregion APPLICATION RENDERING

  // #region HEATMAP

  @action
  applyHeatmap() {
    const applicationObject3D = this.heatmapConf.currentApplication;

    if (!this.heatmapConf.latestClazzMetrics || !this.heatmapConf.latestClazzMetrics.firstObject
      || !applicationObject3D) {
      AlertifyHandler.showAlertifyError('No metrics available.');
      return;
    }

    // Selected first metric if none is selected yet
    if (!this.heatmapConf.selectedMetric) {
      this.heatmapConf.selectedMetric = this.heatmapConf.latestClazzMetrics.firstObject;
    }

    const { selectedMetric } = this.heatmapConf;

    // Avoid unwanted reflections in heatmap mode
    this.sceneService.setAuxiliaryLightVisibility(false);

    applicationObject3D.setOpacity(0.1);

    const foundationMesh = applicationObject3D
      .getBoxMeshbyModelId(applicationObject3D.dataModel.id);

    if (!(foundationMesh instanceof FoundationMesh)) {
      return;
    }

    let colorMap: number[];
    let simpleHeatMap: any;
    let canvas: any;

    if (!this.heatmapConf.useSimpleHeat) {
      const { depthSegments, widthSegments } = foundationMesh.geometry.parameters;
      // Compute face numbers of top side of the cube
      const size = widthSegments * depthSegments * 2;
      // Prepare color map with same size as the surface of the foundation topside
      colorMap = new Array(size).fill(0);
    } else {
      canvas = document.createElement('canvas');
      canvas.width = foundationMesh.width;
      canvas.height = foundationMesh.depth;
      simpleHeatMap = simpleHeatmap(selectedMetric.max, canvas,
        this.heatmapConf.getSimpleHeatGradient(),
        this.heatmapConf.heatmapRadius, this.heatmapConf.blurRadius);
    }

    const foundationWorldPosition = new THREE.Vector3();

    foundationMesh.getWorldPosition(foundationWorldPosition);

    removeHeatmapHelperLines(applicationObject3D);

    const boxMeshes = applicationObject3D.getBoxMeshes();

    boxMeshes.forEach((boxMesh) => {
      if (boxMesh instanceof ClazzMesh) {
        this.heatmapClazzUpdate(applicationObject3D, boxMesh.dataModel, foundationMesh,
          simpleHeatMap, colorMap);
      }
    });

    if (!this.heatmapConf.useSimpleHeat) {
      const color = 'rgb(255, 255, 255)';
      foundationMesh.material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(color),
        vertexColors: true,
      });

      invokeRecoloring(colorMap!, foundationMesh, selectedMetric.max,
        this.heatmapConf.getArrayHeatGradient());
    } else {
      simpleHeatMap.draw(0.0);

      applySimpleHeatOnFoundation(foundationMesh, canvas);
    }

    this.heatmapConf.heatmapActive = true;
    this.heatmapConf.currentApplication = applicationObject3D;
  }

  removeHeatmap() {
    const applicationObject3D = this.heatmapConf.currentApplication;
    if (!applicationObject3D) return;

    this.sceneService.addSkylight();
    applicationObject3D.setOpacity(1);
    removeHeatmapHelperLines(applicationObject3D);

    const foundationMesh = applicationObject3D
      .getBoxMeshbyModelId(applicationObject3D.dataModel.id);

    if (foundationMesh && foundationMesh instanceof FoundationMesh) {
      foundationMesh.setDefaultMaterial();
    }

    const comms = this.vrApplicationRenderer.drawableClassCommunications
      .get(applicationObject3D.dataModel.id);
    if (comms) {
      updateHighlighting(applicationObject3D, comms);
    }

    this.heatmapConf.heatmapActive = false;
    this.heatmapConf.currentApplication = null;
  }

  heatmapClazzUpdate(applicationObject3D: ApplicationObject3D,
    clazz: Class, foundationMesh: FoundationMesh, simpleHeatMap: any,
    colorMap: number[]) {
    // Calculate center point of the clazz floor. This is used for computing the corresponding
    // face on the foundation box.
    const clazzMesh = applicationObject3D.getBoxMeshbyModelId(clazz.id) as
          ClazzMesh | undefined;

    if (!clazzMesh || !this.heatmapConf.selectedMetric) {
      return;
    }

    const heatmapValues = this.heatmapConf.selectedMetric.values;
    const heatmapValue = heatmapValues.get(clazz.id);

    if (!heatmapValue) return;

    const raycaster = new THREE.Raycaster();
    const { selectedMode } = this.heatmapConf;

    const clazzPos = clazzMesh.position.clone();
    const viewPos = computeHeatMapViewPos(foundationMesh, this.localUser.defaultCamera);

    clazzPos.y -= clazzMesh.height / 2;

    applicationObject3D.localToWorld(clazzPos);

    // The vector from the viewPos to the clazz floor center point
    const rayVector = clazzPos.clone().sub(viewPos);

    // Following the ray vector from the floor center get the intersection with the foundation.
    raycaster.set(clazzPos, rayVector.normalize());

    const firstIntersection = raycaster.intersectObject(foundationMesh, false)[0];

    const worldIntersectionPoint = firstIntersection.point.clone();
    applicationObject3D.worldToLocal(worldIntersectionPoint);

    if (this.heatmapConf.useHelperLines) {
      addHeatmapHelperLine(applicationObject3D, clazzPos, worldIntersectionPoint);
    }

    // Compute color only for the first intersection point for consistency if one was found.
    if (firstIntersection) {
      if (!this.heatmapConf.useSimpleHeat && firstIntersection.faceIndex) {
        // The number of faces at front and back of the foundation mesh,
        // i.e. the starting index for the faces on top.
        const depthOffset = foundationMesh.geometry.parameters.depthSegments * 4;
        if (selectedMode === 'aggregatedHeatmap') {
          setColorValues(firstIntersection.faceIndex - depthOffset,
            heatmapValue - (this.heatmapConf.largestValue / 2),
            colorMap,
            foundationMesh);
        } else {
          setColorValues(firstIntersection.faceIndex - depthOffset,
            heatmapValue,
            colorMap,
            foundationMesh);
        }
      } else if (this.heatmapConf.useSimpleHeat && firstIntersection.uv) {
        const xPos = firstIntersection.uv.x * foundationMesh.width;
        const zPos = (1 - firstIntersection.uv.y) * foundationMesh.depth;
        if (selectedMode === 'aggregatedHeatmap') {
          simpleHeatMap.add([xPos, zPos, heatmapValues.get(clazz.id)]);
        } else {
          simpleHeatMap.add([xPos, zPos,
            heatmapValue + (this.heatmapConf.largestValue / 2)]);
        }
      }
    }
  }

  // #endregion HEATMAP

  // #region UTILS

  private handlePrimaryInputOn(intersection: THREE.Intersection) {
    const self = this;
    const { object } = intersection;

    function handleApplicationObject(appObject: THREE.Object3D) {
      if (!(appObject.parent instanceof ApplicationObject3D)) return;

      if (appObject instanceof ComponentMesh) {
        self.vrApplicationRenderer.toggleComponent(
          appObject,
          appObject.parent,
        );
      } else if (appObject instanceof CloseIcon) {
        appObject.close().then((closedSuccessfully: boolean) => {
          if (!closedSuccessfully) AlertifyHandler.showAlertifyError('Application could not be closed');
        });
      } else if (appObject instanceof FoundationMesh) {
        self.vrApplicationRenderer.closeAllComponents(appObject.parent);
      }

      if (self.heatmapConf.heatmapActive) {
        appObject.parent.setOpacity(0.1);
      }
    }

    if (object instanceof ApplicationMesh) {
      this.addApplication(object.dataModel);
    // Handle application hits
    } else if (object.parent instanceof ApplicationObject3D) {
      handleApplicationObject(object);
    }
  }

  private handleSecondaryInputOn(intersection: THREE.Intersection) {
    const { object } = intersection;
    if (object.parent instanceof ApplicationObject3D) {
      this.highlightingService.highlightComponent(
        object.parent,
        object,
      );

      if (this.heatmapConf.heatmapActive) {
        object.parent.setOpacity(0.1);
      }
    }
  }

  static cleanUpAr() {
    // Remove video and stop corresponding stream
    const video = document.getElementById('arjs-video');

    if (video instanceof HTMLVideoElement) {
      document.body.removeChild(video);

      const stream = video.srcObject;

      if (stream instanceof MediaStream) {
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
      }
    }
  }

  removeUnpinnedPopups() {
    this.popupDataMap.forEach((value, key) => {
      if (!value.isPinned) {
        this.popupDataMap.delete(key);
      }
    });

    this.popupDataMap = new Map(this.popupDataMap);
  }

  @action
  keepPopupOpen(id: number) {
    const popupData = this.popupDataMap.get(id);
    if (popupData) {
      popupData.isPinned = true;
    }
  }

  @action
  setPopupPosition(id: number, posX: number, posY: number) {
    const popupData = this.popupDataMap.get(id);
    if (popupData) {
      popupData.posX = posX;
      popupData.posY = posY;
    }
  }

  @action
  closePopup(id: number) {
    this.popupDataMap.delete(id);
    this.popupDataMap = new Map(this.popupDataMap);
  }

  willDestroy() {
    // Reset services.
    this.localUser.reset();
    this.vrLandscapeRenderer.resetService();
    this.vrApplicationRenderer.removeAllApplicationsLocally();
    this.sceneService.addSkylight();

    // Remove event listers.
    this.receiver.removeMessageListener(this);
    this.willDestroyController.abort();

    // Reset AR and position of alerts
    ArRendering.cleanUpAr();
    AlertifyHandler.setAlertifyPosition('bottom-right');
  }

  // #endregion UTILS

  // #region HANDLING MESSAGES

  onSelfDisconnected(event?: any) {
    if (this.localUser.isConnecting) {
      AlertifyHandler.showAlertifyMessage('AR backend service not responding');
    } else if (event) {
      switch (event.code) {
        case 1000: // Normal Closure
          AlertifyHandler.showAlertifyMessage('Successfully disconnected');
          break;
        case 1006: // Abnormal closure
          AlertifyHandler.showAlertifyMessage('AR backend service closed abnormally');
          break;
        default:
          AlertifyHandler.showAlertifyMessage('Unexpected disconnect');
      }
    }

    // Remove remote users.
    this.remoteUsers.removeAllRemoteUsers();

    // Reset highlighting colors.
    this.vrApplicationRenderer.getOpenApplications().forEach((application) => {
      application.setHighlightingColor(
        this.configuration.applicationColors.highlightedEntity,
      );
    });

    this.localUser.disconnect();
  }

  /**
   * After succesfully connecting to the backend, create and spawn other users.
   */
  onSelfConnected({ self, users }: SelfConnectedMessage): void {
    // Create User model for all users and add them to the users map by
    // simulating the event of a user connecting.
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      this.onUserConnected(
        {
          event: USER_CONNECTED_EVENT,
          id: userData.id,
          name: userData.name,
          color: userData.color,
          position: userData.position,
          quaternion: userData.quaternion,
        },
        false,
      );
    }

    // Initialize local user.
    this.localUser.connected({
      id: self.id,
      name: self.name,
      color: new THREE.Color(...self.color),
    });
  }

  onUserConnected(
    {
      id, name, color, position, quaternion,
    }: UserConnectedMessage,
    showConnectMessage = true,
  ): void {
    const remoteUser = new RemoteVrUser({
      userName: name,
      userId: id,
      color: new THREE.Color(...color),
      state: 'online',
      localUser: this.localUser,
    });
    this.remoteUsers.addRemoteUser(remoteUser, { position, quaternion });

    if (showConnectMessage) {
      AlertifyHandler.showAlertifySuccess(`User ${remoteUser.userName} connected.`);
    }
  }

  /**
   * Updates the specified user's camera and controller positions.
   */
  onUserPositions() {}

  /**
   * Updates whether the given user is pinging with the specified controller or not.
   */
  onPingUpdate({
    userId,
    originalMessage: { controllerId, isPinging },
  }: ForwardedMessage<PingUpdateMessage>): void {
    const remoteUser = this.remoteUsers.lookupRemoteUserById(userId);
    if (!remoteUser) return;

    remoteUser.togglePing(controllerId, isPinging);
  }

  onTimestampUpdate({
    originalMessage: { timestamp },
  }: ForwardedMessage<TimestampUpdateMessage>): void {
    this.roomSerializer.preserveRoom(
      () => this.timestampService.updateTimestampLocally(timestamp),
      {
        restoreLandscapeData: false,
      },
    );
  }

  onUserControllerConnect() {}

  onUserControllerDisconnect() {}

  /**
   * Removes the user that disconnected and informs our user about it.
   *
   * @param {JSON} data - Contains the id of the user that disconnected.
   */
  onUserDisconnect({ id }: UserDisconnectedMessage) {
    // Remove user and show disconnect notification.
    const removedUser = this.remoteUsers.removeRemoteUserById(id);
    if (removedUser) {
      AlertifyHandler.showAlertifyError(`User ${removedUser.userName} disconnected.`);
    }
  }

  async onInitialLandscape({
    landscape,
    openApps,
    detachedMenus,
  }: InitialLandscapeMessage): Promise<void> {
    await this.roomSerializer.restoreRoom({ landscape, openApps, detachedMenus });

    this.landscapeMarker.add(this.vrLandscapeRenderer.landscapeObject3D);

    this.vrApplicationRenderer.getOpenApplications().forEach((applicationObject3D) => {
      this.addApplicationToMarker(applicationObject3D);
    });
  }

  async onAppOpened({
    originalMessage: {
      id, position, quaternion, scale,
    },
  }: ForwardedMessage<AppOpenedMessage>): Promise<void> {
    const application = this.vrApplicationRenderer.getApplicationInCurrentLandscapeById(
      id,
    );
    if (application) {
      const applicationObject3D = await
      this.vrApplicationRenderer.addApplicationLocally(application, {
        position: new THREE.Vector3(...position),
        quaternion: new THREE.Quaternion(...quaternion),
        scale: new THREE.Vector3(...scale),
      });

      this.addApplicationToMarker(applicationObject3D);
    }
  }

  onAppClosed({
    originalMessage: { appId },
  }: ForwardedMessage<AppClosedMessage>): void {
    const application = this.vrApplicationRenderer.getApplicationById(appId);
    if (application) this.vrApplicationRenderer.removeApplicationLocally(application);
  }

  onObjectMoved(): void { }

  onComponentUpdate({
    originalMessage: {
      isFoundation, appId, isOpened, componentId,
    },
  }: ForwardedMessage<ComponentUpdateMessage>): void {
    const applicationObject3D = this.vrApplicationRenderer.getApplicationById(
      appId,
    );
    if (!applicationObject3D) return;

    const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentId);

    if (isFoundation) {
      if (isOpened) {
        this.vrApplicationRenderer.openAllComponentsLocally(applicationObject3D);
      } else {
        this.vrApplicationRenderer.closeAllComponentsLocally(applicationObject3D);
      }
    } else if (componentMesh instanceof ComponentMesh) {
      this.vrApplicationRenderer.toggleComponentLocally(
        componentMesh,
        applicationObject3D,
      );
    }
  }

  onHighlightingUpdate({
    userId,
    originalMessage: {
      isHighlighted, appId, entityType, entityId,
    },
  }: ForwardedMessage<HighlightingUpdateMessage>): void {
    const application = this.vrApplicationRenderer.getApplicationById(appId);
    if (!application) return;

    const user = this.remoteUsers.lookupRemoteUserById(userId);
    if (!user) return;

    if (isHighlighted) {
      this.highlightingService.hightlightComponentLocallyByTypeAndId(
        application,
        {
          entityType,
          entityId,
          color: user.color,
        },
      );
    } else {
      this.highlightingService.removeHighlightingLocally(application);
    }
  }

  onSpectatingUpdate() {}

  onMenuDetached() { }

  onDetachedMenuClosed() { }

  // #endregion HANDLING MESSAGES
}
