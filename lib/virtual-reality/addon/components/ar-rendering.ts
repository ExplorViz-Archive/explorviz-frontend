import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import Configuration from 'explorviz-frontend/services/configuration';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import Interaction from 'explorviz-frontend/utils/interaction';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import {
  Class, Package, Application, Node,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LandscapeLabeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
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
  mouseX: number,
  mouseY: number,
  entity: DataModel
};

declare const THREEx: any;

export default class ArRendering extends Component<Args> {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  deltaTimeService!: DeltaTime;

  @service('vr-highlighting')
  private highlightingService!: VrHighlightingService;

  @service('ar-settings')
  arSettings!: ArSettings;

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  @service('repos/timestamp-repository')
  private timestampRepo!: TimestampRepository;

  @service('vr-landscape-renderer')
  private vrLandscapeRenderer!: VrLandscapeRenderer;

  @service('vr-scene')
  private sceneService!: VrSceneService;

  @service('vr-timestamp')
  private timestampService!: VrTimestampService;

  // @service('vr-message-receiver')
  // private receiver!: VrMessageReceiver;

  @service('vr-application-renderer')
  private vrApplicationRenderer!: VrApplicationRenderer;

  @service('vr-asset-repo')
  private assetRepo!: VrAssetRepository;

  debug = debugLogger('ArRendering');

  // Used to register (mouse) events
  interaction!: Interaction;

  outerDiv!: HTMLElement;

  canvas!: HTMLCanvasElement;

  @tracked
  camera!: THREE.PerspectiveCamera;

  readonly imageLoader: ImageLoader = new ImageLoader();

  arZoomHandler: ArZoomHandler | undefined;

  // Provides functions to label landscape meshes
  readonly landscapeLabeler = new LandscapeLabeler();

  // Extended Object3D which manages landscape meshes
  @tracked
  readonly landscapeObject3D!: LandscapeObject3D;

  onRenderFcts: (() => void)[] = [];

  arToolkitSource: any;

  arToolkitContext: any;

  landscapeMarkers: THREE.Group[] = [];

  applicationMarkers: THREE.Group[] = [];

  private willDestroyController: AbortController = new AbortController();

  @tracked
  popupData: PopupData | null = null;

  @tracked
  hammerInteraction: HammerInteraction;

  @tracked
  showSettings = false;

  // #endregion CLASS FIELDS AND GETTERS

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.landscapeObject3D = this.vrLandscapeRenderer.landscapeObject3D;
    this.vrLandscapeRenderer.setLargestSide(2);

    this.hammerInteraction = HammerInteraction.create();

