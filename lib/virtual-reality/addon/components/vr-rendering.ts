import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import Configuration from 'explorviz-frontend/services/configuration';
import System from 'explorviz-frontend/models/system';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import NodeGroupMesh from 'explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import Node from 'explorviz-frontend/models/node';
import Interaction from 'explorviz-frontend/utils/interaction';
import Application from 'explorviz-frontend/models/application';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import { task } from 'ember-concurrency-decorators';
import updateCameraZoom from 'explorviz-frontend/utils/landscape-rendering/zoom-calculator';
import * as LandscapeCommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import reduceLandscape, { ReducedLandscape } from 'explorviz-frontend/utils/landscape-rendering/model-reducer';
import FloorMesh from 'virtual-reality/utils/floor-mesh';
import WebXRPolyfill from 'webxr-polyfill';
import LandscapeLabeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import reduceApplication from 'explorviz-frontend/utils/application-rendering/model-reducer';
import XRControllerModelFactory from 'virtual-reality/utils/XRControllerModelFactory';
import Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import CurrentUser from 'explorviz-frontend/services/current-user';
import ApplicationGroup from 'virtual-reality/utils/application-group';
import CloseIcon from 'virtual-reality/utils/close-icon';

// Declare globals
/* global VRButton */

interface Args {
  readonly font: THREE.Font;
}

type LayoutData = {
  height: number,
  width: number,
  depth: number,
  positionX: number,
  positionY: number,
  positionZ: number
};

export default class VrRendering extends Component<Args> {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service('current-user')
  currentUser!: CurrentUser;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service()
  worker!: any;

  // Plain JSON variant of the landscape with fewer properties, used for layouting
  reducedLandscape: ReducedLandscape|null = null;

  // Maps models to a computed layout
  modelIdToPlaneLayout: Map<string, PlaneLayout>|null = null;

  debug = debugLogger('VrRendering');

  // Used to register (mouse) events
  interaction!: Interaction;

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  camera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  controller1: THREE.Group;

  controller2: THREE.Group;

  user: THREE.Group;

  applicationGroup: ApplicationGroup;

  boxDepth: number;

  appScaleFactor: number;

  defaultComponentHeight: number;

  floor!: FloorMesh;

  closeButtonTexture: THREE.Texture;

  get font() {
    return this.args.font;
  }

  get componentHeight() {
    return this.defaultComponentHeight * this.appScaleFactor;
  }

  readonly imageLoader: ImageLoader = new ImageLoader();

  readonly entityRendering: EntityRendering;

  readonly appCommRendering: AppCommunicationRendering;

  readonly entityManipulation: EntityManipulation;

  // Provides functions to label landscape meshes
  readonly landscapeLabeler = new LandscapeLabeler();

  // Extended Object3D which manages landscape meshes
  readonly landscapeObject3D!: LandscapeObject3D;

  teleportArea: THREE.Mesh|undefined;

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');
    this.boxDepth = 0.15;

    this.defaultComponentHeight = 1.5;
    this.appScaleFactor = 0.01;

    this.raycaster = new THREE.Raycaster();
    this.controller1 = new THREE.Group();
    this.controller2 = new THREE.Group();
    this.user = new THREE.Group();
    this.applicationGroup = new ApplicationGroup();

    this.entityRendering = new EntityRendering(this.configuration, this.componentHeight);

    this.appCommRendering = new AppCommunicationRendering(this.configuration, this.currentUser);

    // Load image for delete button
    this.closeButtonTexture = new THREE.TextureLoader().load('images/x_white_transp.png');

    this.entityManipulation = new EntityManipulation(
      this.appCommRendering, null, this.componentHeight,
    );

