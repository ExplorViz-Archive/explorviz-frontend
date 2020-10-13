import { inject as service } from '@ember/service';
import GlimmerComponent from '@glimmer/component';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Configuration from 'explorviz-frontend/services/configuration';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import CurrentUser from 'explorviz-frontend/services/current-user';

import Interaction, { Position2D } from 'explorviz-frontend/utils/interaction';
import updateCameraZoom from 'explorviz-frontend/utils/landscape-rendering/zoom-calculator';
import * as CommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import Application from 'explorviz-frontend/models/application';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import System from 'explorviz-frontend/models/system';
import HoverEffectHandler from 'explorviz-frontend/utils/hover-effect-handler';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import NodeGroupMesh from 'explorviz-frontend/view-objects/3d/landscape/nodegroup-mesh';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import Node from 'explorviz-frontend/models/node';
import PlaneMesh from 'explorviz-frontend/view-objects/3d/landscape/plane-mesh';
import reduceLandscape, { ReducedLandscape } from 'explorviz-frontend/utils/landscape-rendering/model-reducer';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import Labeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import ELK from 'elkjs/lib/elk.bundled';

interface Args {
  readonly id: string;
  readonly landscape: Landscape;
  readonly font: THREE.Font;
  readonly isReplay: boolean;
  showApplication(application: Application): void;
}

interface SimplePlaneLayout {
  height: number;
  width: number;
  positionX: number;
  positionY: number;
  opened: boolean;
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity: System | NodeGroup | Node | Application
};

/**
* Renderer for landscape visualization.
*
* @class Landscape-Rendering-Component
* @extends GlimmerComponent
*
* @module explorviz
* @submodule visualization.rendering
*/
export default class LandscapeRendering extends GlimmerComponent<Args> {
  // #region CLASS FIELDS AND GETTERS

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('configuration')
  configuration!: Configuration;

  @service('reload-handler')
  reloadHandler!: ReloadHandler;

  @service('current-user')
  currentUser!: CurrentUser;

  @service()
  worker!: any;

  scene!: THREE.Scene;

  webglrenderer!: THREE.WebGLRenderer;

  camera!: THREE.PerspectiveCamera;

  canvas!: HTMLCanvasElement;

  debug = debugLogger('LandscapeRendering');

  // Incremented every time a frame is rendered
  animationFrameId = 0;

  // Is set to false until first landscape is rendered
  initDone: boolean;

  // Used to display performance and memory usage information
  threePerformance: THREEPerformance|undefined;

  // Used to register (mouse) events
  interaction!: Interaction;

  // Plain JSON variant of the landscape with fewer properties, used for layouting
  reducedLandscape: ReducedLandscape|null = null;

  // Maps models to a computed layout
  modelIdToPlaneLayout: Map<string, PlaneLayout>|null = null;

  // Extended Object3D which manages landscape meshes
  readonly landscapeObject3D: LandscapeObject3D;

  // Provides functions to label landscape meshes
  readonly labeler = new Labeler();

  readonly imageLoader: ImageLoader = new ImageLoader();

  readonly hoverHandler: HoverEffectHandler = new HoverEffectHandler();

  @tracked
  popupData: PopupData | null = null;

  get font() {
    return this.args.font;
  }

  // #endregion CLASS FIELDS AND GETTERS


  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.initDone = false;
    this.debug('Constructor called');

    this.render = this.render.bind(this);

