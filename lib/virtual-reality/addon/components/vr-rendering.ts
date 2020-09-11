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
import reduceLandscape, { ReducedLandscape } from 'explorviz-frontend/utils/landscape-rendering/model-reducer';
import FloorMesh from 'virtual-reality/utils/floor-mesh';
import WebXRPolyfill from 'webxr-polyfill';
import LandscapeLabeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import reduceApplication from 'explorviz-frontend/utils/application-rendering/model-reducer';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import CurrentUser from 'explorviz-frontend/services/current-user';
import ApplicationGroup from 'virtual-reality/utils/application-group';
import CloseIcon from 'virtual-reality/utils/close-icon';
import Landscape from 'explorviz-frontend/models/landscape';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import VRController from 'virtual-reality/utils/VRController';
import MainMenu from 'virtual-reality/utils/menus/main-menu';
import BaseMenu from 'virtual-reality/utils/menus/base-menu';
import CameraMenu from 'virtual-reality/utils/menus/camera-menu';
import LandscapeMenu from 'virtual-reality/utils/menus/landscape-menu';

interface Args {
  readonly id: string;
  readonly landscape: Landscape;
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

  controller1: VRController|null = null;

  controller2: VRController|null = null;

  user: THREE.Group;

  applicationGroup: ApplicationGroup;

  landscapeDepth: number;

  landscapeScalar: number;

  applicationScalar: number;

  floor!: FloorMesh;

  closeButtonTexture: THREE.Texture;

  menu: BaseMenu|undefined;

  landscapeOffset = new THREE.Vector3();

  get font() {
    return this.args.font;
  }

  readonly imageLoader: ImageLoader = new ImageLoader();

  readonly appCommRendering: AppCommunicationRendering;

  // Provides functions to label landscape meshes
  readonly landscapeLabeler = new LandscapeLabeler();

  // Extended Object3D which manages landscape meshes
  readonly landscapeObject3D!: LandscapeObject3D;

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');
    this.landscapeDepth = 0.7;

    this.landscapeScalar = 0.1;
    this.applicationScalar = 0.01;

    this.raycaster = new THREE.Raycaster();
    this.user = new THREE.Group();
    this.applicationGroup = new ApplicationGroup();

    this.appCommRendering = new AppCommunicationRendering(this.configuration, this.currentUser);

    // Load image for delete button
    this.closeButtonTexture = new THREE.TextureLoader().load('images/x_white_transp.png');

    // Load and scale landscape
    this.landscapeObject3D = new LandscapeObject3D(this.args.landscape);
    const scale = this.landscapeScalar;
    this.landscapeObject3D.scale.set(scale, scale, scale);

    // Rotate landscape such that it lays flat on the floor
    this.landscapeObject3D.rotateX(-90 * THREE.MathUtils.DEG2RAD);
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
    this.scene.background = this.configuration.landscapeColors.background;
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
    const intersectableObjects = [this.landscapeObject3D, this.applicationGroup, this.floor];

    // Init secondary/utility controller
    const raySpace1 = this.renderer.xr.getController(0);
    const gripSpace1 = this.renderer.xr.getControllerGrip(0);

    this.onSelectSecondary = this.onSelectSecondary.bind(this);

    const callbacks1 = {
      triggerDown: this.onSelectSecondary,
    };
    this.controller1 = new VRController(0, gripSpace1, raySpace1, callbacks1, this.scene);
    this.controller1.addRay(new THREE.Color('red'));
    this.controller1.intersectableObjects = intersectableObjects;

    this.user.add(this.controller1);

    // Init secondary controller
    const raySpace2 = this.renderer.xr.getController(1);
    const gripSpace2 = this.renderer.xr.getControllerGrip(1);

    this.onSelectStartSecondary = this.onSelectStartSecondary.bind(this);

    const callbacks2 = {
      triggerDown: this.onSelectStartSecondary,
    };

    this.controller2 = new VRController(1, gripSpace2, raySpace2, callbacks2, this.scene);
    this.controller2.addRay(new THREE.Color('blue'));
    this.controller2.intersectableObjects = intersectableObjects;
    this.controller2.initTeleportArea();