    const { replayLandscape } = this.landscapeRepo;
    if (replayLandscape) {
      this.landscapeObject3D = new LandscapeObject3D(replayLandscape);

      // Rotate landscape such that it lays flat on the floor
      this.landscapeObject3D.translateY((this.boxDepth) / 2);
      this.landscapeObject3D.rotateX(-90 * THREE.MathUtils.DEG2RAD);
      this.landscapeObject3D.updateMatrix();
    }
  }

  /**
     * Calls all three related init functions and adds the three
     * performance panel if it is activated in user settings
     */
  initThreeJs() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initInteraction();
    this.initControllers();
  }

  /**
     * Creates a scene, its background and adds a landscapeObject3D to it
     */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.configuration.landscapeColors.background);
    this.scene.add(this.landscapeObject3D);

    // Add floor
    // TODO: Increase floor size if landscape is too large
    const floorSize = 10;
    const floorMesh = new FloorMesh(floorSize, floorSize);
    this.floor = floorMesh;
    this.scene.add(floorMesh);
    this.scene.add(this.applicationGroup);

    this.scene.add(this.user);

    this.debug('Scene created');
  }

  /**
     * Creates a PerspectiveCamera according to canvas size and sets its initial position
     */
  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 1, 2);
    this.user.add(this.camera);
    this.debug('Camera added');
  }

  /**
     * Initiates a WebGLRenderer
     */
  initRenderer() {
    const { width, height } = this.canvas;
    this.renderer = new THREE.WebGLRenderer({
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
    this.debug('Renderer set up');
  }

  /**
     * Creates a SpotLight and an AmbientLight and adds it to the scene
     */
  initLights() {
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.scene.add(spotLight);

    const light = new THREE.AmbientLight(new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);
    this.debug('Lights added');
  }

  /**
   * Binds this context to all event handling functions and
   * passes them to a newly created Interaction object
   */
  initInteraction() {
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handlePanning = this.handlePanning.bind(this);

    this.interaction = new Interaction(this.canvas, this.camera, this.renderer,
      this.landscapeObject3D, {
        mouseWheel: this.handleMouseWheel,
        panning: this.handlePanning,
      });

    // Add key listener for room positioning
    window.onkeydown = (event: any) => {
      this.handleKeyboard(event);
    };
  }

  initControllers() {
    const controllerModelFactory = new XRControllerModelFactory();
    this.controller1 = this.renderer.xr.getController(0);
    this.controller2 = this.renderer.xr.getController(1);

    const geometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)],
    );

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    for (let controllerID = 0; controllerID < 2; controllerID++) {
      const controller = this.renderer.xr.getController(controllerID);
      if (controller) {
        const controllerGrip = this.renderer.xr.getControllerGrip(controllerID);

        controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));

        controller.add(line.clone());

        this.user.add(controller);
        this.user.add(controllerGrip);
      }
    }

    this.controller1.addEventListener('selectstart', this.onSelectStart1.bind(this));
    this.controller2.addEventListener('selectstart', this.onSelectStart2.bind(this));
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION

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

    this.initThreeJs();
    outerDiv.appendChild(VRButton.createButton(this.renderer));

    this.renderer.setAnimationLoop(this.render.bind(this));

    this.resize(outerDiv);

    await this.loadNewLandscape.perform();
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

    // Update renderer and camera according to new canvas size
    this.renderer.setSize(width, height);
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
    await this.populateScene.perform();

    this.debug('clean and populate landscape-rendering');
  }

  // #endregion ACTIONS

  // #region RENDERING AND SCENE POPULATION

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    if (this.controller1) { this.intersectObjects(this.controller1, 'controller1'); }
    if (this.controller2) { this.intersectObjects(this.controller2, 'controller2'); }

    this.renderer.render(this.scene, this.camera);
  }

  @task
  // eslint-disable-next-line
  loadNewLandscape = task(function* (this: LandscapeRendering) {
    const { replayLandscape } = this.landscapeRepo;
    if (!replayLandscape) return;
    this.landscapeObject3D.dataModel = replayLandscape;
    this.reducedLandscape = reduceLandscape(replayLandscape);
    yield this.populateScene.perform();
  });

  /**
 * Computes new meshes for the landscape and adds them to the scene
 *
 * @method populateScene
 */
  // @ts-ignore
  @task({ restartable: true })
  // eslint-disable-next-line
