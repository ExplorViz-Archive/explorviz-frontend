import { inject as service } from '@ember/service';
import GlimmerComponent from '@glimmer/component';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Configuration from 'explorviz-frontend/services/configuration';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import CurrentUser from 'explorviz-frontend/services/current-user';

import Interaction, { Position2D } from 'explorviz-frontend/utils/interaction';
import * as Labeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import * as CalcCenterAndZoom from
  'explorviz-frontend/utils/landscape-rendering/center-and-zoom-calculator';
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
import { reduceLandscape } from 'explorviz-frontend/utils/landscape-rendering/model-reducer';
import { task } from 'ember-concurrency-decorators';
import PopupHandler from 'explorviz-frontend/utils/landscape-rendering/popup-handler';
import { tracked } from '@glimmer/tracking';


interface Args {
  id: string;
  landscape: Landscape;
  font: THREE.Font;
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
  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('configuration')
  configuration!: Configuration;

  @service('reload-handler')
  reloadHandler!: ReloadHandler;

  @service('rendering-service')
  renderingService!: RenderingService;

  @service('current-user')
  currentUser!: CurrentUser;

  @service()
  worker!: any;

  scene!: THREE.Scene;

  landscapeObject3D = new THREE.Object3D();

  webglrenderer!: THREE.WebGLRenderer;

  camera!: THREE.PerspectiveCamera;

  canvas!: HTMLCanvasElement;

  debug = debugLogger('LandscapeRendering');

  animationFrameId = 0;

  initDone: boolean;

  threePerformance: THREEPerformance|undefined;

  interaction!: Interaction;

  imageLoader: ImageLoader = new ImageLoader();

  modelIdToMesh: Map<string, THREE.Mesh> = new Map();

  systemMeshes: Set<SystemMesh> = new Set();

  nodeGroupMeshes: Set<NodeGroupMesh> = new Set();

  hoverHandler: HoverEffectHandler = new HoverEffectHandler();

  popUpHandler: PopupHandler = new PopupHandler();

  @tracked
  popupData: PopupData | null = null;

  get font() {
    return this.args.font;
  }

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.initDone = false;
    this.debug('Constructor called');

