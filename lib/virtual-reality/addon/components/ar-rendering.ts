import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import Configuration from 'explorviz-frontend/services/configuration';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import Interaction from 'explorviz-frontend/utils/interaction';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeRendering, { Layout1Return, Layout3Return } from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import { enqueueTask, restartableTask, task } from 'ember-concurrency-decorators';
import * as LandscapeCommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering';
import {
  Class, Package, Application, Node,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LandscapeLabeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import * as ApplicationLabeler from 'explorviz-frontend/utils/application-rendering/labeler';
import ApplicationRendering from 'explorviz-frontend/components/visualization/rendering/application-rendering';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import LocalVrUser from 'explorviz-frontend/services/local-vr-user';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import BaseMenu from 'virtual-reality/utils/vr-menus/base-menu';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import DeltaTime from 'virtual-reality/services/delta-time';
import ElkConstructor, { ELK, ElkNode } from 'elkjs/lib/elk-api';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import { perform } from 'ember-concurrency-ts';
import computeApplicationCommunication from 'explorviz-frontend/utils/landscape-rendering/application-communication-computer';

import computeDrawableClassCommunication, { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { getAllClassesInApplication } from 'explorviz-frontend/utils/application-helpers';

interface Args {
  readonly id: string;
  readonly landscapeData: LandscapeData;
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
  time!: DeltaTime;

  @service()
  worker!: any;

  // Maps models to a computed layout
  modelIdToPlaneLayout: Map<string, PlaneLayout>|null = null;

  debug = debugLogger('ArRendering');

  // Used to register (mouse) events
  interaction!: Interaction;

  outerDiv!: HTMLElement;

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  camera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  // Group which contains all currently opened application objects
  applicationGroup: ApplicationGroup;

  // Depth of boxes for landscape entities
  landscapeDepth: number;

  closeButtonTexture: THREE.Texture;

  landscapeOffset = new THREE.Vector3();

  get font() {
    return this.args.font;
  }

  readonly elk: ELK;

  readonly imageLoader: ImageLoader = new ImageLoader();

  readonly appCommRendering: AppCommunicationRendering;

  // Provides functions to label landscape meshes
  readonly landscapeLabeler = new LandscapeLabeler();

  // Extended Object3D which manages landscape meshes
  readonly landscapeObject3D!: LandscapeObject3D;

  drawableClassCommunications: Map<string, DrawableClassCommunication[]> = new Map();

  onRenderFcts: (() => void)[] = [];

  lastTimeMsec: null|number = null;

  arToolkitSource: any;

  arToolkitContext: any;

  landscapeMarkers: THREE.Group[] = [];

  applicationMarkers: THREE.Group[] = [];

  landscapeOpacity: number;

  applicationOpacity: number;

  @tracked
  popupData: PopupData | null = null;

  // #endregion CLASS FIELDS AND GETTERS

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.elk = new ElkConstructor({
      workerUrl: './assets/web-workers/elk-worker.min.js',
    });

    this.landscapeDepth = 0.7;

    this.landscapeOpacity = 0.9;
    this.applicationOpacity = 0.7;

    this.raycaster = new THREE.Raycaster();
    this.applicationGroup = new ApplicationGroup();

    this.appCommRendering = new AppCommunicationRendering(this.configuration);

    // Load image for delete button
    this.closeButtonTexture = new THREE.TextureLoader().load('images/x_white_transp.png');

    // Load and scale landscape
    this.landscapeObject3D = new LandscapeObject3D(this.args.landscapeData.structureLandscapeData);

    // Rotate landscape such that it lays flat on the floor
    this.landscapeObject3D.rotateX(-90 * THREE.MathUtils.DEG2RAD);
  }

  // #region COMPONENT AND SCENE INITIALIZATION

  /**
     * Calls all three related init functions and adds the three
     * performance panel if it is activated in user settings
     */
  initRendering() {
    this.initScene();
    this.initCamera();
    this.initCameraCrosshair();
    this.initRenderer();
    this.initLights();
    this.initArJs();
    this.initInteraction();
  }

  /**
     * Creates a scene, its background and adds a landscapeObject3D to it
     */
  initScene() {
    this.scene = new THREE.Scene();

    this.scene.add(this.landscapeObject3D);
    this.scene.add(this.applicationGroup);
  }

  /**
     * Creates a PerspectiveCamera according to canvas size and sets its initial position
     */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(42, 640 / 480, 0.01, 2000);
    this.scene.add(this.camera);

    this.debug('Camera added');
  }

  initCameraCrosshair() {
    const geometry = new THREE.RingGeometry(0.0001, 0.0003, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const crosshairMesh = new THREE.Mesh(geometry, material);

    this.camera.add(crosshairMesh);
    // Position just in front of camera
    crosshairMesh.position.z = -0.1;
  }

  /**
     * Initiates a WebGLRenderer
     */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0px';
    this.renderer.domElement.style.left = '0px';
    this.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    this.renderer.setSize(640, 480);

    document.body.appendChild(this.renderer.domElement);

    this.canvas = this.renderer.domElement;

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
    this.handleSingleClick = this.handleSingleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handlePanning = this.handlePanning.bind(this);

    this.interaction = new Interaction(this.canvas, this.camera, this.renderer,
      this.getIntersectableObjects(), {
        singleClick: this.handleSingleClick,
        doubleClick: this.handleDoubleClick,
        mouseWheel: this.handleMouseWheel,
        panning: this.handlePanning,
      }, ArRendering.raycastFilter);

    // Add key listener for room positioning
    window.onkeydown = (event: any) => {
      this.handleKeyboard(event);
    };
  }

  getIntersectableObjects() {
    const intersectableObjects: THREE.Object3D[] = [this.landscapeObject3D];

    this.applicationMarkers.forEach((appMarker) => {
      intersectableObjects.push(appMarker);
    });

    return intersectableObjects;
  }

  static raycastFilter(intersection: THREE.Intersection) {
    return !(intersection.object instanceof LabelMesh || intersection.object instanceof LogoMesh);
  }

  initArJs() {
    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam',
    });

    this.arToolkitSource.init(() => {
      setTimeout(() => {
        this.resizeAR();
      }, 250);
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
    this.scene.add(landscapeMarker0);

    // Init controls for camera
    // eslint-disable-next-line
    new THREEx.ArMarkerControls(arToolkitContext, landscapeMarker0, {
      type: 'pattern',
      patternUrl: 'ar_data/patt.hiro',
    });

    const applicationMarkerNames = ['pattern-letterA', 'pattern-letterB'];

    applicationMarkerNames.forEach((markerName) => {
      const applicationMarker = new THREE.Group();
      // applicationMarker0.add(this.applicationGroup);
      this.scene.add(applicationMarker);
      this.applicationMarkers.push(applicationMarker);

      // Init controls for camera
      // eslint-disable-next-line
      new THREEx.ArMarkerControls(arToolkitContext, applicationMarker, {
        type: 'pattern',
        patternUrl: `ar_data/${markerName}.patt`,
      });
    });

    // Render the scene
    this.onRenderFcts.push(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }
  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region ACTIONS

  @action
  async outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.outerDiv = outerDiv;

    this.initRendering();

    this.renderer.setAnimationLoop(this.render.bind(this));

    this.resize(outerDiv);

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
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);

    // Update renderer and camera according to new canvas size
    this.renderer.setSize(width, height);
    this.camera.updateProjectionMatrix();

    this.resizeAR();
  }

  resizeAR() {
    this.arToolkitSource.onResizeElement();
    this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);

    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
    }
  }

  /**
   * Inherit this function to update the scene with a new renderingModel. It
   * automatically removes every mesh from the scene and finally calls
   * the (overridden) "populateLandscape" function. Add your custom code
   * as shown in landscape-rendering.
   *
   * @method cleanAndUpdateScene
   */
  @action
  async cleanAndUpdateScene() {
    await perform(this.populateLandscape);

    this.debug('clean and populate landscape-rendering');
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
  handleHeatmapInteraction() {
    const intersection = this.interaction.raycastCanvasCenter();

    this.debug(`Clicked heatmap button on object ${intersection}`);
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
    } else {
      const mesh = intersection.object;

      // Show information as popup is mouse stopped on top of a mesh
      if ((mesh instanceof NodeMesh || mesh instanceof ApplicationMesh
        || mesh instanceof ClazzMesh || mesh instanceof ComponentMesh
        || mesh instanceof ClazzCommunicationMesh)) {
        this.popupData = {
          mouseX: this.canvas.width / 2,
          mouseY: this.canvas.height / 2,
          entity: mesh.dataModel,
        };
      }
    }
  }

  // #endregion ACTIONS

  // #region RENDERING AND SCENE POPULATION

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    this.time.update();

    this.localUser.updateControllers();

    this.renderer.render(this.scene, this.camera);

    // Call each update function
    this.onRenderFcts.forEach((onRenderFct) => {
      onRenderFct();
    });
  }

  @task*
  loadNewLandscape() {
    yield perform(this.populateLandscape);
  }

  /**
 * Computes new meshes for the landscape and adds them to the scene
 *
 * @method populateLandscape
 */
  // @ts-ignore
  @restartableTask*
  // eslint-disable-next-line
  populateLandscape() {
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
      const newGraph: ElkNode = yield this.elk.layout(graph);

      // Post-process layout graph (3rd step)
      const layoutedLandscape: Layout3Return = yield this.worker.postMessage('layout3', {
        graph: newGraph,
        modelIdToPoints,
        structureLandscapeData,
        applicationCommunications,
      });

      // Clean old landscape
      this.cleanUpLandscape();

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

      // Render all landscape entities
      const { nodes } = structureLandscapeData;

      // Draw boxes for nodes
      nodes.forEach((node: Node) => {
        this.renderNode(node, modelIdToPlaneLayout.get(node.ipAddress), centerPoint);

        const { applications } = node;

        // Draw boxes for applications
        applications.forEach((application: Application) => {
          this.renderApplication(application, modelIdToPlaneLayout.get(application.instanceId),
            centerPoint);
        });
      });

      // Render application communication
      const color = this.configuration.landscapeColors.communication;
      const tiles = LandscapeCommunicationRendering
        .computeCommunicationTiles(applicationCommunications, modelIdToPointsComplete,
          color, this.landscapeDepth / 2 + 0.25);

      LandscapeCommunicationRendering.addCommunicationLineDrawing(tiles, this.landscapeObject3D,
        centerPoint, 0.004, 0.028);

      this.landscapeObject3D.setOpacity(this.landscapeOpacity);

      this.landscapeObject3D.setLargestSide(2);

      this.debug('Landscape loaded');
    } catch (e) {
      this.debug(e);
    }
  }

  // #endregion RENDERING AND SCENE POPULATION

  // #region LANDSCAPE RENDERING

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

    // Label with own ip-address by default
    const labelText = nodeMesh.getDisplayName();

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
    this.landscapeLabeler.addApplicationTextLabel(applicationMesh, application.name, this.font,
      this.configuration.landscapeColors.applicationText);
    this.landscapeLabeler.addApplicationLogo(applicationMesh, this.imageLoader);

    // Add to scene
    this.landscapeObject3D.add(applicationMesh);
  }

  // #endregion LANDSCAPE RENDERING

  // #region APLICATION RENDERING

  // @ts-ignore
  @enqueueTask*
  // eslint-disable-next-line
  addApplicationTask(applicationModel: Application, 
    callback?: (applicationObject3D: ApplicationObject3D) => void) {
    try {
      /*
      if (this.applicationGroup.hasApplication(applicationModel.instanceId)) {
        const message = `Application '${applicationModel.name}' already opened.`;

        AlertifyHandler.showAlertifyWarning(message);
        return;
      }
      */
      for (let i = 0; i < this.applicationMarkers.length; i++) {
        if (this.applicationMarkers[i].children.length === 0) {
          break;
        } else if (i === (this.applicationMarkers.length - 1)) {
          const message = 'All markers are occupied.';

          AlertifyHandler.showAlertifyWarning(message);
          return;
        }
      }

      const { dynamicLandscapeData } = this.args.landscapeData;

      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', applicationModel);

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);

      const applicationObject3D = new ApplicationObject3D(applicationModel, boxLayoutMap,
        dynamicLandscapeData);

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(applicationObject3D,
        this.configuration.applicationColors);

      this.updateDrawableClassCommunications(applicationObject3D);

      const drawableComm = this.drawableClassCommunications
        .get(applicationObject3D.dataModel.instanceId)!;

      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);

      // Add labels and close icon to application
      this.addLabels(applicationObject3D);
      const closeIcon = new CloseIcon(this.closeButtonTexture);
      closeIcon.addToApplication(applicationObject3D);

      // Scale application such that it approximately fits to the printed marker
      applicationObject3D.setLargestSide(1.5);

      applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);

      applicationObject3D.setBoxMeshOpacity(this.applicationOpacity);

      this.applicationGroup.addApplication(applicationObject3D);

      for (let i = 0; i < this.applicationMarkers.length; i++) {
        if (this.applicationMarkers[i].children.length === 0) {
          this.applicationMarkers[i].add(applicationObject3D);

          const message = `Application '${applicationModel.name}' successfully opened <br>
            on marker #${i}.`;

          AlertifyHandler.showAlertifySuccess(message);

          break;
        }
      }

      if (callback) callback(applicationObject3D);
    } catch (e: any) {
      this.debug(e);
    }
  }

  updateDrawableClassCommunications(applicationObject3D: ApplicationObject3D) {
    if (this.drawableClassCommunications.has(applicationObject3D.dataModel.instanceId)) {
      return;
    }

    const { structureLandscapeData } = this.args.landscapeData;
    const drawableClassCommunications = computeDrawableClassCommunication(
      structureLandscapeData,
      applicationObject3D.traces,
    );

    const allClasses = new Set(getAllClassesInApplication(applicationObject3D.dataModel));

    const communicationInApplication = drawableClassCommunications.filter(
      (comm) => allClasses.has(comm.sourceClass) || allClasses.has(comm.targetClass),
    );

    this.drawableClassCommunications.set(applicationObject3D.dataModel.instanceId,
      communicationInApplication);
  }

  addApplication(applicationModel: Application) {
    if (applicationModel.packages.length === 0) {
      const message = `Sorry, there is no information for application <b>
        ${applicationModel.name}</b> available.`;

      AlertifyHandler.showAlertifyMessage(message);
    } else {
      // data available => open application-rendering
      AlertifyHandler.closeAlertifyMessages();
      perform(this.addApplicationTask, applicationModel);
    }
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

  // #region MOUSE & KEYBOARD EVENT HANDLER

  handleDoubleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    this.handlePrimaryInputOn(intersection);
  }

  handleSingleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    this.handleSecondaryInputOn(intersection);
  }

  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
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

  handleMouseWheel(delta: number) {
    this.camera.position.z += delta * 0.2;
  }

  handleKeyboard(event: any) {
    // Handle keys
    switch (event.key) {
      case 'c':
        this.localUser.connect();
        break;
      case 'l':
        perform(this.loadNewLandscape);
        break;
      default:
        break;
    }
  }

  // #endregion MOUSE & KEYBOARD EVENT HANDLER

  // #region UTILS

  handlePrimaryInputOn(intersection: THREE.Intersection) {
    const self = this;
    const { object, uv } = intersection;

    function handleApplicationObject(appObject: THREE.Object3D) {
      if (!(appObject.parent instanceof ApplicationObject3D)) return;

      if (appObject instanceof ComponentMesh) {
        self.toggleComponentAndUpdate(appObject, appObject.parent);
      } else if (appObject instanceof CloseIcon) {
        self.removeApplication(appObject.parent);
      } else if (appObject instanceof FoundationMesh) {
        self.closeAllComponentsAndUpdate(appObject.parent);
      }
    }

    if (object instanceof ApplicationMesh) {
      this.addApplication(object.dataModel);
    // Handle application hits
    } else if (object.parent instanceof ApplicationObject3D) {
      handleApplicationObject(object);
    } else if (object instanceof BaseMenu && uv) {
      object.triggerDown(uv);
    }
  }

  toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    EntityManipulation.toggleComponentMeshState(componentMesh, applicationObject3D);
    this.addLabels(applicationObject3D);

    const drawableComm = this.drawableClassCommunications
      .get(applicationObject3D.dataModel.instanceId);

    if (drawableComm) {
      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);
      Highlighting.updateHighlighting(applicationObject3D, drawableComm);
    }
  }

  closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D) {
    EntityManipulation.closeAllComponents(applicationObject3D);

    const drawableComm = this.drawableClassCommunications
      .get(applicationObject3D.dataModel.instanceId);

    if (drawableComm) {
      this.appCommRendering.addCommunication(applicationObject3D, drawableComm);
      Highlighting.updateHighlighting(applicationObject3D, drawableComm);
    }
  }

  handleSecondaryInputOn(intersection: THREE.Intersection) {
    const { object } = intersection;
    if (object.parent instanceof ApplicationObject3D) {
      this.highlightAppEntity(object, object.parent);
    }
  }

  // eslint-disable-next-line
  highlightAppEntity(object: THREE.Object3D, application: ApplicationObject3D) {
    if (object instanceof ComponentMesh || object instanceof ClazzMesh
      || object instanceof ClazzCommunicationMesh) {
      const drawableComm = this.drawableClassCommunications.get(application.dataModel.instanceId);

      if (drawableComm) {
        Highlighting.highlight(object, application, drawableComm);
      }
    }
  }

  removeApplication(application: ApplicationObject3D) {
    this.applicationGroup.removeApplicationById(application.dataModel.instanceId);

    const { controller1, controller2 } = this.localUser;
    if (controller1) {
      controller1.intersectableObjects = controller1.intersectableObjects
        .filter((object) => object !== application);
    }
    if (controller2) {
      controller2.intersectableObjects = controller2.intersectableObjects
        .filter((object) => object !== application);
    }
  }

  cleanUpLandscape() {
    this.landscapeObject3D.removeAllChildren();
    this.landscapeObject3D.resetMeshReferences();
  }

  static cleanUpAr() {
    // Remove added canvas
    const canvas = document.body.querySelectorAll(':scope > canvas')[0];

    if (canvas) {
      document.body.removeChild(canvas);
    }

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

  resetAll() {
    this.applicationGroup.clear();
    this.localUser.resetPosition();

    // ToDo: Reset scale of landscape and applications
  }

  willDestroy() {
    this.cleanUpLandscape();
    ArRendering.cleanUpAr();
    this.applicationGroup.clear();
    this.localUser.reset();
  }

  // #endregion UTILS
}