populateScene = task(function* (this: VrRendering) {
    this.debug('populate landscape-rendering');

    const { replayLandscape } = this.landscapeRepo;
    if (!replayLandscape) return;

    const emberLandscape = replayLandscape;
    this.landscapeObject3D.dataModel = emberLandscape;

    if (!emberLandscape) {
      return;
    }

    const openEntitiesIds = this.landscapeObject3D.openEntityIds;

    // Run Klay layouting in 3 steps within workers
    try {
    // Do layout pre-processing (1st step)
      const {
        graph,
        modelIdToPoints,
      }: any = yield this.worker.postMessage('layout1', { reducedLandscape: this.reducedLandscape, openEntitiesIds });

      // Run actual klay function (2nd step)
      const newGraph: any = yield this.worker.postMessage('klay', { graph });

      // Post-process layout graph (3rd step)
      const layoutedLandscape: any = yield this.worker.postMessage('layout3', {
        graph: newGraph,
        modelIdToPoints,
        reducedLandscape: this.reducedLandscape,
        openEntitiesIds,
      });

      // Clean old landscape
      this.landscapeObject3D.removeAllChildren();
      this.landscapeObject3D.resetMeshReferences();

      const { modelIdToLayout, modelIdToPoints: modelIdToPointsComplete } = layoutedLandscape;

      const modelIdToPlaneLayout = new Map<string, PlaneLayout>();

      this.modelIdToPlaneLayout = modelIdToPlaneLayout;

      // Convert the simple to a PlaneLayout map
      LandscapeRendering.convertToPlaneLayoutMap(modelIdToLayout, modelIdToPlaneLayout);

      // Scale landscape extensions
      Array.from(modelIdToPlaneLayout.values()).forEach((layout) => {
        layout.scale(0.1);
      });

      // Compute center of landscape
      const landscapeRect = this.landscapeObject3D.getMinMaxRect(modelIdToPlaneLayout);
      const centerPoint = landscapeRect.center;

      // Update camera zoom accordingly
      updateCameraZoom(landscapeRect, this.camera, this.renderer);

      // Render all landscape entities
      const { systems } = emberLandscape;

      // Render systems, nodegroups, nodes & applications
      if (systems) {
      // Draw boxes for systems
        systems.forEach((system) => {
          this.renderSystem(system, modelIdToPlaneLayout.get(system.get('id')), centerPoint);

          const nodeGroups = system.nodegroups;

          // Draw boxes for nodegroups
          nodeGroups.forEach((nodeGroup: NodeGroup) => {
            this.renderNodeGroup(nodeGroup, modelIdToPlaneLayout.get(nodeGroup.get('id')), centerPoint);
            const nodes = nodeGroup.get('nodes');

            // Draw boxes for nodes
            nodes.forEach((node) => {
              this.renderNode(node, modelIdToPlaneLayout.get(node.get('id')), centerPoint);

              const applications = node.get('applications');

              // Draw boxes for applications
              applications.forEach((application) => {
                this.renderApplication(application, modelIdToPlaneLayout.get(application.get('id')), centerPoint);
              });
            });
          });
        });
      }

      // Render application communication
      const appCommunications = emberLandscape.get('totalApplicationCommunications');

      if (appCommunications) {
        const color = this.configuration.landscapeColors.communication;
        const tiles = LandscapeCommunicationRendering.computeCommunicationTiles(appCommunications,
          modelIdToPointsComplete, color);

        LandscapeCommunicationRendering.addCommunicationLineDrawing(tiles, this.landscapeObject3D,
          centerPoint);
      }

      this.debug('Landscape loaded');
    } catch (e) {
    // console.log(e);
    }
  });

  // #endregion RENDERING AND SCENE POPULATION

  // #region LANDSCAPE RENDERING

  /**
 * Creates & positions a system mesh with corresponding labels.
 * Then adds it to the landscapeObject3D.
 *
 * @param system Data model for the system mesh
 * @param layout Layout data to position the mesh correctly
 * @param centerPoint Offset of landscape object
 */
  renderSystem(system: System, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector2) {
    if (!layout) { return; }

    // Create system mesh
    const systemMesh = new SystemMesh(
      layout,
      system,
      this.configuration.landscapeColors.system,
      this.configuration.applicationColors.highlightedEntity,
      this.boxDepth,
    );

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);
    const labelText = system.get('name');
    this.landscapeLabeler.addSystemTextLabel(systemMesh, labelText, this.font,
      this.configuration.landscapeColors.systemText, 0.04, 0.06);
    this.landscapeLabeler.addCollapseSymbol(systemMesh, this.font,
      this.configuration.landscapeColors.collapseSymbol, 0.035, 0.035, 0.035);

    // Add to scene
    this.landscapeObject3D.add(systemMesh);
  }

  /**
 * Creates & positions a nodegroup mesh with corresponding labels.
 * Then adds it to the landscapeObject3D.
 *
 * @param nodeGroup Data model for the nodegroup mesh
 * @param layout Layout data to position the mesh correctly
 * @param centerPoint Offset of landscape object
 */
  renderNodeGroup(nodeGroup: NodeGroup, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector2) {
    if (!layout) { return; }

    // Create nodeGroup mesh
    const nodeGroupMesh = new NodeGroupMesh(layout, nodeGroup,
      this.configuration.landscapeColors.nodegroup,
      this.configuration.applicationColors.highlightedEntity,
      this.boxDepth);

    nodeGroupMesh.setToDefaultPosition(centerPoint);

    // Add collapse symbol (+/-)
    this.landscapeLabeler.addCollapseSymbol(nodeGroupMesh, this.font,
      this.configuration.landscapeColors.collapseSymbol, 0.035, 0.035, 0.035);

    // Add to scene
    this.landscapeObject3D.add(nodeGroupMesh);
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
    const nodeMesh = new NodeMesh(layout, node, this.configuration.landscapeColors.node,
      this.configuration.applicationColors.highlightedEntity, this.boxDepth);

    // Create and add label + icon
    nodeMesh.setToDefaultPosition(centerPoint);

    const nodeGroupId = node.get('parent').get('id');
    const nodeGroupMesh = this.landscapeObject3D.getMeshbyModelId(nodeGroupId);

    // Label with own ip-address by default
    const labelText = nodeMesh.getDisplayName(nodeGroupMesh);

    this.landscapeLabeler.addNodeTextLabel(nodeMesh, labelText, this.font,
      this.configuration.landscapeColors.nodeText, 0.022, 0.02);

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
      this.configuration.landscapeColors.application,
      this.configuration.applicationColors.highlightedEntity, this.boxDepth);
    applicationMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    this.landscapeLabeler.addApplicationTextLabel(applicationMesh, application.get('name'), this.font,
      this.configuration.landscapeColors.applicationText, 0.025, 0.01);
    LandscapeLabeler.addApplicationLogo(applicationMesh, this.imageLoader, 0.04, 0.04);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
  }

  // #endregion LANDSCAPE RENDERING

  // #region APLICATION RENDERING

  @task({ restartable: true })
  // eslint-disable-next-line
  addApplication = task(function* (this: VrRendering, landscapeApp: ApplicationMesh) {

    try {
      const applicationModel = landscapeApp.dataModel;
      const reducedApplication = reduceApplication(applicationModel);

      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', reducedApplication);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);

      Array.from(boxLayoutMap.values()).forEach((layoutMap) => {
        layoutMap.scale(this.appScaleFactor);
      });

      const applicationObject3D = new ApplicationObject3D(applicationModel, boxLayoutMap);

      const entityRendering = new EntityRendering(this.configuration, this.componentHeight);

      const communicationRendering = new AppCommunicationRendering(this.configuration,
        this.currentUser);

      const highlighter = new Highlighting(applicationObject3D);

      const entityManipulation = new EntityManipulation(communicationRendering,
        highlighter, this.componentHeight);

      // Add new meshes to application
      entityRendering.addFoundationAndChildrenToApplication(applicationObject3D);

      // Restore old state of components
      entityManipulation.setComponentState(applicationObject3D);
      communicationRendering.addCommunication(applicationObject3D);
      this.addLabels(applicationObject3D);
      this.addCloseIcon(applicationObject3D);

      this.positionApplication(applicationObject3D, landscapeApp);

      this.applicationGroup.addApplication(applicationObject3D);
    } catch (e) {
      // console.log(e);
    }
  });

  addCloseIcon(applicationObject3D: ApplicationObject3D) {
    const closeIcon = new CloseIcon(this.closeButtonTexture);

    const bboxApp3D = new THREE.Box3().setFromObject(applicationObject3D);
    closeIcon.position.x = bboxApp3D.max.x + 0.05;
    closeIcon.position.z = bboxApp3D.max.z + 0.05;

    closeIcon.geometry.rotateX(90 * THREE.MathUtils.DEG2RAD);
    closeIcon.geometry.rotateY(90 * THREE.MathUtils.DEG2RAD);
    applicationObject3D.add(closeIcon);
  }

  positionApplication(applicationObject3D: ApplicationObject3D, landscapeApp: ApplicationMesh) {
    // Calculate position in front of landscape application
    const newPosition = new THREE.Vector3().copy(landscapeApp.position);
    newPosition.z += 0.3;

    // Convert position to world location and apply
    applicationObject3D.position.copy(landscapeApp.localToWorld(newPosition));

    // Rotate app so that it is aligned with landscape
    applicationObject3D.setRotationFromQuaternion(this.landscapeObject3D.quaternion);
    applicationObject3D.rotateX(90 * THREE.MathUtils.DEG2RAD);
    applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);
  }

  /**
   * Iterates over all box meshes and calls respective functions to label them
   */
  addLabels(applicationObject3D: ApplicationObject3D) {
    if (!this.font) { return; }

    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors.componentText;
    const foundationTextColor = this.configuration.applicationColors.foundationText;

    const scalar = this.appScaleFactor;

    // Label all entities (excluding communication)
    applicationObject3D.getBoxMeshes().forEach((mesh) => {
      if (mesh instanceof ClazzMesh) {
        ApplicationLabeler
          .addClazzTextLabel(mesh, this.font, clazzTextColor, 0.5 * scalar);
      } else if (mesh instanceof ComponentMesh) {
        ApplicationLabeler
          .addBoxTextLabel(mesh, this.font, componentTextColor, 3 * scalar, 4, scalar);
      } else if (mesh instanceof FoundationMesh) {
        ApplicationLabeler
          .addBoxTextLabel(mesh, this.font, foundationTextColor, 1.5 * scalar, 4, scalar);
      }
    });
  }

  // #endregion APPLICATION RENDERING

  // #region LANDSCAPE MANIPULATION

  @task
  // eslint-disable-next-line
  openNodeGroupAndRedraw = task(function* (this: LandscapeRendering, nodeGroupMesh: NodeGroupMesh) {
    nodeGroupMesh.opened = true;
    yield this.cleanAndUpdateScene();
  });

  @task
  // eslint-disable-next-line
  closeNodeGroupAndRedraw = task(function* (this: LandscapeRendering, nodeGroupMesh: NodeGroupMesh) {
    nodeGroupMesh.opened = false;
    yield this.cleanAndUpdateScene();
  });

  @task
  // eslint-disable-next-line
  openSystemAndRedraw = task(function* (this: LandscapeRendering, systemMesh: SystemMesh) {
    systemMesh.opened = true;
    yield this.cleanAndUpdateScene();
  });

  @task
  // eslint-disable-next-line
  closeSystemAndRedraw = task(function* (this: LandscapeRendering, systemMesh: SystemMesh) {
    systemMesh.opened = false;
    this.closeNogeGroupsInSystem(systemMesh);
    yield this.cleanAndUpdateScene();
  });

  /**
   * Toggles the open status of a system mesh and redraws the landscape
   *
   * @param systemMesh System mesh of which the open state should be toggled
   */
  toggleSystemAndRedraw(systemMesh: SystemMesh) {
    if (systemMesh.opened) {
      this.closeSystemAndRedraw.perform(systemMesh);
    } else {
      this.openSystemAndRedraw.perform(systemMesh);
    }
  }

  /**
   * Toggles the open status of a nodegroup and redraws the landscape
   *
   * @param nodeGroupMesh nodegroup mesh of which the open state should be toggled
   */
  toggleNodeGroupAndRedraw(nodeGroupMesh: NodeGroupMesh) {
    if (nodeGroupMesh.opened) {
      this.closeNodeGroupAndRedraw.perform(nodeGroupMesh);
    } else {
      this.openNodeGroupAndRedraw.perform(nodeGroupMesh);
    }
  }

  /**
   * Sets all nodegroup meshes inside a closed system mesh to closed
   *
   * @param systemMesh System mesh which contains closable nodegroup meshes
   */
  closeNogeGroupsInSystem(systemMesh: SystemMesh) {
    const system = systemMesh.dataModel;
    // Close nodegroups in system
    if (!systemMesh.opened) {
      system.get('nodegroups').forEach((nodeGroup) => {
        const nodeGroupMesh = this.landscapeObject3D.getMeshbyModelId(nodeGroup.get('id'));
        if (nodeGroupMesh instanceof NodeGroupMesh) {
          nodeGroupMesh.opened = false;
        }
      });
    }
  }

  // #endregion LANDSCAPE MANIPULATION

  // #region CONTROLLER HANDLERS

  onSelectStart1() {
    if (!this.controller1.userData.intersectedObject) {
      return;
    }
    const { object } = this.controller1.userData.intersectedObject;
    if (object instanceof SystemMesh) {
      this.toggleSystemAndRedraw(object);
    } else if (object instanceof ApplicationMesh) {
      this.addApplication.perform(object);
    // Handle application hits
    } else if (object?.parent instanceof ApplicationObject3D) {
      // Hit Component
      if (object instanceof ComponentMesh) {
        this.entityManipulation.toggleComponentMeshState(object, object.parent);
        this.appCommRendering.addCommunication(object.parent);
      // Hit Foundation
      } else if (object instanceof CloseIcon) {
        this.applicationGroup.removeApplicationById(object.parent.dataModel.id);
      } else if (object instanceof FoundationMesh) {
        this.entityManipulation.closeAllComponents(object.parent);
      }
    }
  }

  onSelectStart2() {
    if (!this.controller2.userData.intersectedObject) {
      return;
    }
    const { object, point } = this.controller2.userData.intersectedObject;
    if (object instanceof FloorMesh && this.teleportArea) {
      this.teleportToPosition(point);
    }
  }

  // #endregion CONTROLLER HANDLERS

  teleportToPosition(position: THREE.Vector3) {
    const cameraWorldPos = new THREE.Vector3();

    const xrCamera = this.renderer.xr.getCamera(this.camera);
    xrCamera.getWorldPosition(cameraWorldPos);

    // this.user.worldToLocal(position);
    // this.user.worldToLocal(cameraWorldPos);

    // console.log('Teleport pos: ', position);
    console.log('Camera pos: ', cameraWorldPos);

    this.user.position.x += position.x - cameraWorldPos.x;
    this.user.position.z += position.z - cameraWorldPos.z;
  }

  // #region MOUSE & KEYBOARD EVENT HANDLER

  handleKeyboard(event: any) {
    const mvDst = 0.05;
    // Handle keys
    switch (event.key) {
      case 'q':
        this.landscapeObject3D.rotation.x -= mvDst;
        break;
      case 'e':
        this.landscapeObject3D.rotation.x += mvDst;
        break;
      case 'w':
        this.landscapeObject3D.position.y += mvDst;
        break;
      case 's':
        this.landscapeObject3D.position.y -= mvDst;
        break;
      case 'a':
        this.landscapeObject3D.position.x -= mvDst;
        break;
      case 'd':
        this.landscapeObject3D.position.x += mvDst;
        break;
      case '1':
        this.landscapeObject3D.position.z -= mvDst;
        break;
      case '2':
        this.landscapeObject3D.position.z += mvDst;
        break;
      case 'c':
        this.applicationGroup.clear();
        break;
      default:
        break;
    }
  }

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

  handleMouseWheel(delta: number) {
    this.camera.position.z += delta * 0.2;
  }

  // #endregion MOUSE & KEYBOARD EVENT HANDLER

  // #region UTILS

  getIntersections(controller: THREE.Group) {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersectionObjects = [this.landscapeObject3D, this.floor, this.applicationGroup];

    if (!this.landscapeObject3D) { return []; }

    const intersections = this.raycaster.intersectObjects(intersectionObjects, true);

    for (let i = 0; i < intersections.length; i++) {
      const { object } = intersections[i];
      if (!(object instanceof LabelMesh)) {
        return [intersections[i]];
      }
    }

    return [];
  }

  intersectObjects(controller: THREE.Group, controllerName: string) {
    const line = controller.getObjectByName('line');

    if (!line) return;

    const intersections = this.getIntersections(controller);

    const nearestIntersection = intersections[0];

    if (nearestIntersection) {
      const { object } = nearestIntersection;

      if (controllerName === 'controller1') {
        if (object instanceof BaseMesh) {
          VrRendering.resetHoverEffect(controller);
          object.applyHoverEffect(1.4);
          controller.userData.intersectedObject = nearestIntersection;
        }
      } else if (controllerName === 'controller2') {
        if (object instanceof FloorMesh) {
          if (!this.teleportArea) {
            // Create teleport area
            const geometry = new THREE.RingGeometry(0.14, 0.2, 32);
            geometry.rotateX(-90 * THREE.MathUtils.DEG2RAD);
            const material = new THREE.MeshLambertMaterial({
              color: new THREE.Color(0x0000dc),
            });
            material.transparent = true;
            material.opacity = 0.4;
            this.teleportArea = new THREE.Mesh(geometry, material);
            this.scene.add(this.teleportArea);
          }
          this.teleportArea.position.x = nearestIntersection.point.x;
          this.teleportArea.position.y = nearestIntersection.point.y + 0.005;
          this.teleportArea.position.z = nearestIntersection.point.z;
          controller.userData.intersectedObject = nearestIntersection;
        } else if (object instanceof BaseMesh) {
          this.removeTelportArea();
          controller.userData.intersectedObject = null;
        } else {
          this.removeTelportArea();
          controller.userData.intersectedObject = null;
        }
      }

      line.scale.z = nearestIntersection.distance;
    } else {
      VrRendering.resetHoverEffect(controller);
      line.scale.z = 5;

      this.removeTelportArea();
    }
  }

  /**
   * Resets the hover effect of the object which was previously hovered upon by the controller.
   *
   * @param controller Controller of which the hover effect shall be reseted.
   */
  static resetHoverEffect(controller: THREE.Group) {
    if (!controller.userData.intersectedObject) {
      return;
    }
    const { object } = controller.userData.intersectedObject;
    if (object instanceof BaseMesh) {
      object.resetHoverEffect();
      controller.userData.intersectedObject = null;
    }
  }

  removeTelportArea() {
    if (this.teleportArea) {
      this.scene.remove(this.teleportArea);
      this.teleportArea = undefined;
    }
  }

  // #endregion UTILS
}