    this.render = this.render.bind(this);
  }


  @action
  outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.initThreeJs();
    this.initInteraction();
    this.render();

    this.resize(outerDiv);

    this.initDone = true;

    this.populateScene.perform();
  }

  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug('Canvas inserted');

    this.canvas = canvas;

    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }

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

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.configuration.landscapeColors.background);

    this.scene.add(this.landscapeObject3D);

    this.debug('Scene created');
  }

  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 0);
    this.debug('Camera added');
  }

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

  initLights() {
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.scene.add(dirLight);
    this.debug('Lights added');
  }

  @action
  resize(outerDiv: HTMLElement) {
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);
    this.webglrenderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }


  // #region RENDERING LOOP
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


  // @Override
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

    this.imageLoader.logos = {};

    this.interaction.removeHandlers();
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
  cleanAndUpdateScene() {
    function removeAllChildren(entity: THREE.Object3D | THREE.Mesh) {
      for (let i = entity.children.length - 1; i >= 0; i--) {
        const child = entity.children[i];

        removeAllChildren(child);

        if (!(child instanceof THREE.Light)) {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else {
              for (let j = 0; j < child.material.length; j++) {
                const material = child.material[j];
                material.dispose();
              }
            }
          }
          entity.remove(child);
        }
      }
    }

    const { landscapeObject3D } = this;

    removeAllChildren(landscapeObject3D);
    this.populateScene.perform();

    this.debug('clean and populate landscape-rendering');
  }


  // Listener-Callbacks. Override in extending components
  @action
  onReSetupScene() {
    this.camera.position.set(0, 0, 0);
    this.cleanAndUpdateScene();
  }

  @action
  onUpdated() {
    if (this.initDone) {
      this.cleanAndUpdateScene();
    }
  }


  // @Override
  /**
 * TODO
 *
 * @method populateScene
 */
  @task({ enqueue: true })
  // eslint-disable-next-line
  populateScene = task(function* (this: LandscapeRendering) {
    this.debug('populate landscape-rendering');

    const emberLandscape = this.args.landscape;

    if (!emberLandscape || !this.font) {
      return;
    }

    const reducedLandscape = reduceLandscape(emberLandscape);

    const openEntitiesIds = this.computeOpenEntities();

    try {
      // Reset mesh related data structures
      this.modelIdToMesh.clear();
      this.systemMeshes.clear();
      this.nodeGroupMeshes.clear();

      const {
        graph,
        modelIdToPoints,
      }: any = yield this.worker.postMessage('layout1', { reducedLandscape, openEntitiesIds });

      const newGraph: any = yield this.worker.postMessage('klay', { graph });

      const layoutedLandscape: any = yield this.worker.postMessage('layout3', {
        graph: newGraph,
        modelIdToPoints,
        reducedLandscape,
        openEntitiesIds,
      });

      const { modelIdToLayout, modelIdToPoints: modelIdToPointsComplete } = layoutedLandscape;

      const modelIdToPlaneLayout = new Map<string, PlaneLayout>();

      modelIdToLayout.forEach((simplePlaneLayout: SimplePlaneLayout, modelId: string) => {
        const planeLayoutObject = new PlaneLayout();
        planeLayoutObject.height = simplePlaneLayout.height;
        planeLayoutObject.width = simplePlaneLayout.width;
        planeLayoutObject.positionX = simplePlaneLayout.positionX;
        planeLayoutObject.positionY = simplePlaneLayout.positionY;
        planeLayoutObject.opened = simplePlaneLayout.opened;
        modelIdToPlaneLayout.set(modelId, planeLayoutObject);
      });

      const centerPoint = CalcCenterAndZoom
        .getCenterAndZoom(emberLandscape, modelIdToPlaneLayout, this.camera, this.webglrenderer);

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
      // console.log(e);
    }
  });

  computeOpenEntities() {
    const openEntitiesIds: Set<string> = new Set();

    const { systemMeshes, nodeGroupMeshes } = this;
    systemMeshes.forEach((systemMesh) => {
      if (systemMesh.opened) {
        openEntitiesIds.add(systemMesh.dataModel.id);
      }
    });

    nodeGroupMeshes.forEach((nodeGroupMesh) => {
      if (nodeGroupMesh.opened) {
        openEntitiesIds.add(nodeGroupMesh.dataModel.id);
      }
    });

    return openEntitiesIds;
  }

  renderSystem(system: System, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector3) {
    if (!layout) { return; }

    // Create system mesh
    const systemMesh = new SystemMesh(layout, system,
      new THREE.Color(this.configuration.landscapeColors.system));

    // Create and add label + icon
    systemMesh.setToDefaultPosition(centerPoint);
    const labelText = system.get('name');
    const labelColor = new THREE.Color('black');
    Labeler.addSystemTextLabel(systemMesh, labelText, this.font, labelColor);
    Labeler.addCollapseSymbol(systemMesh, this.font, labelColor);

    // Add to scene
    this.landscapeObject3D.add(systemMesh);
    this.systemMeshes.add(systemMesh);
    this.modelIdToMesh.set(system.get('id'), systemMesh);
  }

  renderNodeGroup(nodeGroup: NodeGroup, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector3) {
    if (!layout) { return; }

    // Create nodeGroup mesh
    const nodeGroupMesh = new NodeGroupMesh(layout, nodeGroup,
      new THREE.Color(this.configuration.landscapeColors.nodegroup));

    // Create and add label + icon
    nodeGroupMesh.setToDefaultPosition(centerPoint);
    const labelColor = new THREE.Color('white');
    Labeler.addCollapseSymbol(nodeGroupMesh, this.font, labelColor);

    // Add to scene
    this.landscapeObject3D.add(nodeGroupMesh);
    this.nodeGroupMeshes.add(nodeGroupMesh);
    this.modelIdToMesh.set(nodeGroup.get('id'), nodeGroupMesh);
  }

  renderNode(node: Node, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector3) {
    if (!layout) { return; }

    // Create node mesh
    const nodeMesh = new NodeMesh(layout, node,
      new THREE.Color(this.configuration.landscapeColors.node));

    // Create and add label + icon
    nodeMesh.setToDefaultPosition(centerPoint);

    const labelText = node.getDisplayName();
    const labelColor = new THREE.Color('white');
    Labeler.addNodeTextLabel(nodeMesh, labelText, this.font, labelColor);

    // Add to scene
    this.landscapeObject3D.add(nodeMesh);
    this.modelIdToMesh.set(node.get('id'), nodeMesh);
  }

  renderApplication(application: Application, layout: PlaneLayout | undefined,
    centerPoint: THREE.Vector3) {
    if (!layout) { return; }

    // Create application mesh
    const applicationMesh = new ApplicationMesh(layout, application,
      new THREE.Color(this.configuration.landscapeColors.application));
    applicationMesh.setToDefaultPosition(centerPoint);

    // Create and add label + icon
    Labeler.addApplicationTextLabel(applicationMesh, application.get('name'), this.font,
      new THREE.Color('white'));
    Labeler.addApplicationLogo(applicationMesh, this.imageLoader);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
    this.modelIdToMesh.set(application.get('id'), applicationMesh);
  }

  @action
  showApplication(emberModel: Application) {
    this.landscapeRepo.set('latestApplication', emberModel);
    this.landscapeRepo.set('replayApplication', emberModel);
  }

  handleDoubleClick(mesh?: THREE.Mesh) {
    // Handle application
    if (mesh instanceof ApplicationMesh) {
      const application = mesh.dataModel;
      // No data => show message
      if (application.get('components').get('length') === 0) {
        const message = `Sorry, there is no information for application <b>
          ${application.get('name')}</b> available.`;

        AlertifyHandler.showAlertifyMessage(message);
      } else {
        // data available => open application-rendering
        AlertifyHandler.closeAlertifyMessages();
        this.showApplication(application);
      }
      // Handle nodeGroup
    } else if (mesh instanceof NodeGroupMesh) {
      const nodeGroup = mesh.dataModel;
      nodeGroup.setOpened(!nodeGroup.get('opened'));
      mesh.opened = !mesh.opened;
      this.cleanAndUpdateScene();
      // Handle system
    } else if (mesh instanceof SystemMesh) {
      const system = mesh.dataModel;
      mesh.opened = !mesh.opened;
      // Close nodegroups in system
      if (!mesh.opened) {
        system.get('nodegroups').forEach((nodeGroup) => {
          const nodeGroupMesh = this.modelIdToMesh.get(nodeGroup.get('id'));
          if (nodeGroupMesh instanceof NodeGroupMesh) {
            nodeGroupMesh.opened = false;
          }
        });
      }
      this.cleanAndUpdateScene();
    }
  }

  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    if (button === 1) {
      const distanceXInPercent = (delta.x / this.canvas.clientWidth) * 100.0;
      const distanceYInPercent = (delta.y / this.canvas.clientHeight) * 100.0;

      const xVal = this.camera.position.x + distanceXInPercent * 6.0 * 0.015
        * -(Math.abs(this.camera.position.z) / 4.0);
      const yVal = this.camera.position.y + distanceYInPercent * 4.0 * 0.01
        * (Math.abs(this.camera.position.z) / 4.0);
      this.camera.position.x = xVal;
      this.camera.position.y = yVal;
    }
  }

  handleMouseWheel(delta: number) {
    // Hide (old) tooltip
    this.popupData = null;

    const scrollVector = new THREE.Vector3(0, 0, delta * 1.5);

    const landscapeVisible = this.camera.position.z + scrollVector.z > 0.2;
    // apply zoom, prevent to zoom behind 2D-Landscape (z-direction)
    if (landscapeVisible) {
      this.camera.position.addVectors(this.camera.position, scrollVector);
    }
  }

  handleMouseMove(mesh: THREE.Mesh | undefined) {
    const enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    if (mesh === undefined) {
      this.hoverHandler.resetHoverEffect();
    } else if (mesh instanceof PlaneMesh && enableHoverEffects) {
      this.hoverHandler.applyHoverEffect(mesh);
    }

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
}