    this.landscapeObject3D = new LandscapeObject3D(this.args.landscape);
  }

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
    this.initInteraction();
    this.render();

    this.resize(outerDiv);

    await this.loadNewLandscape.perform();

    this.initDone = true;
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

    const showFpsCounter = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'showFpsCounter');

    if (showFpsCounter) {
      this.threePerformance = new THREEPerformance();
    }
  }

  /**
   * Creates a scene, its background and adds a landscapeObject3D to it
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.background;

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
    this.debug('Renderer set up');
  }

  /**
   * Creates a DirectionalLight and adds it to the scene
   */
  initLights() {
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.scene.add(dirLight);
    this.debug('Lights added');
  }

  /**
   * Binds this context to all event handling functions and
   * passes them to a newly created Interaction object
   */
  initInteraction() {
    // this.handleSingleClick = this.handleSingleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    // this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseStop = this.handleMouseStop.bind(this);
    this.handlePanning = this.handlePanning.bind(this);

    this.interaction = new Interaction(this.canvas, this.camera, this.webglrenderer,
      this.landscapeObject3D, {
        doubleClick: this.handleDoubleClick,
        mouseMove: this.handleMouseMove,
        mouseWheel: this.handleMouseWheel,
        mouseOut: this.handleMouseOut,
        /* mouseEnter: this.handleMouseEnter, */
        mouseStop: this.handleMouseStop,
        panning: this.handlePanning,
      });
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION


  // #region RENDERING LOOP

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    if (this.threePerformance) {
      this.threePerformance.threexStats.update(this.webglrenderer);
      this.threePerformance.stats.begin();
    }

    this.webglrenderer.render(this.scene, this.camera);

    if (this.threePerformance) {
      this.threePerformance.stats.end();
    }
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

    this.interaction.removeHandlers();
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
    await this.populateScene.perform();

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
      this.loadNewLandscape.perform();
    }
  }

  // #endregion ACTIONS


  // #region SCENE POPULATION

  @task
  // eslint-disable-next-line
  loadNewLandscape = task(function* (this: LandscapeRendering) {
    const emberLandscape = this.args.landscape;
    this.landscapeObject3D.dataModel = emberLandscape;
    this.reducedLandscape = reduceLandscape(emberLandscape);
    yield this.populateScene.perform();
  });


  /**
 * Computes new meshes for the landscape and adds them to the scene
 *
 * @method populateScene
 */
  @task({ restartable: true })
  // eslint-disable-next-line
  populateScene = task(function* (this: LandscapeRendering) {
    this.debug('populate landscape-rendering');

    const emberLandscape = this.args.landscape;
    this.landscapeObject3D.dataModel = emberLandscape;

    if (!emberLandscape || !this.font) {
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
      // const newGraph: any = yield this.worker.postMessage('klay', { graph });

      const elk = new ELK({
        workerUrl: 'explorviz-frontend/node_modules/elkjs/lib/elk-worker.min.js',
      });

      let newGraph: any;
      yield elk.layout(graph).then((g) => { newGraph = g; });

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

      // Compute center of landscape
      const landscapeRect = this.landscapeObject3D.getMinMaxRect(modelIdToPlaneLayout);
      const centerPoint = landscapeRect.center;

      // Update camera zoom accordingly
      updateCameraZoom(landscapeRect, this.camera, this.webglrenderer);

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
        const tiles = CommunicationRendering.computeCommunicationTiles(appCommunications,
          modelIdToPointsComplete, color);

        CommunicationRendering.addCommunicationLineDrawing(tiles, this.landscapeObject3D,
          centerPoint);
      }

      this.debug('Landscape loaded');
    } catch (e) {
      console.log(e);
    }
  });

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
    const systemMesh = new SystemMesh(layout, system,
      this.configuration.landscapeColors.system);

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);
    const labelText = system.get('name');
    this.labeler.addSystemTextLabel(systemMesh, labelText, this.font,
      this.configuration.landscapeColors.systemText);
    this.labeler.addCollapseSymbol(systemMesh, this.font,
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
    const nodeGroupMesh = new NodeGroupMesh(layout, nodeGroup,
      this.configuration.landscapeColors.nodegroup);

    // Create and add label + icon
    nodeGroupMesh.setToDefaultPosition(centerPoint);
    this.labeler.addCollapseSymbol(nodeGroupMesh, this.font,
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
    const nodeMesh = new NodeMesh(layout, node, this.configuration.landscapeColors.node);

    // Create and add label + icon
    nodeMesh.setToDefaultPosition(centerPoint);

    const nodeGroupId = node.get('parent').get('id');
    const nodeGroupMesh = this.landscapeObject3D.getMeshbyModelId(nodeGroupId);

    // Label with own ip-address by default
    const labelText = nodeMesh.getDisplayName(nodeGroupMesh);

    this.labeler.addNodeTextLabel(nodeMesh, labelText, this.font,
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
    const applicationMesh = new ApplicationMesh(layout, application,
      this.configuration.landscapeColors.application);
    applicationMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    this.labeler.addApplicationTextLabel(applicationMesh, application.get('name'), this.font,
      this.configuration.landscapeColors.applicationText);
    Labeler.addApplicationLogo(applicationMesh, this.imageLoader);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
  }

  // #endregion SCENE POPULATION


  // #region SCENE MANIPULATION

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

  handleDoubleClick(mesh?: THREE.Mesh) {
    // Handle application
    if (mesh instanceof ApplicationMesh) {
      this.openApplicationIfExistend(mesh);
      // Handle nodeGroup
    } else if (mesh instanceof NodeGroupMesh) {
      this.toggleNodeGroupAndRedraw(mesh);
      // Handle system
    } else if (mesh instanceof SystemMesh) {
      this.toggleSystemAndRedraw(mesh);
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
    // Hide (old) tooltip
    this.popupData = null;

    const scrollDelta = delta * 1.5;

    const landscapeVisible = this.camera.position.z + scrollDelta > 0.2;

    // Apply zoom, prevent to zoom behind 2D-Landscape (z-direction)
    if (landscapeVisible) {
      this.camera.position.z += scrollDelta;
    }
  }

  handleMouseMove(mesh: THREE.Mesh | undefined) {
    const enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    // Update hover effect
    if (mesh === undefined) {
      this.hoverHandler.resetHoverEffect();
    } else if (mesh instanceof PlaneMesh && enableHoverEffects) {
      this.hoverHandler.applyHoverEffect(mesh);
    }

    // Do not show popups while mouse is moving
    this.popupData = null;
  }

  handleMouseOut() {
    this.popupData = null;
  }

  /*   @action
  handleMouseEnter() {
  } */

  handleMouseStop(mesh: THREE.Mesh | undefined, mouseOnCanvas: Position2D) {
    if (mesh === undefined) { return; }

    if (mesh instanceof SystemMesh || mesh instanceof NodeGroupMesh
      || mesh instanceof NodeMesh || mesh instanceof ApplicationMesh) {
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
  openApplicationIfExistend(applicationMesh: ApplicationMesh) {
    const application = applicationMesh.dataModel;
    // No data => show message
    if (application.get('components').get('length') === 0) {
      const message = `Sorry, there is no information for application <b>
        ${application.get('name')}</b> available.`;

      AlertifyHandler.showAlertifyMessage(message);
    } else {
      // data available => open application-rendering
      AlertifyHandler.closeAlertifyMessages();
      this.args.showApplication(application);
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
      planeLayoutObject.opened = simplePlaneLayout.opened;

      modelIdToPlaneLayout.set(modelId, planeLayoutObject);
    });
  }
}