    this.user.add(this.controller2);
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

  @action
  onVrSessionStarted(/* session: XRSession */) {
    this.debug('WebXRSession started');
  }

  @action
  onVrSessionEnded() {
    this.debug('WebXRSession ended');
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

    if (this.controller1) { this.controller1.update(); }
    if (this.controller2) { this.controller2.update(); }

    this.renderer.render(this.scene, this.camera);
  }

  @task
  // eslint-disable-next-line
  loadNewLandscape = task(function* (this: VrRendering) {
    this.reducedLandscape = reduceLandscape(this.args.landscape);
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

    const { openEntityIds } = this.landscapeObject3D;
    const emberLandscape = this.args.landscape;

    this.landscapeObject3D.dataModel = emberLandscape;

    // Run Klay layouting in 3 steps within workers
    try {
    // Do layout pre-processing (1st step)
      const {
        graph,
        modelIdToPoints,
      }: any = yield this.worker.postMessage('layout1', { reducedLandscape: this.reducedLandscape, openEntitiesIds: openEntityIds });

      // Run actual klay function (2nd step)
      const newGraph: any = yield this.worker.postMessage('klay', { graph });

      // Post-process layout graph (3rd step)
      const layoutedLandscape: any = yield this.worker.postMessage('layout3', {
        graph: newGraph,
        modelIdToPoints,
        reducedLandscape: this.reducedLandscape,
        openEntitiesIds: openEntityIds,
      });

      // Clean old landscape
      this.landscapeObject3D.removeAllChildren();
      this.landscapeObject3D.resetMeshReferences();

      const { modelIdToLayout, modelIdToPoints: modelIdToPointsComplete } = layoutedLandscape;

      const modelIdToPlaneLayout = new Map<string, PlaneLayout>();

      this.modelIdToPlaneLayout = modelIdToPlaneLayout;

      // Convert the simple to a PlaneLayout map
      LandscapeRendering.convertToPlaneLayoutMap(modelIdToLayout, modelIdToPlaneLayout);

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
          modelIdToPointsComplete, color, this.landscapeDepth / 2 + 0.3);

        LandscapeCommunicationRendering.addCommunicationLineDrawing(tiles, this.landscapeObject3D,
          centerPoint, 0.004, 0.028);
      }

      this.centerLandscape();

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
      this.landscapeDepth,
    );

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);
    const labelText = system.get('name');
    this.landscapeLabeler.addSystemTextLabel(systemMesh, labelText, this.font,
      this.configuration.landscapeColors.systemText);
    this.landscapeLabeler.addCollapseSymbol(systemMesh, this.font,
      this.configuration.landscapeColors.collapseSymbol);

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
    const nodeGroupMesh = new NodeGroupMesh(
      layout,
      nodeGroup,
      this.configuration.landscapeColors.nodegroup,
      this.configuration.applicationColors.highlightedEntity,
      this.landscapeDepth,
      0.1,
    );

    nodeGroupMesh.setToDefaultPosition(centerPoint);

    // Add collapse symbol (+/-)
    this.landscapeLabeler.addCollapseSymbol(nodeGroupMesh, this.font,
      this.configuration.landscapeColors.collapseSymbol);

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
    const nodeMesh = new NodeMesh(
      layout,
      node,
      this.configuration.landscapeColors.node,
      this.configuration.applicationColors.highlightedEntity,
      this.landscapeDepth,
      0.2,
    );

    // Create and add label + icon
    nodeMesh.setToDefaultPosition(centerPoint);

    const nodeGroupId = node.get('parent').get('id');
    const nodeGroupMesh = this.landscapeObject3D.getMeshbyModelId(nodeGroupId);

    // Label with own ip-address by default
    const labelText = nodeMesh.getDisplayName(nodeGroupMesh);

    this.landscapeLabeler.addNodeTextLabel(nodeMesh, labelText, this.font,
      this.configuration.landscapeColors.nodeText);

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
    const applicationMesh = new ApplicationMesh(
      layout,
      application,
      this.configuration.landscapeColors.application,
      this.configuration.applicationColors.highlightedEntity,
      this.landscapeDepth,
      0.3,
    );
    applicationMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    this.landscapeLabeler.addApplicationTextLabel(applicationMesh, application.get('name'), this.font,
      this.configuration.landscapeColors.applicationText);
    LandscapeLabeler.addApplicationLogo(applicationMesh, this.imageLoader);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
  }

  // #endregion LANDSCAPE RENDERING

  // #region APLICATION RENDERING

  // @ts-ignore
  @task({ restartable: true })
  // eslint-disable-next-line
  addApplication = task(function* (this: VrRendering, landscapeApp: ApplicationMesh) {

    try {
      const applicationModel = landscapeApp.dataModel;
      const reducedApplication = reduceApplication(applicationModel);

      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', reducedApplication);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);

      const applicationObject3D = new ApplicationObject3D(applicationModel, boxLayoutMap);

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(applicationObject3D,
        this.configuration.applicationColors);

      this.appCommRendering.addCommunication(applicationObject3D);

      // Add labels and close icon to application
      this.addLabels(applicationObject3D);
      const closeIcon = new CloseIcon(this.closeButtonTexture);
      closeIcon.addToApplication(applicationObject3D);

      // Scale application to a reasonable size to work with it
      const scalar = this.applicationScalar;
      applicationObject3D.scale.set(scalar, scalar, scalar);

      this.positionApplication(applicationObject3D, landscapeApp);

      this.applicationGroup.addApplication(applicationObject3D);
    } catch (e) {
      // console.log(e);
    }
  });

  positionApplication(applicationObject3D: ApplicationObject3D, landscapeApp: ApplicationMesh) {
    // Calculate position in front of landscape application
    const newPosition = new THREE.Vector3().copy(landscapeApp.position);

    // Convert position to world location and apply
    landscapeApp.localToWorld(newPosition);
    applicationObject3D.worldToLocal(newPosition);

    applicationObject3D.position.copy(newPosition);

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

    // Label all entities (excluding communication)
    applicationObject3D.getBoxMeshes().forEach((mesh) => {
      if (mesh instanceof ClazzMesh) {
        ApplicationLabeler
          .addClazzTextLabel(mesh, this.font, clazzTextColor);
      } else if (mesh instanceof ComponentMesh) {
        ApplicationLabeler
          .addBoxTextLabel(mesh, this.font, componentTextColor);
      } else if (mesh instanceof FoundationMesh) {
        ApplicationLabeler
          .addBoxTextLabel(mesh, this.font, foundationTextColor);
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

  onSelectSecondary() {
    if (!this.controller1 || !this.controller1.intersectedObject) {
      return;
    }
    const { object } = this.controller1.intersectedObject;
    if (object instanceof SystemMesh) {
      this.toggleSystemAndRedraw(object);
    } else if (object instanceof NodeGroupMesh) {
      this.toggleNodeGroupAndRedraw(object);
    } else if (object instanceof ApplicationMesh) {
      this.addApplication.perform(object);
    // Handle application hits
    } else if (object?.parent instanceof ApplicationObject3D) {
      // Hit Component
      if (object instanceof ComponentMesh) {
        EntityManipulation.toggleComponentMeshState(object, object.parent);
        this.appCommRendering.addCommunication(object.parent);
        Highlighting.updateHighlighting(object.parent);
      // Hit Foundation
      } else if (object instanceof CloseIcon) {
        this.applicationGroup.removeApplicationById(object.parent.dataModel.id);
      } else if (object instanceof FoundationMesh) {
        EntityManipulation.closeAllComponents(object.parent);
        this.appCommRendering.addCommunication(object.parent);
        Highlighting.updateHighlighting(object.parent);
      }
    }
  }

  onSelectStartSecondary() {
    if (!this.controller2 || !this.controller2.intersectedObject) {
      return;
    }

    const { object, point, uv } = this.controller2.intersectedObject;
    if (object instanceof FloorMesh) {
      this.teleportToPosition(point);
    } else if (object instanceof BaseMenu && uv) {
      object.triggerPress(uv);
    } else if (object?.parent instanceof ApplicationObject3D) {
      if (object instanceof ComponentMesh || object instanceof ClazzMesh
      || object instanceof ClazzCommunicationMesh) {
        Highlighting.highlight(object, object.parent);
      }
    }
  }

  // #endregion CONTROLLER HANDLERS

  teleportToPosition(position: THREE.Vector3) {
    const cameraWorldPos = new THREE.Vector3();

    const xrCamera = this.renderer.xr.getCamera(this.camera);
    xrCamera.getWorldPosition(cameraWorldPos);

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
        this.centerLandscape();
        break;
      case 'e':
        this.landscapeObject3D.rotation.x += mvDst;
        this.centerLandscape();
        break;
      case 'w':
        this.moveLandscape(0, mvDst, 0);
        break;
      case 's':
        this.moveLandscape(0, -mvDst, 0);
        break;
      case 'a':
        this.moveLandscape(-mvDst, 0, 0);
        break;
      case 'd':
        this.moveLandscape(mvDst, 0, 0);
        break;
      case '1':
        this.moveLandscape(0, 0, -mvDst);
        break;
      case '2':
        this.moveLandscape(0, 0, mvDst);
        break;
      case 'c':
        this.centerLandscape();
        break;
      case 'r':
        this.resetLandscapePosition();
        break;
      case 'l':
        this.loadNewLandscape.perform();
        break;
      case 'm':
        this.openMainMenu();
        break;
      default:
        break;
    }
  }

  openMainMenu() {
    this.closeCurrentMenu();

    this.menu = new MainMenu(this.closeCurrentMenu.bind(this), this.openCameraMenu.bind(this),
      this.openLandscapeMenu.bind(this));
    this.menu.position.y += 1;
    this.menu.position.z += 1.5;
    this.scene.add(this.menu);
  }

  openCameraMenu() {
    this.closeCurrentMenu();

    this.menu = new CameraMenu(this.openMainMenu.bind(this), this.user.position);
    this.menu.position.y += 1;
    this.menu.position.z += 1.5;
    this.scene.add(this.menu);
  }

  openLandscapeMenu() {
    this.closeCurrentMenu();

    this.menu = new LandscapeMenu(this.openMainMenu.bind(this), this.landscapeObject3D);
    this.menu.position.y += 1;
    this.menu.position.z += 1.5;
    this.scene.add(this.menu);
  }

  closeCurrentMenu() {
    if (this.menu) {
      this.scene.remove(this.menu);
      this.menu = undefined;
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

  moveLandscape(deltaX: number, deltaY: number, deltaZ: number) {
    const delta = new THREE.Vector3(deltaX, deltaY, deltaZ);
    this.landscapeOffset.add(delta);
    this.landscapeObject3D.position.add(delta);
  }

  centerLandscape() {
    const { floor } = this;
    const landscape = this.landscapeObject3D;
    const offset = this.landscapeOffset;

    // Compute bounding box of the floor
    const bboxFloor = new THREE.Box3().setFromObject(floor);

    // Calculate center of the floor
    const centerFloor = new THREE.Vector3();
    bboxFloor.getCenter(centerFloor);

    const bboxLandscape = new THREE.Box3().setFromObject(landscape);

    // Calculate center of the landscape
    const centerLandscape = new THREE.Vector3();
    bboxLandscape.getCenter(centerLandscape);

    // Set new position of landscape
    landscape.position.x += centerFloor.x - centerLandscape.x + offset.x;
    landscape.position.z += centerFloor.z - centerLandscape.z + offset.z;

    // Check distance between floor and landscape
    if (bboxLandscape.min.y > bboxFloor.max.y) {
      landscape.position.y += bboxFloor.max.y - bboxLandscape.min.y + 0.001;
    }

    // Check if landscape is underneath the floor
    if (bboxLandscape.min.y < bboxFloor.min.y) {
      landscape.position.y += bboxFloor.max.y - bboxLandscape.min.y + 0.001;
    }

    landscape.position.y += offset.y;
  }

  resetLandscapePosition() {
    this.landscapeObject3D.rotation.x = (-90 * THREE.MathUtils.DEG2RAD);
    this.landscapeOffset.set(0, 0, 0);
    this.centerLandscape();
  }

  // #endregion UTILS
}
