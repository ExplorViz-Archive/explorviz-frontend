import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import { task } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';
import LocalVrUser from 'explorviz-frontend/services/local-vr-user';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import Interaction from 'explorviz-frontend/utils/interaction';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import THREE from 'three';
import DeltaTimeService from 'virtual-reality/services/delta-time';
import GrabbedObjectService from 'virtual-reality/services/grabbed-object';
import SpectateUserService from 'virtual-reality/services/spectate-user';
import VrMenuFactoryService from 'virtual-reality/services/vr-menu-factory';
import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import WebSocketService from 'virtual-reality/services/web-socket';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import FloorMesh from 'virtual-reality/utils/view-objects/vr/floor-mesh';
import NameTagMesh from 'virtual-reality/utils/view-objects/vr/name-tag-mesh';
import VRController from 'virtual-reality/utils/vr-controller';
import VRControllerBindings from 'virtual-reality/utils/vr-controller/vr-controller-bindings';
import VRControllerBindingsList from 'virtual-reality/utils/vr-controller/vr-controller-bindings-list';
import VRControllerButtonBinding from 'virtual-reality/utils/vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding, { VRControllerThumbpadDirection } from 'virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding';
import { EntityMesh, isEntityMesh } from 'virtual-reality/utils/vr-helpers/detail-info-composer';
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import BaseMenu from 'virtual-reality/utils/vr-menus/base-menu';
import DetachedMenuGroupContainer from 'virtual-reality/utils/vr-menus/detached-menu-group-container';
import MenuGroup from 'virtual-reality/utils/vr-menus/menu-group';
import MenuQueue from 'virtual-reality/utils/vr-menus/menu-queue';
import { findGrabbableObject, isGrabbableObject } from 'virtual-reality/utils/vr-menus/ui-less-menu/grab-menu';
import UiMenu from 'virtual-reality/utils/vr-menus/ui-menu';
import HintMenu from 'virtual-reality/utils/vr-menus/ui-menu/hint-menu';
import { ForwardedMessage, FORWARDED_EVENT } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { InitialLandscapeMessage } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { MenuDetachedForwardMessage } from 'virtual-reality/utils/vr-message/receivable/menu-detached-forward';
import { isObjectClosedResponse, ObjectClosedResponse } from 'virtual-reality/utils/vr-message/receivable/response/object-closed';
import { SelfConnectedMessage } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import { UserDisconnectedMessage, USER_DISCONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage, HIGHLIGHTING_UPDATE_EVENT } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import { ObjectMovedMessage } from 'virtual-reality/utils/vr-message/sendable/object_moved';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping-update';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { DetachedMenuClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/detached_menu_closed';
import { SpectatingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/spectating_update';
import { UserControllerMessage, USER_CONTROLLER_EVENT } from 'virtual-reality/utils/vr-message/sendable/user_controllers';
import { UserPositionsMessage } from 'virtual-reality/utils/vr-message/sendable/user_positions';
import { APPLICATION_ENTITY_TYPE, CLASS_COMMUNICATION_ENTITY_TYPE, CLASS_ENTITY_TYPE, COMPONENT_ENTITY_TYPE, EntityType, NODE_ENTITY_TYPE } from 'virtual-reality/utils/vr-message/util/entity_type';
import HardwareModels from 'virtual-reality/utils/vr-multi-user/hardware-models';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import VrApplicationRenderer from 'virtual-reality/utils/vr-rendering/vr-application-renderer';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import WebXRPolyfill from 'webxr-polyfill';

const FLOOR_SIZE = 10;

interface Args {
  readonly id: string;
  readonly landscapeData: LandscapeData;
  readonly font: THREE.Font;
}

export default class VrRendering extends Component<Args> implements VrMessageListener {
  // #region SERVICES

  @service('configuration')
  private configuration!: Configuration;

  @service('current-user')
  private currentUser!: CurrentUser;

  @service('local-vr-user')
  private localUser!: LocalVrUser;

  @service('spectate-user')
  private spectateUserService!: SpectateUserService;

  @service('delta-time')
  private deltaTimeService!: DeltaTimeService;

  @service()
  private worker!: any;

  @service('web-socket')
  private webSocket!: WebSocketService;

  @service('ajax')
  private ajax!: AjaxServiceClass;

  @service('vr-message-sender')
  private sender!: VrMessageSender;

  @service('vr-message-receiver')
  private receiver!: VrMessageReceiver;

  @service('grabbed-object')
  grabbedObjectService!: GrabbedObjectService;

  @service('vr-menu-factory')
  private menuFactory!: VrMenuFactoryService;

  // #endregion SERVICES

  // #region CLASS FIELDS

  private debug = debugLogger('VrRendering');

  // Used to register (mouse) events
  private interaction!: Interaction;

  private canvas!: HTMLCanvasElement;

  private messageMenuQueue!: MenuQueue;

  private hintMenuQueue!: MenuQueue;

  private detachedMenuGroups!: DetachedMenuGroupContainer;

  private floor!: FloorMesh;

  private vrLandscapeRenderer: VrLandscapeRenderer;

  private vrApplicationRenderer: VrApplicationRenderer;

  private remoteUserGroup: THREE.Group;

  private idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  // Contains clonable objects of HMD, camera and controllers for other users
  private hardwareModels: HardwareModels;

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
    return this.localUser.scene;
  }

  get camera(): THREE.PerspectiveCamera {
    return this.localUser.defaultCamera;
  }

  // #endregion GETTERS

  // #region INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    // Load image for delete button
    const closeButtonTexture = new THREE.TextureLoader().load('images/x_white_transp.png');

    this.vrLandscapeRenderer = new VrLandscapeRenderer({
      configuration: this.configuration,
      floor: this.floor, // TODO floor is not initialized yet.
      font: this.args.font,
      landscapeData: this.args.landscapeData,
      worker: this.worker
    });
    this.vrApplicationRenderer = new VrApplicationRenderer({
      appCommRendering: new AppCommunicationRendering(this.configuration, this.currentUser),
      closeButtonTexture,
      configuration: this.configuration,
      font: this.args.font,
      landscapeData: this.args.landscapeData,
      onRemoveApplication: (application) => this.removeApplication(application),
      worker: this.worker,
    });

    this.remoteUserGroup = new THREE.Group();
    this.hardwareModels = new HardwareModels();

    this.menuFactory.injectValues({
      idToRemoteVrUser: this.idToRemoteUser,
      vrApplicationRenderer: this.vrApplicationRenderer,
      vrLandscapeRenderer: this.vrLandscapeRenderer
    });
    this.detachedMenuGroups = new DetachedMenuGroupContainer({
      closeButtonTexture,
      receiver: this.receiver,
      sender: this.sender,
    });
  }

  /**
   * Calls all init functions.
   */
  private initRendering() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initInteraction();
    this.initControllers();
    this.initWebSocket();
  }

  /**
   * Creates a scene, adds the floor and other initial meshes and groups to it.
   */
  private initScene() {
    this.debug('Initializing scene...');

    this.localUser.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.background;

    // Initilize floor.
    const floorMesh = new FloorMesh(FLOOR_SIZE, FLOOR_SIZE);
    this.floor = floorMesh;
    this.scene.add(floorMesh);

    // Initialize lights.
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.scene.add(spotLight);

    const light = new THREE.AmbientLight(new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);

    // Add object meshes and groups.
    this.scene.add(this.landscapeObject3D);
    this.scene.add(this.applicationGroup);
    this.scene.add(this.detachedMenuGroups);

    // Add user meshes and groups.
    this.scene.add(this.localUser.userGroup);
    this.scene.add(this.remoteUserGroup);
  }

  /**
   * Creates a PerspectiveCamera according to canvas size and sets its initial position
   */
  private initCamera() {
    this.debug('Initializing camera...');

    // Create camera.
    const { width, height } = this.canvas;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 2);
    this.localUser.addCamera(camera);

    // Menu group for hints.
    this.hintMenuQueue = new MenuQueue({ detachedMenuGroups: this.detachedMenuGroups });
    this.hintMenuQueue.position.x = 0.035;
    this.hintMenuQueue.position.y = -0.1;
    this.hintMenuQueue.position.z = -0.3;
    this.hintMenuQueue.rotation.x = -0.18;
    camera.add(this.hintMenuQueue);

    // Menu group for message boxes.
    this.messageMenuQueue = new MenuQueue({ detachedMenuGroups: this.detachedMenuGroups });
    this.messageMenuQueue.position.x = 0.035;
    this.messageMenuQueue.position.y = 0.1;
    this.messageMenuQueue.position.z = -0.3;
    this.messageMenuQueue.rotation.x = 0.45;
    camera.add(this.messageMenuQueue);
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

  /**
   * Binds this context to all event handling functions and
   * passes them to a newly created Interaction object
   */
  private initInteraction() {
    this.debug('Initializing interaction...');

    const intersectableObjects = [
      this.landscapeObject3D,
      this.applicationGroup,
      this.floor,
      this.detachedMenuGroups
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
      panning: (delta, button) => this.handlePanning(delta, button),
    }, raycastFilter
    );

    // Add key listener for room positioning
    window.onkeydown = (event: any) => {
      this.handleKeyboard(event);
    };
  }

  private initControllers() {
    this.debug('Initializing controllers...');

    this.localUser.controller1 = this.initController({ gamepadIndex: 0 });
    this.localUser.controller2 = this.initController({ gamepadIndex: 1 });
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

    // Position menus above controller at an angle.
    menuGroup.position.y += 0.15;
    menuGroup.position.z -= 0.15;
    menuGroup.rotateX(340 * THREE.MathUtils.DEG2RAD);

    this.localUser.userGroup.add(controller);
    return controller;
  }

  private async initWebSocket() {
    this.debug('Initializing websocket...');

    this.webSocket.socketCloseCallback = () => this.onSelfDisconnected();
    this.receiver.addMessageListener(this);

    // TODO why does the state have to be set manually?
    this.localUser.connectionStatus = 'offline';

    // TODO move loading of configuration file to web socket service.
    const config = await this.ajax.request('config/config_multiuser.json');
    this.webSocket.applyConfiguration(config);
  }

  // #endregion INITIALIZATION

  // #region DESTRUCTION

  willDestroy() {
    this.applicationGroup.clear();
    this.localUser.reset();
    this.spectateUserService.reset();
    this.vrLandscapeRenderer.cleanUpLandscape();
    this.receiver.removeMessageListener(this);
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
    this.initRendering(); // TODO can this be done in the constructor already?
    this.resize(outerDiv);

    // Start main loop.
    this.renderer.setAnimationLoop(() => this.tick());

    // Load landscape.
    await perform(this.loadNewLandscape);
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
  }

  @action
  onVrSessionEnded() {
    this.debug('WebXRSession ended');
    const outerDiv = this.canvas?.parentElement;
    if (outerDiv) {
      this.resize(outerDiv);
    }
  }

  // #endregion ACTIONS

  // #region MAIN LOOP

  /**
   * Main loop that is called once per frame.
   */
  private tick() {
    this.update();
    this.render();
  }

  /**
   * Updates menus, services and all objects in the scene.
   */
  private update() {
    if (this.isDestroyed) { return; }

    // Compute time since last frame.
    this.deltaTimeService.update();
    const delta = this.deltaTimeService.getDeltaTime();

    // Update controllers and menus.
    this.localUser.updateControllers(delta);
    this.hintMenuQueue.updateMenu(delta);
    this.messageMenuQueue.updateMenu(delta);

    // Update services.
    this.spectateUserService.update();
    this.grabbedObjectService.sendObjectPositions();
    this.updateRemoteUsers(); // TODO remote user service.

    // Send updates to backend.
    this.sendPoses(); // TODO move to update function of local user?
  }

  /**
   * Updates animations of the remote user and sets user name tag to be
   * directly above their head and set rotation such that it looks toward
   * our camera.
   */
  private updateRemoteUsers() {
    this.idToRemoteUser.forEach((user) => {
      // Update animations.
      user.update(this.deltaTimeService.getDeltaTime());
    });
  }

  /**
   * Renders the scene.
   */
  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  // #endregion MAIN LOOP

  // #region LANDSCAPE AND APPLICATION RENDERING

  @task
  private *loadNewLandscape() {
    yield perform(this.vrLandscapeRenderer.populateLandscape);
  }

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
    if (this.applicationGroup.hasApplication(applicationModel.pid)) {
      this.showHint('Application already opened');
      return Promise.resolve(null);
    }

    return this.vrApplicationRenderer.addApplication(applicationModel);
  }

  private removeApplication(application: ApplicationObject3D): Promise<boolean> {
    return new Promise((resolve) => {
      // Ask backend to close the application.
      const nonce = this.sender.sendAppClosed(application.dataModel.pid);

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
    this.applicationGroup.removeApplicationById(application.dataModel.pid);
  }

  private forceRemoveAllApplications() {
    this.applicationGroup.clear();
  }

  // #endregion LANDSCAPE AND APPLICATION RENDERING

  // #region COMPONENT AND COMMUNICATION RENDERING

  private toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D, { onlyLocally = false }: { onlyLocally?: boolean } = {}) {
    EntityManipulation.toggleComponentMeshState(componentMesh, applicationObject3D);
    this.vrApplicationRenderer.addLabels(applicationObject3D);
    this.updateDrawableCommunications(applicationObject3D);

    if (!onlyLocally && this.localUser.isOnline) {
      this.sender.sendComponentUpdate(applicationObject3D.dataModel.pid, componentMesh.dataModel.id, componentMesh.opened, false);
    }
  }

  private closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D, { onlyLocally = false }: { onlyLocally?: boolean } = {}) {
    EntityManipulation.closeAllComponents(applicationObject3D);
    this.updateDrawableCommunications(applicationObject3D);

    if (!onlyLocally && this.localUser.isOnline) {
      this.sender.sendComponentUpdate(applicationObject3D.dataModel.pid, '', false, true);
    }
  }

  private updateDrawableCommunications(applicationObject3D: ApplicationObject3D) {
    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(applicationObject3D.dataModel.pid);
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

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(application.dataModel.pid);
    if (this.isHightlightableAppEntity(object) && drawableComm) {
      Highlighting.highlight(object, application, drawableComm);
    }

    // Send highlighting update.
    if (this.localUser.isOnline) {
      if (object instanceof ComponentMesh || object instanceof ClazzMesh) {
        this.sender.sendHighlightingUpdate(application.dataModel.pid, object.constructor.name,
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

        this.sender.sendHighlightingUpdate(application.dataModel.pid, object.constructor.name,
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
    controller.menuGroup.openMenu(this.menuFactory.buildMainMenu());
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

          this.handlePrimaryInputOn(controller.intersectedObject);
        },
        onButtonPress: (controller: VRController, value: number) => {
          if (!controller.intersectedObject) return;

          const { object, uv } = controller.intersectedObject;

          if (object.parent instanceof BaseMenu && uv) {
            object.parent.triggerPress(uv, value);
          }
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
                this.handleSecondaryInputOn(controller.intersectedObject)
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
    if (!intersection) return;

    this.handlePrimaryInputOn(intersection);
  }

  private handleSingleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    this.handleSecondaryInputOn(intersection);
  }

  private handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    const LEFT_MOUSE_BUTTON = 1;

    if (button === LEFT_MOUSE_BUTTON) {
      // Move landscape further if camera is far away
      const ZOOM_CORRECTION = (Math.abs(this.camera.position.z) / 4.0);

      // Adapt panning speed
      const xOffset = (delta.x / 100) * -ZOOM_CORRECTION;
      const yOffset = (delta.y / 100) * ZOOM_CORRECTION;

      // Adapt camera position (apply panning)
      this.camera.position.x += xOffset;
      this.camera.position.y += yOffset;
    }
  }

  private handleMouseWheel(delta: number) {
    this.camera.position.z += delta * 0.2;
  }

  private handleKeyboard(event: any) {
    switch (event.key) {
      case 'l':
        perform(this.loadNewLandscape);
        break;
      default:
        break;
    }
  }

  private handlePrimaryInputOn({ object, uv, point }: THREE.Intersection) {
    // The user can only interact with menus
    if (this.spectateUserService.spectatedUser) {
      // TODO doesn't this have to be object.parent?
      if (object instanceof UiMenu && object.enableTriggerInSpectorMode && uv) {
        object.triggerDown(uv);
      }
      return;
    }

    // Test which kind of object the user interacted with.
    if (object instanceof ApplicationMesh) {
      this.addApplication(object.dataModel).then((applicationObject3D: ApplicationObject3D) => {
        // Rotate app so that it is aligned with landscape
        applicationObject3D.setRotationFromQuaternion(this.landscapeObject3D.quaternion);
        applicationObject3D.rotateX(90 * THREE.MathUtils.DEG2RAD);
        applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);

        // Position app above clicked point.
        applicationObject3D.position.copy(point);
      });
    } else if (object instanceof CloseIcon) {
      object.close().then((closedSuccessfully: boolean) => {
        if (!closedSuccessfully) this.showHint('Object could not be closed');
      });
    } else if (object.parent instanceof ApplicationObject3D) {
      const application = object.parent;
      if (object instanceof ComponentMesh) {
        this.toggleComponentAndUpdate(object, application);
      } else if (object instanceof FoundationMesh) {
        this.closeAllComponentsAndUpdate(application);
      }
    } else if (object.parent instanceof BaseMenu && uv) {
      object.parent.triggerDown(uv);
    }
  }

  private handleSecondaryInputOn({ object, point }: THREE.Intersection) {
    // The user cannot interact with the environment while spectating another user.
    if (this.spectateUserService.spectatedUser) return;

    // Test which kind of object the user interacted with.
    if (object instanceof FloorMesh) {
      this.localUser.teleportToPosition(point);
    } else if (object.parent instanceof ApplicationObject3D) {
      this.highlightAppEntity(object, object.parent);
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
    let intersection1 = new THREE.Vector3();
    if (controller1) {
      controller1.updateIntersectedObject();
      let point = controller1.intersectedObject?.point;
      if (point) intersection1 = point;
    }
    let controller2 = this.localUser.controller2;
    let intersection2 = new THREE.Vector3();
    if (controller2) {
      controller2.updateIntersectedObject();
      let point = controller2.intersectedObject?.point;
      if (point) intersection2 = point;
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
    this.idToRemoteUser.forEach((user) => {
      user.removeAllObjects3D();
    });
    this.idToRemoteUser.clear();

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
    // If a user triggers multiple connects, simulate a disconnect first
    if (this.idToRemoteUser.has(id)) {
      this.onUserDisconnect({
        event: USER_DISCONNECTED_EVENT,
        id
      });
    }

    const user = new RemoteVrUser({
      userName: name,
      userId: id,
      color: new THREE.Color().fromArray(color),
      state: 'online',
      localUser: this.localUser
    });
    this.idToRemoteUser.set(id, user);

    if (this.hardwareModels.hmd) { user.initCamera(this.hardwareModels.hmd); }

    // Add 3d-models for new user
    this.remoteUserGroup.add(user);

    // Add name tag
    Helper.addDummyNamePlane(user);
    const nameTag = new NameTagMesh(user.userName, user.color);
    user.nameTag = nameTag;
    user.add(nameTag);

    if (showConnectMessage) {
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: 'User connected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
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
    const remoteUser = this.idToRemoteUser.get(userID);
    if (remoteUser) {
      if (controller1) { remoteUser.updateController1(controller1); }
      if (controller2) { remoteUser.updateController2(controller2); }
      if (camera) { remoteUser.updateCamera(camera); }
    }
  }

  /**
   * Updates whether the given user is pinging with the specified controller or not.
   */
  onPingUpdate({
    userID,
    originalMessage: { controllerId, isPinging }
  }: ForwardedMessage<PingUpdateMessage>): void {
    const remoteUser = this.idToRemoteUser.get(userID);
    if (remoteUser) {
      if (controllerId === 0) {
        remoteUser.togglePing1(isPinging);
      } else if (controllerId === 1) {
        remoteUser.togglePing2(isPinging);
      }
    }
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
    const remoteUser = this.idToRemoteUser.get(userID);
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
    // Do not spectate a disconnected user
    if (this.spectateUserService.spectatedUser?.userId === id) {
      this.spectateUserService.deactivate();
    }

    const user = this.idToRemoteUser.get(id);

    if (user) {
      // Remove user's 3d-objects
      user.removeAllObjects3D();
      this.remoteUserGroup.remove(user);
      this.idToRemoteUser.delete(id);

      // Show disconnect notification
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: 'User disconnected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
        time: 3.0,
      }));
    }
  }

  async onInitialLandscape({ detachedMenus, openApps, landscape }: InitialLandscapeMessage): Promise<void> {
    this.forceRemoveAllApplications();
    this.detachedMenuGroups.forceRemoveAllDetachedMenus();

    const { structureLandscapeData } = this.args.landscapeData;

    const tasks: Promise<void>[] = [];
    openApps.forEach((app) => {
      const application = getApplicationInLandscapeById(structureLandscapeData, app.id);
      if (application) {
        tasks.push(this.vrApplicationRenderer.addApplication(application).then((applicationObject3D: ApplicationObject3D) => {
          applicationObject3D.position.fromArray(app.position);
          applicationObject3D.quaternion.fromArray(app.quaternion);
          applicationObject3D.scale.fromArray(app.scale);

          EntityManipulation.restoreComponentState(applicationObject3D,
            new Set(app.openComponents));

          this.vrApplicationRenderer.addLabels(applicationObject3D);

          const drawableComm = this.vrApplicationRenderer.drawableClassCommunications
            .get(applicationObject3D.dataModel.pid);

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

    this.landscapeObject3D.position.fromArray(landscape.position);
    this.landscapeObject3D.quaternion.fromArray(landscape.quaternion);
    this.landscapeObject3D.scale.fromArray(landscape.scale);

    // Wait for applications to be opened before opening the menus. Otherwise
    // the entities do not exist.
    await Promise.all(tasks);

    // initialize detached menus
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
    const { structureLandscapeData } = this.args.landscapeData;
    const application = getApplicationInLandscapeById(structureLandscapeData, id);

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

    const user = this.idToRemoteUser.get(userID);

    if (!user || !user.color) return;

    // Highlight entities in the respective user color
    applicationObject3D.setHighlightingColor(user.color);

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications
      .get(applicationObject3D.dataModel.pid);

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
    const remoteUser = this.idToRemoteUser.get(userID);
    if (!remoteUser) return;

    remoteUser.state = isSpectating ? 'spectating' : 'online';

    const remoteUserHexColor = `#${remoteUser.color.getHexString()}`;
    if (isSpectating) {
      remoteUser.setVisible(false);
      if (this.spectateUserService.spectatedUser && this.spectateUserService.spectatedUser.userId === userID) {
        this.spectateUserService.deactivate();
      }
      this.messageMenuQueue.enqueueMenu(this.menuFactory.buildMessageBoxMenu({
        title: remoteUser.userName,
        text: ' is now spectating',
        color: remoteUserHexColor,
        time: 3.0
      }));
    } else {
      remoteUser.setVisible(true);
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
