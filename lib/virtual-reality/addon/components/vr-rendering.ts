import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import Auth from 'explorviz-frontend/services/auth';
import Configuration from 'explorviz-frontend/services/configuration';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';
import LocalVrUser from 'explorviz-frontend/services/local-vr-user';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import RemoteVrUserService from 'explorviz-frontend/services/remote-vr-users';
import TimestampRepository, { Timestamp } from 'explorviz-frontend/services/repos/timestamp-repository';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import Interaction from 'explorviz-frontend/utils/interaction';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import DeltaTimeService from 'virtual-reality/services/delta-time';
import GrabbedObjectService from 'virtual-reality/services/grabbed-object';
import SpectateUserService from 'virtual-reality/services/spectate-user';
import VrApplicationRenderer from 'virtual-reality/services/vr-application-renderer';
import VrAssetRepository from "virtual-reality/services/vr-asset-repo";
import VrLandscapeRenderer from "virtual-reality/services/vr-landscape-renderer";
import VrMenuFactoryService from 'virtual-reality/services/vr-menu-factory';
import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import VrRoomService from 'virtual-reality/services/vr-room';
import VrSceneService from "virtual-reality/services/vr-scene";
import WebSocketService from 'virtual-reality/services/web-socket';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import FloorMesh from 'virtual-reality/utils/view-objects/vr/floor-mesh';
import VRController from 'virtual-reality/utils/vr-controller';
import VRControllerBindings from 'virtual-reality/utils/vr-controller/vr-controller-bindings';
import VRControllerBindingsList from 'virtual-reality/utils/vr-controller/vr-controller-bindings-list';
import VRControllerButtonBinding from 'virtual-reality/utils/vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding, { VRControllerThumbpadDirection } from 'virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding';
import { EntityMesh, isEntityMesh } from 'virtual-reality/utils/vr-helpers/detail-info-composer';
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import DetachedMenuGroupContainer from 'virtual-reality/utils/vr-menus/detached-menu-group-container';
import InteractiveMenu from 'virtual-reality/utils/vr-menus/interactive-menu';
import MenuGroup from 'virtual-reality/utils/vr-menus/menu-group';
import MenuQueue from 'virtual-reality/utils/vr-menus/menu-queue';
import { findGrabbableObject, GrabbableObjectWrapper, isGrabbableObject } from 'virtual-reality/utils/vr-menus/ui-less-menu/grab-menu';
import HintMenu from 'virtual-reality/utils/vr-menus/ui-menu/hud/hint-menu';
import { ForwardedMessage, FORWARDED_EVENT } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { InitialLandscapeMessage } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { MenuDetachedForwardMessage } from 'virtual-reality/utils/vr-message/receivable/menu-detached-forward';
import { isObjectClosedResponse, ObjectClosedResponse } from 'virtual-reality/utils/vr-message/receivable/response/object-closed';
import { SelfConnectedMessage } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import { UserDisconnectedMessage } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage, HIGHLIGHTING_UPDATE_EVENT } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import { ObjectMovedMessage } from 'virtual-reality/utils/vr-message/sendable/object_moved';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping_update';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { DetachedMenuClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/detached_menu_closed';
import { SpectatingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/spectating_update';
import { TimestampUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/timetsamp_update';
import { UserControllerMessage, USER_CONTROLLER_EVENT } from 'virtual-reality/utils/vr-message/sendable/user_controllers';
import { UserPositionsMessage } from 'virtual-reality/utils/vr-message/sendable/user_positions';
import { APPLICATION_ENTITY_TYPE, CLASS_COMMUNICATION_ENTITY_TYPE, CLASS_ENTITY_TYPE, COMPONENT_ENTITY_TYPE, EntityType, NODE_ENTITY_TYPE } from 'virtual-reality/utils/vr-message/util/entity_type';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import VrInputManager from 'virtual-reality/utils/vr-multi-user/vr-input-manager';
import VrTimestampService from 'virtual-reality/utils/vr-timestamp';
import WebXRPolyfill from 'webxr-polyfill';

interface Args {
  readonly id: string;
  readonly landscapeData: LandscapeData;
  readonly selectedTimestampRecords: Timestamp[];
  readonly timestampInterval: number;
  readonly font: THREE.Font;
}

export default class VrRendering extends Component<Args> implements VrMessageListener {
  // #region SERVICES

  @service('auth') private auth!: Auth;
  @service('configuration') private configuration!: Configuration;
  @service('delta-time') private deltaTimeService!: DeltaTimeService;
  @service('grabbed-object') private grabbedObjectService!: GrabbedObjectService;
  @service('landscape-token') private landscapeTokenService!: LandscapeTokenService;
  @service('local-vr-user') private localUser!: LocalVrUser;
  @service('reload-handler') private reloadHandler!: ReloadHandler;
  @service('remote-vr-users') private remoteUsers!: RemoteVrUserService;
  @service('repos/timestamp-repository') private timestampRepo!: TimestampRepository;
  @service('spectate-user') private spectateUserService!: SpectateUserService;
  @service('vr-application-renderer') private vrApplicationRenderer!: VrApplicationRenderer;
  @service('vr-asset-repo') private assetRepo!: VrAssetRepository;
  @service('vr-landscape-renderer') private vrLandscapeRenderer!: VrLandscapeRenderer;
  @service('vr-menu-factory') private menuFactory!: VrMenuFactoryService;
  @service('vr-message-receiver') private receiver!: VrMessageReceiver;
  @service('vr-message-sender') private sender!: VrMessageSender;
  @service('vr-room') private vrRoomService!: VrRoomService;
  @service('vr-scene') private sceneService!: VrSceneService;
  @service('web-socket') private webSocket!: WebSocketService;

  // #endregion SERVICES

  // #region CLASS FIELDS

  private canvas!: HTMLCanvasElement;
  private debug = debugLogger('VrRendering');
  private debugMenuGroup!: MenuGroup;
  private detachedMenuGroups!: DetachedMenuGroupContainer;
  private hintMenuQueue!: MenuQueue;
  private interaction!: Interaction;
  private messageMenuQueue!: MenuQueue;
  private primaryInputManager = new VrInputManager();
  private secondaryInputManager = new VrInputManager();
  private vrSessionActive: boolean = false;
  private timestampService!: VrTimestampService;
  private willDestroyController: AbortController = new AbortController();

  // #endregion CLASS FIELDS

  // #region GETTERS

  get landscapeObject3D(): LandscapeObject3D {
    return this.vrLandscapeRenderer.landscapeObject3D;
  }

  get applicationGroup(): ApplicationGroup {
    return this.vrApplicationRenderer.applicationGroup;
  }

  get renderer(): THREE.WebGLRenderer {
    return this.localUser.renderer;
  }

  get scene(): THREE.Scene {
    return this.sceneService.scene;
  }

  get camera(): THREE.PerspectiveCamera {
    return this.localUser.defaultCamera;
  }

  // #endregion GETTERS

  // #region INITIALIZATION

  /**
   * Calls all init functions.
   */
  private initRendering() {
    this.initHUD();
    this.initRenderer();
    this.initServices();
    this.initInteraction();
    this.initPrimaryInput();
    this.initSecondaryInput();
    this.initControllers();
    this.initWebSocket();
  }

  /**
   * Creates the menu groups that are attached to the user's camera.
   */
  private initHUD() {
    this.debug('Initializing head-up display menus...');

    // Menu group for hints.
    this.hintMenuQueue = new MenuQueue({ detachedMenuGroups: this.detachedMenuGroups });
    this.hintMenuQueue.position.z = -0.3;
    this.localUser.defaultCamera.add(this.hintMenuQueue);

    // Menu group for message boxes.
    this.messageMenuQueue = new MenuQueue({ detachedMenuGroups: this.detachedMenuGroups });
    this.messageMenuQueue.rotation.x = 0.45;
    this.messageMenuQueue.position.y = 0.1;
    this.messageMenuQueue.position.z = -0.3;
    this.localUser.defaultCamera.add(this.messageMenuQueue);

    // Menu group for previewing menus during development.
    this.debugMenuGroup = new MenuGroup({ detachedMenuGroups: this.detachedMenuGroups });
    this.debugMenuGroup.position.z = -0.35;
    this.localUser.defaultCamera.add(this.debugMenuGroup);
  }

  /**
   * Initiates a WebGLRenderer
   */
  private initRenderer() {
    this.debug('Initializing renderer...');

    const { width, height } = this.canvas;
    this.localUser.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.xr.enabled = true;

    const polyfill = new WebXRPolyfill();
    if (polyfill) {
      this.debug('Polyfill enabled');
    }
  }

  private initServices() {
    this.debug('Initializing services...');

    // Use given font for landscape and application rendering.
    this.assetRepo.font = this.args.font;

    // Load landscape.
    this.vrLandscapeRenderer.updateLandscapeData(
      this.args.landscapeData.structureLandscapeData,
      this.args.landscapeData.dynamicLandscapeData
    );

    // Initialize application rendering.
    this.vrApplicationRenderer.onRemoveApplication = (application) => this.removeApplication(application);
    this.vrApplicationRenderer.updateLandscapeData(
      this.args.landscapeData.structureLandscapeData,
      this.args.landscapeData.dynamicLandscapeData
    );

    // Initialize menu group.
    this.detachedMenuGroups = new DetachedMenuGroupContainer({
      closeIconTextures: this.assetRepo.closeIconTextures,
      receiver: this.receiver,
      sender: this.sender,
    });
    this.scene.add(this.detachedMenuGroups);

    // Initialize timestamp service.
    this.timestampService = new VrTimestampService({
      timestamp: this.args.selectedTimestampRecords[0]?.timestamp ||
        this.timestampRepo.getLatestTimestamp(this.args.landscapeData.structureLandscapeData.landscapeToken)?.timestamp ||
        new Date().getTime(),
      timestampInterval: this.args.timestampInterval,
      localUser: this.localUser,
      sender: this.sender,
      auth: this.auth,
      reloadHandler: this.reloadHandler,
      landscapeTokenService: this.landscapeTokenService,
      vrLandscapeRenderer: this.vrLandscapeRenderer,
      vrApplicationRenderer: this.vrApplicationRenderer,
      detachedMenuGroups: this.detachedMenuGroups
    });

    // Initialiye room service.
    this.vrRoomService.injectValues({
      detachedMenuGroups: this.detachedMenuGroups,
      vrApplicationRenderer: this.vrApplicationRenderer,
      vrLandscapeRenderer: this.vrLandscapeRenderer,
      timestampService: this.timestampService,
    });

    // Initialize menu rendering.
    this.menuFactory.injectValues({
      vrApplicationRenderer: this.vrApplicationRenderer,
      timestampService: this.timestampService,
      detachedMenuGroups: this.detachedMenuGroups
    });
  }

  /**
   * Binds this context to all event handling functions and
   * passes them to a newly created Interaction object
   */
  private initInteraction() {
    this.debug('Initializing interaction...');

    const intersectableObjects = [
      this.landscapeObject3D,
      this.applicationGroup,
      this.sceneService.floor,
      this.detachedMenuGroups,
      this.debugMenuGroup,
    ];
    const raycastFilter = (intersection: THREE.Intersection) => {
      return !(intersection.object instanceof LabelMesh ||
        intersection.object instanceof LogoMesh);
    };
    this.interaction = new Interaction(
      this.canvas, this.camera, this.renderer, intersectableObjects, {
      singleClick: (intersection) => this.handleSingleClick(intersection),
      doubleClick: (intersection) => this.handleDoubleClick(intersection),
      mouseWheel: (delta) => this.handleMouseWheel(delta),
      mouseMove: (intersection) => this.handleMouseMove(intersection),
      panning: (delta, button) => this.handlePanning(delta, button),
    }, raycastFilter);

    // Add additional event listeners. Since TypeScript does not yet support
    // the signal option  of `addEventListener`, we have to listen for the
    // will destroy signal manually.
    const keydownListener = (event: KeyboardEvent) => this.handleKeyboard(event);
    window.addEventListener('keydown', keydownListener);
    this.willDestroyController.signal.addEventListener('abort', () => {
      window.removeEventListener('keydown', keydownListener);
    });
  }

  private initPrimaryInput() {
    // When any base mash is hovered, highlight it.
    this.primaryInputManager.addInputHandler({
      targetType: BaseMesh,
      hover: (event) => event.target.applyHoverEffect(),
      resetHover: (event) => event.target.resetHoverEffect(),
    });

    // When an application on the landscape is clicked, open the application.
    this.primaryInputManager.addInputHandler<ApplicationMesh>({
      targetType: ApplicationMesh,
      triggerDown: (event) => this.addApplication(event.target.dataModel).then((applicationObject3D) => {
        if (!applicationObject3D) return;

        // Rotate app so that it is aligned with landscape
        applicationObject3D.setRotationFromQuaternion(this.landscapeObject3D.quaternion);
        applicationObject3D.rotateX(90 * THREE.MathUtils.DEG2RAD);
        applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);

        // Position app above clicked point.
        applicationObject3D.position.copy(event.intersection.point);
      })
    });

    // When a component of an application is clicked, open it.
    this.primaryInputManager.addInputHandler({
      targetType: ComponentMesh,
      triggerDown: (event) => {
        if (event.target.parent instanceof ApplicationObject3D) {
          this.toggleComponentAndUpdate(event.target, event.target.parent);
        }
      }
    });

    // When the foundation of an application is clicked, close all components.
    this.primaryInputManager.addInputHandler({
      targetType: FoundationMesh,
      triggerDown: (event) => {
        if (event.target.parent instanceof ApplicationObject3D) {
          this.closeAllComponentsAndUpdate(event.target.parent);
        }
      }
    });

    // When a close icon is clicked, close the corresponding object.
    this.primaryInputManager.addInputHandler({
      targetType: CloseIcon,
      triggerDown: (event) => event.target.close().then((closedSuccessfully: boolean) => {
        if (!closedSuccessfully) this.showHint('Object could not be closed');
      })
    });

    // Initialize menu interaction with other controller.
    this.primaryInputManager.addInputHandler({
      targetType: InteractiveMenu,
      triggerDown: (event) => event.target.triggerDown(event.intersection),
      triggerPress: (event) => event.target.triggerPress(event.intersection, event.value),
      triggerUp: (event) => event.target.triggerUp(event.intersection),
      hover: (event) => event.target.hover(event.intersection),
      resetHover: (event) => event.target.resetHoverEffect()
    });
  }

  private initSecondaryInput() {
    this.secondaryInputManager.addInputHandler({
      targetType: FloorMesh,
      triggerDown: (event) => this.localUser.teleportToPosition(event.intersection.point),
      hover: (event) => {
        if (event.controller?.teleportArea && event.controller?.ray) {
          event.controller.teleportArea.showAbovePosition(event.intersection.point);
          event.controller.teleportArea.visible = event.controller.ray.visible && event.controller.enableTeleport;
        }
      },
      resetHover: (event) => {
        if (event.controller?.teleportArea) {
          event.controller.teleportArea.visible = false;
        }
      },
    });

    this.secondaryInputManager.addInputHandler({
      targetType: ApplicationObject3D,
      triggerDown: (event) => this.highlightAppEntity(event.intersection.object, event.target)
    });
  }

  private initControllers() {
    this.debug('Initializing controllers...');

    this.localUser.setController1(this.initController({ gamepadIndex: 0 }));
    this.localUser.setController2(this.initController({ gamepadIndex: 1 }));
  }

  private initController({ gamepadIndex }: { gamepadIndex: number }): VRController {
    // Initialize the controller's menu group.
    const menuGroup = new MenuGroup({
      detachedMenuGroups: this.detachedMenuGroups
    });

    // Initialize controller.
    const controller = new VRController({
      gamepadIndex,
      scene: this.scene,
      bindings: new VRControllerBindingsList(this.makeControllerBindings(), menuGroup.controllerBindings),
      gripSpace: this.renderer.xr.getControllerGrip(gamepadIndex),
      raySpace: this.renderer.xr.getController(gamepadIndex),
      color: new THREE.Color('red'),
      menuGroup,
      intersectableObjects: this.interaction.raycastObjects
    });
    controller.setToDefaultAppearance();
    controller.intersectableObjects.push(menuGroup);

    // Add connection event listeners.
    controller.eventCallbacks.connected = (controller) => this.onControllerConnected(controller);
    controller.eventCallbacks.disconnected = (controller) => this.onControllerDisconnected(controller);

    // Add hover event listeners.
    controller.eventCallbacks.updateIntersectedObject = (controller) => this.handleHover(controller.intersectedObject, controller);

    // Position menus above controller at an angle.
    menuGroup.position.y += 0.15;
    menuGroup.position.z -= 0.15;
    menuGroup.rotateX(340 * THREE.MathUtils.DEG2RAD);

    return controller;
  }

  private async initWebSocket() {
    this.debug('Initializing websocket...');

    this.webSocket.socketCloseCallback = () => this.onSelfDisconnected();
    this.receiver.addMessageListener(this);
  }

  // #endregion INITIALIZATION

  // #region DESTRUCTION

  willDestroy() {
    // Reset rendering.
    this.applicationGroup.clear();
    this.vrLandscapeRenderer.cleanUpLandscape();

    // Reset services.
    this.localUser.reset();
    this.spectateUserService.reset();

    // Remove event listers.
    this.receiver.removeMessageListener(this);
    this.willDestroyController.abort();
  }

  // #endregion DESTRUCTION

  // #region ACTIONS

  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug('Canvas inserted');

    this.canvas = canvas;
    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }

  @action
  async outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    // Initialize the component.
    this.initRendering();
    this.resize(outerDiv);

    // Start main loop.
    this.renderer.setAnimationLoop(() => this.tick());
  }

  /**
   * Call this whenever the canvas is resized. Updated properties of camera
   * and renderer.
   *
   * @param outerDiv HTML element containing the canvas
   */
  @action
  resize(outerDiv: HTMLElement) {
    const width = outerDiv.clientWidth;
    const height = outerDiv.clientHeight;

    // Update renderer and camera according to new canvas size
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  @action
  onVrSessionStarted(/* session: XRSession */) {
    this.debug('WebXRSession started');
    this.vrSessionActive = true;
  }

  @action
  onVrSessionEnded() {
    this.debug('WebXRSession ended');
    this.vrSessionActive = false;
    const outerDiv = this.canvas?.parentElement;
    if (outerDiv) {
      this.resize(outerDiv);
    }
  }

  @action
  async onDropFiles(files: File[]) {
    const filesByName = new Map<string, File>();
    for (const file of files) filesByName.set(file.name, file);

    // Create a loading manager that converts file names to object URLs.
    const loadingManager = new THREE.LoadingManager();
    const objectURLs: string[] = [];
    loadingManager.setURLModifier((url) => {
      const file = filesByName.get(url);
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        objectURLs.push(objectUrl);
        return objectUrl;
      }
      return url;
    });

    const tasks: Promise<any>[] = [];

    // Load all glTF models.
    for (let file of files) {
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        tasks.push(new Promise((resolve) => {
          const gltfLoader = new GLTFLoader(loadingManager);
          gltfLoader.load(file.name, (gltf) => {
            const object = new GrabbableObjectWrapper(gltf.scene);
            this.interaction.raycastObjects.push(object),
              this.scene.add(object);
            resolve(null);
          });
        }));
      }
    }

    // If a single image file has been dropped, use it as a panorama.
    if (files.length === 1) {
      const file = files[0];
      if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
        tasks.push(new Promise((resolve) => {
          const loader = new THREE.TextureLoader(loadingManager);
          loader.load(file.name, (texture) => {
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;

            const geometry = new THREE.SphereGeometry(10, 256, 256);
            const material = new THREE.MeshStandardMaterial({
              map: texture,
              side: THREE.BackSide,
              displacementScale: - 4.0
            });
            this.localUser.setPanoramaShere(new THREE.Mesh(geometry, material));
            resolve(null);
          });
        }));
      }
    }

    // Revoke the object URLs when all loading tasks are done.
    await Promise.all(tasks);
    objectURLs.forEach((url) => URL.revokeObjectURL(url));
  }

  // #endregion ACTIONS

  // #region MAIN LOOP

  /**
   * Main loop that is called once per frame.
   */
  private tick() {
    if (this.isDestroyed) { return; }

    // Compute time since last tick.
    this.deltaTimeService.update();
    const delta = this.deltaTimeService.getDeltaTime();

    this.update(delta);
    this.render();

    // Send position update to backend. This must happen after the scene has
    // been rendered such that the camera position is not corrupted.
    this.sendPoses();
  }

  /**
   * Updates menus, services and all objects in the scene.
   */
  private update(delta: number) {
    // Update controllers and menus.
    this.localUser.updateControllers(delta);
    this.hintMenuQueue.updateMenu(delta);
    this.messageMenuQueue.updateMenu(delta);
    this.debugMenuGroup.updateMenu(delta);
    this.detachedMenuGroups.updateDetachedMenus(delta);

    // Update services.
    this.spectateUserService.update();
    this.grabbedObjectService.sendObjectPositions();
    this.remoteUsers.updateRemoteUsers(delta);
  }

  /**
   * Renders the scene.
   */
  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  // #endregion MAIN LOOP

  // #region APPLICATION RENDERING

  private async addApplication(applicationModel: Application): Promise<ApplicationObject3D | null> {
    const application = await this.addApplicationLocally(applicationModel);
    if (application) this.sender.sendAppOpened(application);
    return application;
  }

  private addApplicationLocally(applicationModel: Application): Promise<ApplicationObject3D | null> {
    if (applicationModel.packages.length === 0) {
      this.showHint('No data available');
      return Promise.resolve(null);
    }
    if (this.applicationGroup.hasApplication(applicationModel.instanceId)) {
      this.showHint('Application already opened');
      return Promise.resolve(null);
    }

    return this.vrApplicationRenderer.addApplication(applicationModel);
  }

  private removeApplication(application: ApplicationObject3D): Promise<boolean> {
    return new Promise((resolve) => {
      // Ask backend to close the application.
      const nonce = this.sender.sendAppClosed(application.dataModel.instanceId);

      // Remove the application only when the backend allowed the application to be closed.
      this.receiver.awaitResponse({
        nonce,
        responseType: isObjectClosedResponse,
        onResponse: (response: ObjectClosedResponse) => {
          if (response.isSuccess) this.forceRemoveApplication(application);
          resolve(response.isSuccess);
        },
        onOffline: () => {
          this.forceRemoveApplication(application)
          resolve(true);
        }
      });
    });
  }

  private forceRemoveApplication(application: ApplicationObject3D) {
    this.applicationGroup.removeApplicationById(application.dataModel.instanceId);
  }

  private forceRemoveAllApplications() {
    this.applicationGroup.clear();
  }

  // #endregion APPLICATION RENDERING

  // #region COMPONENT AND COMMUNICATION RENDERING

  private toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D, { onlyLocally = false }: { onlyLocally?: boolean } = {}) {
    EntityManipulation.toggleComponentMeshState(componentMesh, applicationObject3D);
    this.vrApplicationRenderer.addLabels(applicationObject3D);
    this.updateDrawableCommunications(applicationObject3D);

    if (!onlyLocally && this.localUser.isOnline) {
      this.sender.sendComponentUpdate(applicationObject3D.dataModel.instanceId, componentMesh.dataModel.id, componentMesh.opened, false);
    }
  }

  private closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D, { onlyLocally = false }: { onlyLocally?: boolean } = {}) {
    EntityManipulation.closeAllComponents(applicationObject3D);
    this.updateDrawableCommunications(applicationObject3D);

    if (!onlyLocally && this.localUser.isOnline) {
      this.sender.sendComponentUpdate(applicationObject3D.dataModel.instanceId, '', false, true);
    }
  }

  private updateDrawableCommunications(applicationObject3D: ApplicationObject3D) {
    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(applicationObject3D.dataModel.instanceId);
    if (drawableComm) {
      this.vrApplicationRenderer.appCommRendering.addCommunication(applicationObject3D, drawableComm);
      Highlighting.updateHighlighting(applicationObject3D, drawableComm);
    }
  }

  // #endregion COMPONENT AND COMMUNICATION RENDERING

  // #region HIGHLIGHTING

  private isHightlightableAppEntity(object: THREE.Object3D): object is ComponentMesh | ClazzMesh | ClazzCommunicationMesh {
    return object instanceof ComponentMesh ||
      object instanceof ClazzMesh ||
      object instanceof ClazzCommunicationMesh;
  }

  private highlightAppEntity(object: THREE.Object3D, application: ApplicationObject3D) {
    if (this.localUser.color) {
      application.setHighlightingColor(this.localUser.color);
    }

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(application.dataModel.instanceId);
    if (this.isHightlightableAppEntity(object) && drawableComm) {
      Highlighting.highlight(object, application, drawableComm);
    }

    // Send highlighting update.
    if (this.localUser.isOnline) {
      if (object instanceof ComponentMesh || object instanceof ClazzMesh) {
        this.sender.sendHighlightingUpdate(application.dataModel.instanceId, object.constructor.name,
          object.dataModel.id, object.highlighted);
      } else if (object instanceof ClazzCommunicationMesh) {
        const { sourceClass, targetClass } = object.dataModel;

        // this is necessary, since drawable class communications are created on
        // client side, thus their ids do not match, since they are uuids
        let combinedId: string;
        if (sourceClass.id < targetClass.id) {
          combinedId = `${sourceClass.id}###${targetClass.id}`;
        } else {
          combinedId = `${targetClass.id}###${sourceClass.id}`;
        }

        this.sender.sendHighlightingUpdate(application.dataModel.instanceId, object.constructor.name,
          combinedId, object.highlighted);
      }
    }
  }

  // #endregion HIGHLIGHTING

  // #region MENUS

  private showHint(title: string, text: string | undefined = undefined) {
    // Show the hint only if there is no hint with the text in the queue
    // already. This prevents the same hint to be shown multiple times when
    // the user repeats the action that causes the hint.
    if (!this.hintMenuQueue.hasEnquedOrCurrentMenu((menu) => menu instanceof HintMenu && menu.titleItem.text === title && menu.textItem?.text === text)) {
      this.hintMenuQueue.enqueueMenu(this.menuFactory.buildHintMenu(title, text));
    }
  }

  private openMainMenu(controller: VRController) {
    controller.menuGroup.openMenu(this.menuFactory.buildToolMenu());
  }

  private openZoomMenu(controller: VRController) {
    controller.menuGroup.openMenu(this.menuFactory.buildZoomMenu());
  }

  private openPingMenu(controller: VRController) {
    controller.menuGroup.openMenu(this.menuFactory.buildPingMenu());
  }

  private openInfoMenu(controller: VRController, object: EntityMesh) {
    controller.menuGroup.openMenu(this.menuFactory.buildInfoMenu(object));
  }

  // #endregion MENUS

  // #region INTERACTION

  private async onControllerConnected(controller: VRController) {
    // Set visibilty and rays accordingly
    if (this.spectateUserService.isActive) controller.setToSpectatingAppearance();
    else controller.setToDefaultAppearance();

    // Prepare update message for other users
    let connect: { controller1?: string, controller2?: string };
    const motionController = await controller.controllerModel.motionControllerPromise;
    if (controller === this.localUser.controller1) {
      connect = { controller1: motionController.assetUrl };
    } else {
      connect = { controller2: motionController.assetUrl };
    }
    const disconnect = {};

    if (this.localUser.isOnline) {
      this.sender.sendControllerUpdate(connect, disconnect);
    }
  }

  private onControllerDisconnected(controller: VRController) {
    // Avoid that user could get stuck in spectate view
    this.spectateUserService.deactivate();

    let disconnect: { controller1?: string, controller2?: string };

    if (controller === this.localUser.controller1) {
      disconnect = { controller1: controller.gamepadId };
    } else {
      disconnect = { controller2: controller.gamepadId };
    }

    if (this.localUser.isOnline) {
      this.sender.sendControllerUpdate({}, disconnect);
    }
  }

  private makeControllerBindings(): VRControllerBindings {
    return new VRControllerBindings({
      triggerButton: new VRControllerButtonBinding('Open / Close', {
        onButtonDown: (controller: VRController) => {
          if (!controller.intersectedObject) return;
          this.primaryInputManager.handleTriggerDown(controller.intersectedObject, controller);
        },
        onButtonPress: (controller: VRController, value: number) => {
          if (!controller.intersectedObject) return;
          this.primaryInputManager.handleTriggerPress(controller.intersectedObject, value, controller);
        },
        onButtonUp: (controller: VRController) => {
          if (!controller.intersectedObject) return;
          this.primaryInputManager.handleTriggerUp(controller.intersectedObject, controller);
        }
      }),

      menuButton: new VRControllerButtonBinding('Options', {
        onButtonDown: (controller) => this.openMainMenu(controller)
      }),

      gripButton: new VRControllerButtonBinding('Grab Object', {
        onButtonDown: (controller) => this.grabIntersectedObject(controller)
      }),

      thumbpad: new VRControllerThumbpadBinding({
        labelUp: 'Teleport / Highlight',
        labelDown: 'Show Details',
        labelRight: 'Zoom',
        labelLeft: 'Ping'
      }, {
        onThumbpadDown: (controller, axes) => {
          const direction = VRControllerThumbpadBinding.getDirection(axes);
          switch (direction) {
            case VRControllerThumbpadDirection.UP:
              if (controller.intersectedObject) {
                this.secondaryInputManager.handleTriggerDown(controller.intersectedObject);
              }
              break;
            case VRControllerThumbpadDirection.DOWN:
              if (controller.intersectedObject) {
                const { object } = controller.intersectedObject;
                if (isEntityMesh(object)) {
                  this.openInfoMenu(controller, object);
                }
              }
              break;
            case VRControllerThumbpadDirection.RIGHT:
              this.openZoomMenu(controller);
              break;
            case VRControllerThumbpadDirection.LEFT:
              this.openPingMenu(controller);
              break;
          }
        }
      })

    })
  }

  private grabIntersectedObject(controller: VRController) {
    if (!controller.intersectedObject || !controller.ray) return;

    let object: THREE.Object3D | null = controller.intersectedObject.object;
    while (object) {
      if (isGrabbableObject(object)) {
        controller.menuGroup.openMenu(this.menuFactory.buildGrabMenu(object));
        break;
      } else {
        object = object.parent;
      }
    }
  }

  private handleDoubleClick(intersection: THREE.Intersection | null) {
    if (this.vrSessionActive || !intersection) return;
    this.primaryInputManager.handleTriggerDown(intersection);
  }

  private handleSingleClick(intersection: THREE.Intersection | null) {
    if (this.vrSessionActive || !intersection) return;
    this.secondaryInputManager.handleTriggerDown(intersection);
  }

  private handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    if (this.vrSessionActive) return;

    const LEFT_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 3;

    const x = delta.x / this.canvas.width;
    const y = delta.y / this.canvas.height;

    switch (button) {
      case LEFT_MOUSE_BUTTON:
        // Move user.
        const moveSpeed = 3.0;
        this.localUser.moveInCameraDirection(new THREE.Vector3(-x * moveSpeed, 0, -y * moveSpeed), { enableY: false });
        break;
      case RIGHT_MOUSE_BUTTON:
        // Rotate camera to look around.
        const xAxis = new THREE.Vector3(1, 0, 0);
        const yAxis = new THREE.Vector3(0, 1, 0);
        const rotationSpeed = Math.PI;
        this.camera.rotateOnAxis(xAxis, y * rotationSpeed);
        this.camera.rotateOnWorldAxis(yAxis, x * rotationSpeed);
        break;
    }
  }

  private handleMouseWheel(delta: number) {
    if (this.vrSessionActive) return;
    this.localUser.cameraHeight += delta * 0.2;
  }

  private handleMouseMove(intersection: THREE.Intersection | null) {
    if (this.vrSessionActive) return;
    this.handleHover(intersection, null);
  }

  private handleHover(intersection: THREE.Intersection | null, controller: VRController | null) {
    if (intersection) {
      this.primaryInputManager.handleHover(intersection, controller);
      this.secondaryInputManager.handleHover(intersection, controller);
    } else {
      this.primaryInputManager.resetHover(controller);
      this.secondaryInputManager.resetHover(controller);
    }
  }

  private handleKeyboard(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        if (!this.vrSessionActive) {
          // Close current debug menu or open tool menu if no menu is debugged.
          if (this.debugMenuGroup.currentMenu) {
            this.debugMenuGroup.closeMenu();
          } else {
            this.debugMenuGroup.openMenu(this.menuFactory.buildToolMenu());
          }
        }
        break;
      default:
        break;
    }
  }

  // #endregion INTERACTION

  // #region SENDING MESSAGES

  private sendPoses() {
    const poses = Helper.getPoses(
      this.localUser.camera,
      this.localUser.controller1,
      this.localUser.controller2
    );
    let controller1 = this.localUser.controller1;
    let intersection1 = null;
    if (controller1) {
      controller1.updateIntersectedObject();
      intersection1 = controller1.intersectedObject?.point || null;
    }
    let controller2 = this.localUser.controller2;
    let intersection2 = null;
    if (controller2) {
      controller2.updateIntersectedObject();
      intersection2 = controller2.intersectedObject?.point || null;
    }

    this.sender.sendPoseUpdate(poses.camera, poses.controller1, poses.controller2, intersection1, intersection2);
  }

  private sendInitialControllerConnectState() {
    if (this.localUser.isOnline) {
      const connect: { controller1?: string, controller2?: string } = {};
      if (this.localUser.controller1?.connected) {
        connect.controller1 = this.localUser.controller1.controllerModel.motionController?.assetUrl;
      }
      if (this.localUser.controller2?.connected) {
        connect.controller2 = this.localUser.controller2.controllerModel.motionController?.assetUrl;
      }
      this.sender.sendControllerUpdate(connect, {});
    }
  }

  // #endregion SENDING MESSAGES

  // #region HANDLING MESSAGES

  private onSelfDisconnected(event?: any) {
    if (this.localUser.connectionStatus === 'connecting') {
      this.showHint('VR service not responding');
    } else if (event) {
      switch (event.code) {
        case 1000: // Normal Closure
          this.showHint('Successfully disconnected');
          break;
        case 1006: // Abnormal closure
          this.showHint('VR service closed abnormally');
          break;
        default:
          this.showHint('Unexpected disconnect');
      }
    }

    // Remove remote users.
    this.remoteUsers.removeAllRemoteUsers();

    // Reset highlighting colors.
    this.applicationGroup.children.forEach((child) => {
      if (child instanceof ApplicationObject3D) {
        child.setHighlightingColor(this.configuration.applicationColors.highlightedEntity);
      }
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
      this.onUserConnected({
        event: USER_CONNECTED_EVENT,
        id: userData.id,
        name: userData.name,
        color: userData.color
      }, false);
      this.onUserControllers({
        event: FORWARDED_EVENT,
        userID: userData.id,
        originalMessage: {
          event: USER_CONTROLLER_EVENT,
          connect: userData.controllers,
          disconnect: null
        }
      });
    }
    this.localUser.connected({
      id: self.id,
      name: self.name,
      color: new THREE.Color().fromArray(self.color)
    });
    this.sendInitialControllerConnectState();
  }

  onUserConnected(
    { id, name, color }: UserConnectedMessage,
    showConnectMessage = true
  ): void {
    const remoteUser = new RemoteVrUser({
      userName: name,
      userId: id,
      color: new THREE.Color().fromArray(color),
      state: 'online',
      localUser: this.localUser
    });
    this.remoteUsers.addRemoteUser(remoteUser);

    if (showConnectMessage) {
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: 'User connected',
        text: remoteUser.userName,
        color: `#${remoteUser.color.getHexString()}`,
        time: 3.0,
      }));
    }
  }

  /**
   * Updates the specified user's camera and controller positions.
   */
  onUserPositions({
    userID,
    originalMessage: { camera, controller1, controller2 }
  }: ForwardedMessage<UserPositionsMessage>): void {
    const remoteUser = this.remoteUsers.lookupRemoteUserById(userID);
    if (!remoteUser) return;

    if (controller1) remoteUser.updateController1(controller1);
    if (controller2) remoteUser.updateController2(controller2);
    if (camera) remoteUser.updateCamera(camera);
  }

  /**
   * Updates whether the given user is pinging with the specified controller or not.
   */
  onPingUpdate({
    userID,
    originalMessage: { controllerId, isPinging }
  }: ForwardedMessage<PingUpdateMessage>): void {
    const remoteUser = this.remoteUsers.lookupRemoteUserById(userID);
    if (!remoteUser) return;

    if (controllerId === 0) {
      remoteUser.togglePing1(isPinging);
    } else if (controllerId === 1) {
      remoteUser.togglePing2(isPinging);
    }
  }

  onTimestampUpdate({
    originalMessage: { timestamp }
  }: ForwardedMessage<TimestampUpdateMessage>): void {
    this.timestampService.updateTimestampLocally(timestamp);
  }

  /**
   * Handles the (dis-)connect of the specified user's controller(s).
   *
   * @param {JSON} data - Contains id and controller information.
   */
  onUserControllers({
    userID,
    originalMessage: { connect, disconnect }
  }: ForwardedMessage<UserControllerMessage>): void {
    const remoteUser = this.remoteUsers.lookupRemoteUserById(userID);
    if (!remoteUser) return;

    // Load models of newly connected controller(s).
    if (connect) {
      if (connect.controller1) remoteUser.initController1(connect.controller1);
      if (connect.controller2) remoteUser.initController2(connect.controller2);
    }

    // Remove controller model(s) due to controller disconnect.
    if (disconnect) {
      if (disconnect.controller1) remoteUser.removeController1();
      if (disconnect.controller2) remoteUser.removeController2();
    }
  }

  /**
   * Removes the user that disconnected and informs our user about it.
   *
   * @param {JSON} data - Contains the id of the user that disconnected.
   */
  onUserDisconnect({ id }: UserDisconnectedMessage) {
    // Remove user and show disconnect notification.
    const removedUser = this.remoteUsers.removeRemoteUserById(id);
    if (removedUser) {
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: 'User disconnected',
        text: removedUser.userName,
        color: `#${removedUser.color.getHexString()}`,
        time: 3.0,
      }));
    }
  }

  async onInitialLandscape({ detachedMenus, openApps, landscape }: InitialLandscapeMessage): Promise<void> {
    this.forceRemoveAllApplications();
    this.detachedMenuGroups.forceRemoveAllDetachedMenus();

    // Initialize landscape.
    await this.timestampService.updateLandscapeToken(landscape.landscapeToken, landscape.timestamp);
    this.landscapeObject3D.position.fromArray(landscape.position);
    this.landscapeObject3D.quaternion.fromArray(landscape.quaternion);
    this.landscapeObject3D.scale.fromArray(landscape.scale);

    // Initialize applications.
    const tasks: Promise<void>[] = [];
    openApps.forEach((app) => {
      const application = this.vrApplicationRenderer.getApplicationInCurrentLandscapeById(app.id);
      if (application) {
        tasks.push(this.vrApplicationRenderer.addApplication(application).then((applicationObject3D: ApplicationObject3D | null) => {
          if (!applicationObject3D) return;

          applicationObject3D.position.fromArray(app.position);
          applicationObject3D.quaternion.fromArray(app.quaternion);
          applicationObject3D.scale.fromArray(app.scale);

          EntityManipulation.restoreComponentState(applicationObject3D,
            new Set(app.openComponents));

          this.vrApplicationRenderer.addLabels(applicationObject3D);

          const drawableComm = this.vrApplicationRenderer.drawableClassCommunications
            .get(applicationObject3D.dataModel.instanceId);

          if (drawableComm) {
            this.vrApplicationRenderer.appCommRendering.addCommunication(applicationObject3D, drawableComm);
            Highlighting.updateHighlighting(applicationObject3D, drawableComm);
          }

          // Simulate a highlighting update for every initial highlighting
          // component.
          app.highlightedComponents.forEach((highlightingUpdate) => {
            this.onHighlightingUpdate({
              event: FORWARDED_EVENT,
              userID: highlightingUpdate.userID,
              originalMessage: {
                event: HIGHLIGHTING_UPDATE_EVENT,
                isHighlighted: highlightingUpdate.isHighlighted,
                appID: highlightingUpdate.appID,
                entityType: highlightingUpdate.entityType,
                entityID: highlightingUpdate.entityID
              }
            });
          });
        }));
      }
    });

    // Wait for applications to be opened before opening the menus. Otherwise
    // the entities do not exist.
    await Promise.all(tasks);

    // Initialize detached menus.
    detachedMenus.forEach((detachedMenu) => {
      let object = this.findMeshByModelId(detachedMenu.entityType, detachedMenu.entityId);
      if (isEntityMesh(object)) {
        const menu = this.menuFactory.buildInfoMenu(object);
        menu.position.fromArray(detachedMenu.position);
        menu.quaternion.fromArray(detachedMenu.quaternion);
        menu.scale.fromArray(detachedMenu.scale);
        this.detachedMenuGroups.addDetachedMenuWithId(menu, detachedMenu.objectId);
      }
    })
  }

  async onAppOpened({
    originalMessage: { id, position, quaternion, scale }
  }: ForwardedMessage<AppOpenedMessage>): Promise<void> {
    const application = this.vrApplicationRenderer.getApplicationInCurrentLandscapeById(id);

    if (application) {
      const applicationObject3D = await this.addApplicationLocally(application);
      if (applicationObject3D) {
        applicationObject3D.position.fromArray(position);
        applicationObject3D.quaternion.fromArray(quaternion);
        applicationObject3D.scale.fromArray(scale);
      }
    }
  }

  onAppClosed({
    originalMessage: { appID }
  }: ForwardedMessage<AppClosedMessage>): void {
    const application = this.applicationGroup.getApplication(appID);
    if (application) this.forceRemoveApplication(application);
  }

  onObjectMoved({
    originalMessage: { objectId, position, quaternion, scale }
  }: ForwardedMessage<ObjectMovedMessage>): void {
    // The moved object can be any of the intersectable objects.
    for (let object of this.interaction.raycastObjects) {
      let child = findGrabbableObject(object, objectId);
      if (child) {
        child.position.fromArray(position);
        child.quaternion.fromArray(quaternion);
        child.scale.fromArray(scale);
        return;
      }
    }
    console.error('Could not find moved object', objectId);
  }

  onComponentUpdate({
    originalMessage: { isFoundation, appID, componentID }
  }: ForwardedMessage<ComponentUpdateMessage>): void {
    const applicationObject3D = this.applicationGroup.getApplication(appID);
    if (!applicationObject3D) return;

    const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentID);

    if (isFoundation) {
      EntityManipulation.closeAllComponents(applicationObject3D);
    } else if (componentMesh instanceof ComponentMesh) {
      this.toggleComponentAndUpdate(componentMesh, applicationObject3D, { onlyLocally: true });
    }
  }

  onHighlightingUpdate({
    userID,
    originalMessage: { isHighlighted, appID, entityType, entityID }
  }: ForwardedMessage<HighlightingUpdateMessage>): void {
    const applicationObject3D = this.applicationGroup.getApplication(appID);

    if (!applicationObject3D) return;

    if (!isHighlighted) {
      Highlighting.removeHighlighting(applicationObject3D);
      return;
    }

    const user = this.remoteUsers.lookupRemoteUserById(userID);
    if (!user) return;

    // Highlight entities in the respective user color
    applicationObject3D.setHighlightingColor(user.color);

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications
      .get(applicationObject3D.dataModel.instanceId);

    // Apply highlighting
    if (entityType === 'ComponentMesh' || entityType === 'ClazzMesh') {
      const boxMesh = applicationObject3D.getBoxMeshbyModelId(entityID);
      if (boxMesh instanceof ComponentMesh || boxMesh instanceof ClazzMesh) {
        if (drawableComm) {
          Highlighting.highlight(boxMesh, applicationObject3D, drawableComm);
        }
      }
    } else {
      // The target and source class id of communication
      const classIds = new Set<string>(entityID.split('###'));

      applicationObject3D.getCommMeshes().forEach((commMesh) => {
        if (classIds.has(commMesh.dataModel.sourceClass.id)
          && classIds.has(commMesh.dataModel.targetClass.id)) {
          if (drawableComm) {
            Highlighting.highlight(commMesh, applicationObject3D, drawableComm);
          }
        }
      });
    }
  }

  /**
  * Updates the state of given user to spectating or connected.
  * Hides them if spectating.
  *
  * @param {string} userID - The user's id.
  * @param {boolean} isSpectating - True, if the user is now spectating, else false.
  */
  onSpectatingUpdate({
    userID,
    originalMessage: { isSpectating }
  }: ForwardedMessage<SpectatingUpdateMessage>): void {
    const remoteUser = this.remoteUsers.setRemoteUserSpectatingById(userID, isSpectating);
    if (!remoteUser) return;

    const remoteUserHexColor = `#${remoteUser.color.getHexString()}`;
    if (isSpectating) {
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: remoteUser.userName,
        text: ' is now spectating',
        color: remoteUserHexColor,
        time: 3.0
      }));
    } else {
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: remoteUser.userName,
        text: ' stopped spectating',
        color: remoteUserHexColor,
        time: 3.0
      }));
    }
  }

  onMenuDetached({ objectId, entityType, detachId, position, quaternion, scale }: MenuDetachedForwardMessage) {
    let object = this.findMeshByModelId(entityType, detachId);
    if (isEntityMesh(object)) {
      const menu = this.menuFactory.buildInfoMenu(object);
      menu.position.fromArray(position);
      menu.quaternion.fromArray(quaternion);
      menu.scale.fromArray(scale);
      this.detachedMenuGroups.addDetachedMenuWithId(menu, objectId);
    }
  }

  onDetachedMenuClosed({
    originalMessage: { menuId }
  }: ForwardedMessage<DetachedMenuClosedMessage>): void {
    this.detachedMenuGroups.forceRemoveDetachedMenuWithId(menuId);
  }

  // #endregion HANDLING MESSAGES

  // #region UTILS

  findMeshByModelId(entityType: EntityType, id: string) {
    switch (entityType) {
      case NODE_ENTITY_TYPE:
      case APPLICATION_ENTITY_TYPE:
        return this.landscapeObject3D.getMeshbyModelId(id);

      case COMPONENT_ENTITY_TYPE:
      case CLASS_ENTITY_TYPE:
        for (let application of Array.from(this.applicationGroup.getOpenedApps())) {
          const mesh = application.getBoxMeshbyModelId(id);
          if (mesh) return mesh;
        }
        return null;

      case CLASS_COMMUNICATION_ENTITY_TYPE:
        for (let application of Array.from(this.applicationGroup.getOpenedApps())) {
          const mesh = application.getCommMeshByModelId(id);
          if (mesh) return mesh;
        }
        return null;

      default:
        return null;
    }
  }

  // #endregion UTILS
}
