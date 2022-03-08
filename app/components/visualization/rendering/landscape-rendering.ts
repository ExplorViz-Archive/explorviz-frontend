import { inject as service } from '@ember/service';
import GlimmerComponent from '@glimmer/component';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import THREE from 'three';
import Configuration from 'explorviz-frontend/services/configuration';

import updateCameraZoom from 'explorviz-frontend/utils/landscape-rendering/zoom-calculator';
import * as CommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import PlaneMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-mesh';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import Labeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import { Application, Node } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import computeApplicationCommunication from 'explorviz-frontend/utils/landscape-rendering/application-communication-computer';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import { perform } from 'ember-concurrency-ts';
import { ELK, ElkNode } from 'elkjs/lib/elk-api';
import { Position2D } from 'explorviz-frontend/modifiers/interaction-modifier';
import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import UserSettings from 'explorviz-frontend/services/user-settings';
import VrTimestampService from 'virtual-reality/services/vr-timestamp';
import TimestampRepository, { Timestamp } from 'explorviz-frontend/services/repos/timestamp-repository';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import { SelfConnectedMessage } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import { ForwardedMessage } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { InitialLandscapeMessage } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { MenuDetachedForwardMessage } from 'virtual-reality/utils/vr-message/receivable/menu-detached-forward';
import { UserDisconnectedMessage } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import { MousePingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/mouse-ping-update';
import { ObjectMovedMessage } from 'virtual-reality/utils/vr-message/sendable/object_moved';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping_update';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { DetachedMenuClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/detached_menu_closed';
import { SpectatingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/spectating_update';
import { TimestampUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/timetsamp_update';
import { UserControllerConnectMessage } from 'virtual-reality/utils/vr-message/sendable/user_controller_connect';
import { UserControllerDisconnectMessage } from 'virtual-reality/utils/vr-message/sendable/user_controller_disconnect';
import { UserPositionsMessage } from 'virtual-reality/utils/vr-message/sendable/user_positions';
import WebSocketService from 'virtual-reality/services/web-socket';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';
import VrRoomSerializer from 'virtual-reality/services/vr-room-serializer';
import VrLandscapeRenderer from 'virtual-reality/services/vr-landscape-renderer';

interface Args {
  readonly id: string;
  readonly landscapeData: LandscapeData;
  readonly font: THREE.Font;
  readonly visualizationPaused: boolean;
  readonly elk: ELK;
  readonly selectedTimestampRecords: Timestamp[];
  showApplication(applicationId: string): void;
  openDataSelection(): void;
  toggleVisualizationUpdating(): void;
  switchToAR(): void,
  switchToVR(): void,
}

interface SimplePlaneLayout {
  height: number;
  width: number;
  positionX: number;
  positionY: number;
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity: Node | Application,
};

export type Point = {
  x: number,
  y: number
};

export interface Layout1Return {
  graph: ElkNode,
  modelIdToPoints: Map<string, Point[]>,
}

export interface Layout3Return {
  modelIdToLayout: Map<string, SimplePlaneLayout>,
  modelIdToPoints: Map<string, Point[]>,
}

/**
* Renderer for landscape visualization.
*
* @class Landscape-Rendering-Component
* @extends GlimmerComponent
*
* @module explorviz
* @submodule visualization.rendering
*/
export default class LandscapeRendering extends GlimmerComponent<Args> implements VrMessageListener {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service()
  worker!: any;

  @service('user-settings')
  userSettings!: UserSettings;

  scene!: THREE.Scene;

  webglrenderer!: THREE.WebGLRenderer;

  @tracked
  hammerInteraction: HammerInteraction;

  @tracked
  camera!: THREE.PerspectiveCamera;

  canvas!: HTMLCanvasElement;

  debug = debugLogger('LandscapeRendering');

  // Incremented every time a frame is rendered
  animationFrameId = 0;

  // Is set to false until first landscape is rendered
  initDone: boolean;

  // Used to display performance and memory usage information
  threePerformance: THREEPerformance | undefined;

  // Maps models to a computed layout
  modelIdToPlaneLayout: Map<string, PlaneLayout> | null = null;

  // Extended Object3D which manages landscape meshes
  readonly landscapeObject3D: LandscapeObject3D;

  // Provides functions to label landscape meshes
  readonly labeler = new Labeler();

  readonly imageLoader: ImageLoader = new ImageLoader();

  hoveredObject: BaseMesh | null = null;

  get rightClickMenuItems() {
    const pauseItemtitle = this.args.visualizationPaused ? 'Resume Visualization' : 'Pause Visualization';

    return [
      { title: 'Reset View', action: this.resetView },
      { title: pauseItemtitle, action: this.args.toggleVisualizationUpdating },
      { title: 'Open Sidebar', action: this.args.openDataSelection },
      { title: 'Enter AR', action: this.args.switchToAR },
      { title: 'Enter VR', action: this.args.switchToVR },
    ];
  }

  @tracked
  popupData: PopupData | null = null;

  spheres: Map<string, Array<THREE.Mesh>> = new Map();

  spheresIndex = 0;

  get font() {
    return this.args.font;
  }

  get landSettings() {
    return this.userSettings.landscapeSettings;
  }

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.initDone = false;
    this.debug('Constructor called');

    this.render = this.render.bind(this);
    this.hammerInteraction = HammerInteraction.create();

    this.landscapeObject3D = new LandscapeObject3D(this.args.landscapeData.structureLandscapeData);
  }

  onUserDisconnect({ id }: UserDisconnectedMessage): void {
    const removedUser = this.remoteUsers.removeRemoteUserById(id);
    if (removedUser) {
      AlertifyHandler.showAlertifyError(`User ${removedUser.userName} disconnected.`);
    }
  }

  @service('vr-room-serializer')
  private roomSerializer!: VrRoomSerializer;

  @service('vr-landscape-renderer')
  private vrLandscapeRenderer!: VrLandscapeRenderer;

  async onInitialLandscape({
    landscape,
    openApps,
    detachedMenus,
  }: InitialLandscapeMessage): Promise<void> {
    await this.roomSerializer.restoreRoom({ landscape, openApps, detachedMenus });

    // this.landscapeMarker.add(this.vrLandscapeRenderer.landscapeObject3D);
    // this.arSettings.updateLandscapeOpacity();

    // this.vrApplicationRenderer.getOpenApplications().forEach((applicationObject3D) => {
    //   this.addApplicationToMarker(applicationObject3D);
    // });
  }

  onMenuDetached(msg: MenuDetachedForwardMessage): void {
  }
  onUserPositions(msg: ForwardedMessage<UserPositionsMessage>): void {
  }
  onUserControllerConnect(msg: ForwardedMessage<UserControllerConnectMessage>): void {
  }
  onUserControllerDisconnect(msg: ForwardedMessage<UserControllerDisconnectMessage>): void {
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
  onAppClosed(msg: ForwardedMessage<AppClosedMessage>): void {
    throw new Error('Method not implemented.');
  }
  onDetachedMenuClosed(msg: ForwardedMessage<DetachedMenuClosedMessage>): void {
  }
  onPingUpdate(msg: ForwardedMessage<PingUpdateMessage>): void {
    throw new Error('Method not implemented.');
  }
  onMousePingUpdate(msg: ForwardedMessage<MousePingUpdateMessage>): void {
    throw new Error('Method not implemented.');
  }
  onTimestampUpdate(msg: ForwardedMessage<TimestampUpdateMessage>): void {
    throw new Error('Method not implemented.');
  }
  onObjectMoved(msg: ForwardedMessage<ObjectMovedMessage>): void {
  }
  onComponentUpdate(msg: ForwardedMessage<ComponentUpdateMessage>): void {
    throw new Error('Method not implemented.');
  }
  onHighlightingUpdate(msg: ForwardedMessage<HighlightingUpdateMessage>): void {
    throw new Error('Method not implemented.');
  }
  onSpectatingUpdate(msg: ForwardedMessage<SpectatingUpdateMessage>): void {
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

  @action
  async outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.initThreeJs();
    this.render();

    this.resize(outerDiv);

    await perform(this.loadNewLandscape);
    this.initDone = true;
  }

  /**
   * Calls all three related init functions and adds the three
   * performance panel if it is activated in user settings
   */
  initThreeJs() {
    this.initServices();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    // this.initWebSocket()
  }

  @service('vr-timestamp')
  private timestampService!: VrTimestampService;

  @service('repos/timestamp-repository')
  private timestampRepo!: TimestampRepository;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('vr-message-receiver')
  private receiver!: VrMessageReceiver;

  @service('web-socket')
  private webSocket!: WebSocketService;

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  private async initWebSocket() {
    this.debug('Initializing websocket...');

    this.webSocket.socketCloseCallback = () => this.onSelfDisconnected();
    this.receiver.addMessageListener(this);
  }

  initServices() {
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
   * Creates a scene, its background and adds a landscapeObject3D to it
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.backgroundColor;

    this.scene.add(this.landscapeObject3D);

    this.debug('Scene created');
  }

  /**
   * Creates a PerspectiveCamera according to canvas size and sets its initial position
   */
  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 0);
    this.localUser.defaultCamera = this.camera
    this.debug('Camera added');
  }

  /**
   * Initiates a WebGLRenderer
   */
  initRenderer() {
    const { width, height } = this.canvas;
    this.webglrenderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.webglrenderer.setPixelRatio(window.devicePixelRatio);
    this.webglrenderer.setSize(width, height);
    this.localUser.renderer = this.webglrenderer
    this.debug('Renderer set up');
  }

  /**
   * Creates a DirectionalLight and adds it to the scene
   */
  initLights() {
    this.debug('Lights added');
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region COLLABORATIVE

  @action
  setPerspective(position: number[] /* , rotation: number[] */) {
    this.camera.position.fromArray(position);
  }

  // #endregion COLLABORATIVE

  // #region RENDERING LOOP

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    const { value: showFpsCounter } = this.userSettings.landscapeSettings.showFpsCounter;

    if (showFpsCounter && !this.threePerformance) {
      this.threePerformance = new THREEPerformance();
    } else if (!showFpsCounter && this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
      this.threePerformance = undefined;
    }

    if (this.threePerformance) {
      this.threePerformance.threexStats.update(this.webglrenderer);
      this.threePerformance.stats.begin();
    }

    this.webglrenderer.render(this.scene, this.camera);

    this.scaleSpheres();

    if (this.threePerformance) {
      this.threePerformance.stats.end();
    }
  }

  scaleSpheres() {
    this.spheres.forEach((sphereArray) => {
      for (let i = 0; i < sphereArray.length; i++) {
        const sphere = sphereArray[i];
        sphere.scale.multiplyScalar(0.98);
        sphere.scale.clampScalar(0.01, 1);
      }
    });
  }

  @action
  repositionSphere(vec: THREE.Vector3, user: string, color: string) {
    let spheres = this.spheres.get(user);
    if (!spheres) {
      spheres = this.createSpheres(color);
      this.spheres.set(user, spheres);
    }

    // TODO independent sphereIndex for each user?
    spheres[this.spheresIndex].position.copy(vec);
    spheres[this.spheresIndex].scale.set(1, 1, 1);
    this.spheresIndex = (this.spheresIndex + 1) % spheres.length;
  }

  createSpheres(color: string): Array<THREE.Mesh> {
    const spheres = [];
    const sphereGeometry = new THREE.SphereBufferGeometry(0.08, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color });

    for (let i = 0; i < 30; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(sphere);
      spheres.push(sphere);
    }
    return spheres;
  }

  // #endregion RENDERING LOOP

  // #region COMPONENT AND SCENE CLEAN-UP

  /**
 * This overridden Ember Component lifecycle hook enables calling
 * ExplorViz's custom cleanup code.
 *
 * @method willDestroy
 */
  willDestroy() {
    super.willDestroy();
    cancelAnimationFrame(this.animationFrameId);

    // Clean up WebGL rendering context by forcing context loss
    const gl = this.canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    const glExtension = gl.getExtension('WEBGL_lose_context');
    if (!glExtension) return;
    glExtension.loseContext();

    if (this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
    }

    this.debug('cleanup landscape rendering');

    // Clean up all remaining meshes
    this.landscapeObject3D.removeAllChildren();
    this.labeler.clearCache();
  }

  // #endregion COMPONENT AND SCENE CLEAN-UP

  // #region ACTIONS

  @action
  resize(outerDiv: HTMLElement) {
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);

    // Update renderer and camera according to canvas size
    this.webglrenderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
 * Inherit this function to update the scene with a new renderingModel. It
 * automatically removes every mesh from the scene and finally calls
 * the (overridden) "populateScene" function. Add your custom code
 * as shown in landscape-rendering.
 *
 * @method cleanAndUpdateScene
 */
  @action
  async cleanAndUpdateScene() {
    await perform(this.populateScene);

    this.debug('clean and populate landscape-rendering');
  }

  // Listener-Callbacks. Override in extending components
  @action
  resetView() {
    if (this.modelIdToPlaneLayout) {
      this.camera.position.set(0, 0, 0);
      const landscapeRect = this.landscapeObject3D.getMinMaxRect(this.modelIdToPlaneLayout);

      updateCameraZoom(landscapeRect, this.camera, this.webglrenderer);
    }
  }

  @action
  onUpdated() {
    if (this.initDone) {
      perform(this.loadNewLandscape);
    }
  }

  // #endregion ACTIONS

  // #region SCENE POPULATION

  @task *
    loadNewLandscape() {
    this.landscapeObject3D.dataModel = this.args.landscapeData.structureLandscapeData;
    yield perform(this.populateScene);
  }

  /**
 * Computes new meshes for the landscape and adds them to the scene
 *
 * @method populateScene
 */
  @restartableTask *
    populateScene() {
    this.debug('populate landscape-rendering');

    const { structureLandscapeData, dynamicLandscapeData } = this.args.landscapeData;
    this.landscapeObject3D.dataModel = structureLandscapeData;

    // Run Klay layouting in 3 steps within workers
    try {
      const applicationCommunications = computeApplicationCommunication(structureLandscapeData,
        dynamicLandscapeData);

      // Do layout pre-processing (1st step)
      const { graph, modelIdToPoints }: Layout1Return = yield this.worker.postMessage('layout1', {
        structureLandscapeData,
        applicationCommunications,
      });

      // Run actual klay function (2nd step)
      const newGraph: ElkNode = yield this.args.elk.layout(graph);

      // Post-process layout graph (3rd step)
      const layoutedLandscape: Layout3Return = yield this.worker.postMessage('layout3', {
        graph: newGraph,
        modelIdToPoints,
        structureLandscapeData,
        applicationCommunications,
      });

      // Clean old landscape
      this.landscapeObject3D.removeAllChildren();
      this.landscapeObject3D.resetMeshReferences();

      const {
        modelIdToLayout,
        modelIdToPoints: modelIdToPointsComplete,
      }: Layout3Return = layoutedLandscape;

      const modelIdToPlaneLayout = new Map<string, PlaneLayout>();

      this.modelIdToPlaneLayout = modelIdToPlaneLayout;

      // Convert the simple to a PlaneLayout map
      LandscapeRendering.convertToPlaneLayoutMap(modelIdToLayout, modelIdToPlaneLayout);

      // Compute center of landscape
      const landscapeRect = this.landscapeObject3D.getMinMaxRect(modelIdToPlaneLayout);
      const centerPoint = landscapeRect.center;

      // Update camera zoom accordingly
      updateCameraZoom(landscapeRect, this.camera, this.webglrenderer);

      // Render all landscape entities
      const { nodes } = structureLandscapeData;

      // Draw boxes for nodes
      nodes.forEach((node) => {
        this.renderNode(node, modelIdToPlaneLayout.get(node.id), centerPoint);

        const { applications } = node;

        // Draw boxes for applications
        applications.forEach((application) => {
          this.renderApplication(application, modelIdToPlaneLayout.get(application.id),
            centerPoint);
        });
      });

      // Render application communication

      const color = this.configuration.landscapeColors.communicationColor;

      const tiles = CommunicationRendering.computeCommunicationTiles(applicationCommunications,
        modelIdToPointsComplete, color);

      CommunicationRendering.addCommunicationLineDrawing(tiles, this.landscapeObject3D,
        centerPoint);

      this.debug('Landscape loaded');
    } catch (e) {
      // console.log(e);
    }
  }

  /**
   * Creates & positions a node mesh with corresponding labels.
   * Then adds it to the landscapeObject3D.
   *
   * @param node Data model for the node mesh
   * @param layout Layout data to position the mesh correctly
   * @param centerPoint Offset of landscape object
   */
  renderNode(node: Node, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector2) {
    if (!layout) { return; }

    // Create node mesh
    const nodeMesh = new NodeMesh(layout, node, this.configuration.landscapeColors.nodeColor);

    // Create and add label + icon
    nodeMesh.setToDefaultPosition(centerPoint);

    // Label with own ip-address by default
    const labelText = nodeMesh.getDisplayName();

    this.labeler.addNodeTextLabel(nodeMesh, labelText, this.font,
      this.configuration.landscapeColors.nodeTextColor);

    // Add to scene
    this.landscapeObject3D.add(nodeMesh);
  }

  /**
   * Creates & positions an application mesh with corresponding labels.
   * Then adds it to the landscapeObject3D.
   *
   * @param application Data model for the application mesh
   * @param layout Layout data to position the mesh correctly
   * @param centerPoint Offset of landscape object
   */
  renderApplication(application: Application, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector2) {
    if (!layout) { return; }

    // Create application mesh
    const applicationMesh = new ApplicationMesh(layout, application,
      this.configuration.landscapeColors.applicationColor);
    applicationMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    this.labeler.addApplicationTextLabel(applicationMesh, application.name, this.font,
      this.configuration.landscapeColors.applicationTextColor);
    this.labeler.addApplicationLogo(applicationMesh, this.imageLoader);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
  }

  // #endregion SCENE POPULATION

  // #region SCENE MANIPULATION

  @action
  updateColors() {
    this.scene.traverse((object3D) => {
      if (object3D instanceof BaseMesh) {
        object3D.updateColor();
      }
    });
  }

  // #endregion SCENE MANIPULATION

  // #region MOUSE EVENT HANDLER

  @action
  handleDoubleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;
    const mesh = intersection.object;

    this.doubleClickOnMesh(mesh);
  }

  @action
  doubleClickOnMesh(mesh: THREE.Object3D) {
    // Handle application
    if (mesh instanceof ApplicationMesh) {
      this.openApplicationIfExistend(mesh);
      // Handle nodeGroup
    }
  }

  @action
  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    const LEFT_MOUSE_BUTTON = 1;

    if (button === LEFT_MOUSE_BUTTON) {
      // Move landscape further if camera is far away
      const ZOOM_CORRECTION = (Math.abs(this.camera.position.z) / 4.0);

      // Divide delta by 100 to achieve reasonable panning speeds
      const xOffset = (delta.x / 100) * -ZOOM_CORRECTION;
      const yOffset = (delta.y / 100) * ZOOM_CORRECTION;

      // Adapt camera position (apply panning)
      this.camera.position.x += xOffset;
      this.camera.position.y += yOffset;
    }
  }

  @action
  handleMouseWheel(delta: number) {
    // Hide (old) tooltip
    this.popupData = null;

    const scrollDelta = delta * 1.5;

    const landscapeVisible = this.camera.position.z + scrollDelta > 0.2;

    // Apply zoom, prevent to zoom behind 2D-Landscape (z-direction)
    if (landscapeVisible) {
      this.camera.position.z += scrollDelta;
    }
  }

  @action
  handleMouseMove(intersection: THREE.Intersection | null) {
    if (!intersection) return;
    const mesh = intersection.object;
    this.mouseMoveOnMesh(mesh);
  }

  @action
  mouseMoveOnMesh(mesh: THREE.Object3D) {
    const { value: enableHoverEffects } = this.landSettings.enableHoverEffects;

    // Update hover effect
    if (mesh === undefined && this.hoveredObject) {
      this.hoveredObject.resetHoverEffect();
      this.hoveredObject = null;
    } else if (mesh instanceof PlaneMesh && enableHoverEffects) {
      if (this.hoveredObject) { this.hoveredObject.resetHoverEffect(); }

      this.hoveredObject = mesh;
      mesh.applyHoverEffect();
    }

    // Do not show popups while mouse is moving
    this.popupData = null;
  }

  @action
  handleMouseOut() {
    this.popupData = null;
  }

  /*   @action
  handleMouseEnter() {
  } */

  @action
  handleMouseStop(intersection: THREE.Intersection | null, mouseOnCanvas: Position2D) {
    if (!intersection) return;
    const mesh = intersection.object;

    this.mouseStopOnMesh(mesh, mouseOnCanvas);
  }

  @action
  mouseStopOnMesh(mesh: THREE.Object3D, mouseOnCanvas: Position2D) {
    if (mesh instanceof NodeMesh || mesh instanceof ApplicationMesh) {
      this.popupData = {
        mouseX: mouseOnCanvas.x,
        mouseY: mouseOnCanvas.y,
        entity: mesh.dataModel,
      };
    }
  }

  // #endregion MOUSE EVENT HANDLER

  /**
   * Takes an application mesh and tries to enter application-rendering
   * with that application. Displays an errors message if application does
   * not contain any data.
   *
   * @param applicationMesh Mesh of application which shall be opened
   */
  @action
  openApplicationIfExistend(applicationMesh: ApplicationMesh) {
    const application = applicationMesh.dataModel;
    // No data => show message
    if (application.packages.length === 0) {
      const message = `Sorry, there is no information for application <b>
        ${application.name}</b> available.`;

      AlertifyHandler.showAlertifyMessage(message);
    } else {
      // data available => open application-rendering
      AlertifyHandler.closeAlertifyMessages();
      this.args.showApplication(application.id);
    }
  }

  /**
   * Takes a map with plain JSON layout objects and creates PlaneLayout objects from it
   *
   * @param layoutedApplication Map containing plain JSON layout data
   */
  static convertToPlaneLayoutMap(modelIdToSimpleLayout: Map<string, SimplePlaneLayout>,
    modelIdToPlaneLayout: Map<string, PlaneLayout>) {
    // Construct a layout map from plain JSON layouts
    modelIdToSimpleLayout.forEach((simplePlaneLayout: SimplePlaneLayout, modelId: string) => {
      const planeLayoutObject = new PlaneLayout();
      planeLayoutObject.height = simplePlaneLayout.height;
      planeLayoutObject.width = simplePlaneLayout.width;
      planeLayoutObject.positionX = simplePlaneLayout.positionX;
      planeLayoutObject.positionY = simplePlaneLayout.positionY;

      modelIdToPlaneLayout.set(modelId, planeLayoutObject);
    });
  }


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

    // // Reset highlighting colors.
    // this.webglrenderer.getOpenApplications().forEach((application) => {
    //   application.setHighlightingColor(
    //     this.configuration.applicationColors.highlightedEntityColor,
    //   );
    // });

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
}