    AlertifyHandler.setAlertifyPosition('bottom-center');
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
    this.initCameraCrosshair();
    this.initArJs();
    this.initInteraction();
    this.configureScene();
  }

  private initServices() {
    this.debug('Initializing services...');

    // Use given font for landscape and application rendering.
    this.assetRepo.font = this.args.font;

    // Initialize timestamp and landscape data. If no timestamp is selected,
    // the latest timestamp is used. When there is no timestamp, we fall back
    // to the current time.
    const { landscapeToken } = this.args.landscapeData.structureLandscapeData;
    const timestamp = this.args.selectedTimestampRecords[0]?.timestamp
      || this.timestampRepo.getLatestTimestamp(landscapeToken)?.timestamp
      || new Date().getTime();
    this.timestampService.setTimestampLocally(
      timestamp,
      this.args.landscapeData.structureLandscapeData,
      this.args.landscapeData.dynamicLandscapeData,
    );
  }

  /**
     * Creates a PerspectiveCamera according to canvas size and sets its initial position
     */
  private initCamera() {
    // Set camera properties
    this.localUser.defaultCamera.fov = 42;
    this.localUser.updateCameraAspectRatio(640, 480);
    this.localUser.defaultCamera.near = 0.01;
    this.localUser.defaultCamera.far = 2000;
    this.localUser.defaultCamera.position.set(0, 0, 0);

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

  /**
  * Initiates a WebGLRenderer
  */
  private initRenderer() {
    this.debug('Initializing renderer...');

    const { width, height } = this.canvas;
    this.localUser.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas,
    });
    this.localUser.renderer.setPixelRatio(window.devicePixelRatio);
    this.localUser.renderer.setSize(width, height);
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

  private getIntersectableObjects() {
    const intersectableObjects: THREE.Object3D[] = [this.landscapeObject3D];

    this.applicationMarkers.forEach((appMarker) => {
      intersectableObjects.push(appMarker);
    });

    return intersectableObjects;
  }

  static raycastFilter(intersection: THREE.Intersection) {
    return !(intersection.object instanceof LabelMesh || intersection.object instanceof LogoMesh);
  }

  private initArJs() {
    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
    });

    this.arToolkitSource.init(() => {
      setTimeout(() => {
        this.resize(this.outerDiv);
      }, 1000);
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'ar_data/camera_para.dat',
      detectionMode: 'mono',
    });

    this.arToolkitContext = arToolkitContext;

    arToolkitContext.init();

    // Update artoolkit on every frame
    this.onRenderFcts.push(() => {
      if (this.arToolkitSource.ready === false) return;

      arToolkitContext.update(this.arToolkitSource.domElement);
    });

    const landscapeMarker0 = new THREE.Group();
    landscapeMarker0.add(this.landscapeObject3D);
    this.sceneService.scene.add(landscapeMarker0);

    // Init controls for camera
    // eslint-disable-next-line
    new THREEx.ArMarkerControls(arToolkitContext, landscapeMarker0, {
      type: 'pattern',
      patternUrl: 'ar_data/L.patt',
    });

    const applicationMarkerNames = ['pattern-rectangular_1', 'pattern-rectangular_2', 'pattern-rectangular_3', 'pattern-rectangular_4', 'pattern-rectangular_5'];

    applicationMarkerNames.forEach((markerName) => {
      const applicationMarker = new THREE.Group();
      this.sceneService.scene.add(applicationMarker);
      this.applicationMarkers.push(applicationMarker);

      // Init controls for camera
      // eslint-disable-next-line
      new THREEx.ArMarkerControls(arToolkitContext, applicationMarker, {
        type: 'pattern',
        patternUrl: `ar_data/${markerName}.patt`,
      });
    });
  }
  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region ACTIONS

  @action
  async outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.outerDiv = outerDiv;

    this.initRendering();

    this.resize(outerDiv);

    // Start main loop.
    this.localUser.renderer.setAnimationLoop(() => this.tick());

    // await perform(this.loadNewLandscape);
  }

  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug('Canvas inserted');

    this.canvas = canvas;
    this.hammerInteraction.setupHammer(canvas);

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
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);

    this.localUser.updateCameraAspectRatio(width, height);

    // Update renderer and camera according to new canvas size
    this.localUser.renderer.setSize(width, height);
    this.localUser.defaultCamera.updateProjectionMatrix();

    this.arToolkitSource.onResizeElement();

    this.arToolkitSource.copyElementSizeTo(this.localUser.renderer.domElement);
    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
    }

    const video = document.getElementById('arjs-video');

    if (video instanceof HTMLVideoElement) {
      // Set video to cover screen
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.marginLeft = '0';
      video.style.marginTop = '0';

      // Center canvas
      this.canvas.style.marginLeft = `${(width - parseInt(this.canvas.style.width, 10)) / 2}px`;
    }
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
  handlePlusInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (intersection && intersection.object) {
      const { parent } = intersection.object;
      if (parent instanceof LandscapeObject3D || parent instanceof ApplicationObject3D) {
        parent.scale.set(parent.scale.x * 1.1, parent.scale.y * 1.1, parent.scale.z * 1.1);
      }
    }
  }

  @action
  handleMinusInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (intersection && intersection.object) {
      const { parent } = intersection.object;
      if (parent instanceof LandscapeObject3D || parent instanceof ApplicationObject3D) {
        parent.scale.set(parent.scale.x * 0.9, parent.scale.y * 0.9, parent.scale.z * 0.9);
      }
    }
  }

  @action
  handleInfoInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    if (!intersection) {
      this.popupData = null;
      return;
    }

    const mesh = intersection.object;

    // Show information as popup is mouse stopped on top of a mesh
    if ((mesh instanceof NodeMesh || mesh instanceof ApplicationMesh
      || mesh instanceof ClazzMesh || mesh instanceof ComponentMesh
      || mesh instanceof ClazzCommunicationMesh)
      && mesh.dataModel !== this.popupData?.entity) {
      this.popupData = {
        mouseX: this.canvas.width / 2,
        mouseY: this.canvas.height / 2,
        entity: mesh.dataModel,
      };
    } else {
      this.popupData = null;
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
        // this.localUser.connect();
        break;
      case 'm':
        this.localUser.defaultCamera.fov += 1;
        this.localUser.defaultCamera.updateProjectionMatrix();
        break;
      case 'n':
        this.localUser.defaultCamera.fov -= 1;
        this.localUser.defaultCamera.updateProjectionMatrix();
        break;

      default:
        break;
    }
  }

  // #endregion MOUSE & KEYBOARD EVENT HANDLER

  // #region RENDERING AND SCENE POPULATION

  /**
   * Main loop that is called once per frame.
   */
  private tick() {
    if (this.isDestroyed) {
      return;
    }

    // Compute time since last tick.
    this.deltaTimeService.update();
    const delta = this.deltaTimeService.getDeltaTime();

    this.remoteUsers.updateRemoteUsers(delta);
    this.render();
  }

  /**
     * Renders the scene.
     */
  private render() {
    this.localUser.renderer
      .setViewport(0, 0, this.outerDiv.clientWidth, this.outerDiv.clientHeight);

    this.localUser.renderer.render(
      this.sceneService.scene,
      this.localUser.defaultCamera,
    );

    // Call each update function
    this.onRenderFcts.forEach((onRenderFct) => {
      onRenderFct();
    });

    this.arZoomHandler?.renderZoomCamera(this.localUser.renderer, this.sceneService.scene);
  }

  // #endregion RENDERING AND SCENE POPULATION

  // #region APLICATION RENDERING

  async addApplication(applicationModel: Application) {
    if (applicationModel.packages.length === 0) {
      const message = `Sorry, there is no information for application <b>
        ${applicationModel.name}</b> available.`;

      AlertifyHandler.showAlertifyMessage(message);
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

      if (!applicationObject3D) {
        AlertifyHandler.showAlertifyError('Could not open application.');
        return;
      }

      // Scale application such that it approximately fits to the printed marker
      applicationObject3D.setLargestSide(1.5);

      applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);

      applicationObject3D.setBoxMeshOpacity(this.arSettings.applicationOpacity);

      for (let i = 0; i < this.applicationMarkers.length; i++) {
        if (this.applicationMarkers[i].children.length === 0) {
          this.applicationMarkers[i].add(applicationObject3D);

          const message = `Application '${applicationModel.name}' successfully opened <br>
            on marker #${i}.`;

          AlertifyHandler.showAlertifySuccess(message);

          break;
        }
      }
    }
  }

  // #endregion APPLICATION RENDERING

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
    }
  }

  private cleanUpLandscape() {
    this.landscapeObject3D.removeAllChildren();
    this.landscapeObject3D.resetMeshReferences();
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

  willDestroy() {
  // Reset rendering.
    this.vrApplicationRenderer.removeAllApplicationsLocally();
    // this.vrLandscapeRenderer.cleanUpLandscape();

    // Reset services.
    this.localUser.reset();

    // Remove event listers.
    // this.receiver.removeMessageListener(this);
    this.willDestroyController.abort();

    this.cleanUpLandscape();
    ArRendering.cleanUpAr();
    AlertifyHandler.setAlertifyPosition('bottom-right');
  }

  // #endregion UTILS
}
