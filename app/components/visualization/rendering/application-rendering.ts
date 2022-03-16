import GlimmerComponent from '@glimmer/component';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import { inject as service } from '@ember/service';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import Configuration from 'explorviz-frontend/services/configuration';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import { tracked } from '@glimmer/tracking';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import * as EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import CommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import { restartableTask, task } from 'ember-concurrency-decorators';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import HeatmapConfiguration, { Metric } from 'heatmap/services/heatmap-configuration';
import CommunicationArrowMesh from 'explorviz-frontend/view-objects/3d/application/communication-arrow-mesh';
import {
  Class, isClass, Package,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import computeDrawableClassCommunication, { DrawableClassCommunication } from 'explorviz-frontend/utils/landscape-rendering/class-communication-computer';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import { Span, Trace } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { getAllClassesInApplication } from 'explorviz-frontend/utils/application-helpers';
import { perform, taskFor } from 'ember-concurrency-ts';
import { Position2D } from 'explorviz-frontend/modifiers/interaction-modifier';
import {
  highlight, highlightModel, highlightTrace, removeHighlighting, updateHighlighting,
} from 'explorviz-frontend/utils/application-rendering/highlighting';
import {
  applyDefaultApplicationLayout,
  closeAllComponents,
  closeComponentMesh,
  moveCameraTo,
  openComponentMesh,
  openAllComponents,
  restoreComponentState,
  toggleComponentMeshState,
} from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import applySimpleHeatOnFoundation, { addHeatmapHelperLine, computeHeatMapViewPos, removeHeatmapHelperLines } from 'heatmap/utils/heatmap-helper';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { simpleHeatmap } from 'heatmap/utils/simple-heatmap';
import UserSettings from 'explorviz-frontend/services/user-settings';
import LocalUser from 'collaborative-mode/services/local-user';

interface Args {
  readonly landscapeData: LandscapeData;
  readonly font: THREE.Font;
  readonly visualizationPaused: boolean;
  readonly components: string[];
  readonly showDataSelection: boolean;
  addComponent(componentPath: string): void; // is passed down to the viz navbar
  removeComponent(component: string): void;
  openDataSelection(): void;
  closeDataSelection(): void;
  toggleVisualizationUpdating(): void;
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity?: Package | Class | DrawableClassCommunication
};

type LayoutData = {
  height: number,
  width: number,
  depth: number,
  positionX: number,
  positionY: number,
  positionZ: number
};

export default class ApplicationRendering extends GlimmerComponent<Args> {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service('heatmap-configuration')
  heatmapConf!: HeatmapConfiguration;

  @service()
  worker!: any;

  @service('user-settings')
  userSettings!: UserSettings;

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  @tracked
  hammerInteraction: HammerInteraction;

  @tracked
  camera!: THREE.PerspectiveCamera;

  @service('local-user')
  private localUser!: LocalUser;

  renderer!: THREE.WebGLRenderer;

  clock = new THREE.Clock();

  // Used to display performance and memory usage information
  threePerformance: THREEPerformance | undefined;

  // Incremented every time a frame is rendered
  animationFrameId = 0;

  // Used to register (mouse) events
  hoveredObject: BaseMesh | null;

  drawableClassCommunications: DrawableClassCommunication[] = [];

  // Extended Object3D which manages application meshes
  readonly applicationObject3D: ApplicationObject3D;

  readonly communicationRendering: CommunicationRendering;

  get rightClickMenuItems() {
    const commButtonTitle = this.configuration.isCommRendered ? 'Hide Communication' : 'Add Communication';
    const heatmapButtonTitle = this.heatmapConf.heatmapActive ? 'Disable Heatmap' : 'Enable Heatmap';
    const pauseButtonTitle = this.args.visualizationPaused ? 'Resume Visualization' : 'Pause Visualization';

    return [
      { title: 'Reset View', action: this.resetView },
      { title: 'Open All Components', action: this.openAllComponents },
      { title: commButtonTitle, action: this.toggleCommunicationRendering },
      { title: heatmapButtonTitle, action: this.toggleHeatmap },
      { title: pauseButtonTitle, action: this.args.toggleVisualizationUpdating },
      { title: 'Open Sidebar', action: this.args.openDataSelection },
    ];
  }

  @tracked
  popupData: PopupData | null = null;

  isFirstRendering = true;

  // these spheres represent the cursor of the other users
  // and are only visible in collaborative mode
  spheres: Map<string, Array<THREE.Mesh>> = new Map();

  spheresIndex = 0;

  get font() {
    return this.args.font;
  }

  get appSettings() {
    return this.userSettings.applicationSettings;
  }

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.render = this.render.bind(this);
    this.hammerInteraction = HammerInteraction.create();

    const { application, dynamicLandscapeData } = this.args.landscapeData;

    this.applicationObject3D = new ApplicationObject3D(application!,
      new Map(), dynamicLandscapeData);

    this.communicationRendering = new CommunicationRendering(
      this.configuration,
      this.userSettings,
      this.heatmapConf,
    );

    this.hoveredObject = null;
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

    if (this.configuration.popupPosition) {
      this.popupData = {
        mouseX: this.configuration.popupPosition.x,
        mouseY: this.configuration.popupPosition.y,
      };
    }

    try {
      await perform(this.loadApplication);
    } catch (e) {
      // console.log(e);
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

    const { value: showFpsCounter } = this.userSettings.applicationSettings.showFpsCounter;

    if (showFpsCounter) {
      this.threePerformance = new THREEPerformance();
    }
  }

  /**
   * Creates a scene, its background and adds a landscapeObject3D to it
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.applicationColors.backgroundColor;
    this.debug('Scene created');
  }

  /**
   * Creates a PerspectiveCamera according to canvas size and sets its initial position
   */
  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.debug('Renderer set up');
  }

  /**
   * Creates a SpotLight and an AmbientLight and adds it to the scene
   */
  initLights() {
    // const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 2000);
    spotLight.position.set(-200, 100, 100);
    spotLight.castShadow = true;

    spotLight.angle = 0.3;
    spotLight.penumbra = 0.2;
    spotLight.decay = 2;
    // spotLight.distance = 50;

    this.scene.add(spotLight);

    const light = new THREE.AmbientLight(new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);
    this.debug('Lights added');
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region MOUSE EVENT HANDLER
  @action
  handleSingleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;

    const mesh = intersection.object;
    this.singleClickOnMesh(mesh);
  }

  @action
  singleClickOnMesh(mesh: THREE.Object3D) {
    // User clicked on blank spot on the canvas
    if (mesh === undefined) {
      removeHighlighting(this.applicationObject3D);
    } else if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh
      || mesh instanceof ClazzCommunicationMesh) {
      const { value } = this.appSettings.transparencyIntensity;
      highlight(mesh, this.applicationObject3D, this.drawableClassCommunications, value);

      if (this.heatmapConf.heatmapActive) {
        this.applicationObject3D.setComponentMeshOpacity(0.1);
        this.applicationObject3D.setCommunicationOpacity(0.1);
      }
    }
  }

  @action
  handleDoubleClick(intersection: THREE.Intersection | null) {
    if (!intersection) return;
    const mesh = intersection.object;
    this.doubleClickOnMesh(mesh);
  }

  @action
  doubleClickOnMesh(mesh: THREE.Object3D) {
    // Toggle open state of clicked component
    if (mesh instanceof ComponentMesh) {
      toggleComponentMeshState(mesh, this.applicationObject3D);
      this.addCommunication();
      if (this.appSettings.keepHighlightingOnOpenOrClose.value) {
        const { value } = this.appSettings.transparencyIntensity;
        updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
      } else {
        this.unhighlightAll();
      }
      // Close all components since foundation shall never be closed itself
    } else if (mesh instanceof FoundationMesh) {
      closeAllComponents(this.applicationObject3D);
      // Re-compute communication and highlighting
      this.addCommunication();
      if (this.appSettings.keepHighlightingOnOpenOrClose.value) {
        const { value } = this.appSettings.transparencyIntensity;
        updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
      } else {
        this.unhighlightAll();
      }
    }
    if (this.heatmapConf.heatmapActive) {
      this.applicationObject3D.setComponentMeshOpacity(0.1);
      this.applicationObject3D.setCommunicationOpacity(0.1);
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
    const { value: enableHoverEffects } = this.appSettings.enableHoverEffects;

    // Update hover effect
    if (mesh === undefined && this.hoveredObject) {
      this.hoveredObject.resetHoverEffect();
      this.hoveredObject = null;
    } else if (mesh instanceof BaseMesh && enableHoverEffects && !this.heatmapConf.heatmapActive) {
      if (this.hoveredObject) { this.hoveredObject.resetHoverEffect(); }

      this.hoveredObject = mesh;
      mesh.applyHoverEffect();
    }

    // Hide popups when mouse moves
    if (!this.appSettings.enableCustomPopupPosition.value) {
      this.popupData = null;
    }
  }

  @action
  handleMouseWheel(delta: number) {
    // Do not show popups while zooming
    if (!this.appSettings.enableCustomPopupPosition.value) {
      this.popupData = null;
    }

    // Change zoom depending on mouse wheel direction
    this.camera.position.z += delta * 3.5;
  }

  @action
  handleMouseOut() {
    if (!this.appSettings.enableCustomPopupPosition.value) {
      this.popupData = null;
    }
  }

  /*   handleMouseEnter() {
  } */
  @action
  handleMouseStop(intersection: THREE.Intersection | null, mouseOnCanvas: Position2D) {
    if (!intersection) return;
    const mesh = intersection.object;

    if (mesh && (mesh.parent instanceof ApplicationObject3D)) {
      const parentObj = mesh.parent;
      const pingPosition = parentObj.worldToLocal(intersection.point);
      taskFor(this.localUser.mousePing.ping).perform({ parentObj: parentObj, position: pingPosition })
    }

    this.mouseStopOnMesh(mesh, mouseOnCanvas);
  }

  @action
  mouseStopOnMesh(mesh: THREE.Object3D, mouseOnCanvas: Position2D) {
    // Show information as popup is mouse stopped on top of a mesh
    if ((mesh instanceof ClazzMesh || mesh instanceof ComponentMesh
      || mesh instanceof ClazzCommunicationMesh)) {
      this.popupData = {
        mouseX: mouseOnCanvas.x,
        mouseY: mouseOnCanvas.y,
        entity: mesh.dataModel,
      };
    }
  }

  @action
  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    const LEFT_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 3;

    if (button === RIGHT_MOUSE_BUTTON) {
      // Rotate object
      this.applicationObject3D.rotation.x += delta.y / 100;
      this.applicationObject3D.rotation.y += delta.x / 100;
    } else if (button === LEFT_MOUSE_BUTTON) {
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

  // #endregion MOUSE EVENT HANDLER

  // #region SCENE POPULATION

  @task *
    loadApplication() {
    this.applicationObject3D.dataModel = this.args.landscapeData.application!;
    this.applicationObject3D.traces = this.args.landscapeData.dynamicLandscapeData;
    try {
      yield perform(this.populateScene);

      if (this.isFirstRendering) {
        // Display application nicely for first rendering
        applyDefaultApplicationLayout(this.applicationObject3D);
        this.addCommunication();
        this.applicationObject3D.resetRotation();

        this.isFirstRendering = false;
      }
    } catch (e) {
      // console.log(e);
    }
  }

  @restartableTask *
    populateScene() {
    try {
      const workerPayload = {
        structure: this.applicationObject3D.dataModel,
        dynamic: this.applicationObject3D.traces,
      };

      const layoutMap: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', workerPayload);

      // Remember state of components
      const { openComponentIds } = this.applicationObject3D;

      // Converting plain JSON layout data due to worker limitations
      const boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutMap);
      this.applicationObject3D.boxLayoutMap = boxLayoutMap;

      // Clean up old application
      this.cleanUpApplication();

      // Add new meshes to application
      EntityRendering.addFoundationAndChildrenToApplication(this.applicationObject3D,
        this.configuration.applicationColors);

      if (!this.applicationObject3D.globeMesh) {
        // reposition
        this.applicationObject3D.addGlobeToApplication();
        this.applicationObject3D.initializeGlobeAnimation();
      } else {
        this.applicationObject3D.repositionGlobeToApplication();
      }

      // Restore old state of components
      restoreComponentState(this.applicationObject3D, openComponentIds);
      this.updateDrawableClassCommunications();
      this.addCommunication();
      this.addLabels();

      this.scene.add(this.applicationObject3D);

      if (this.heatmapConf.heatmapActive) {
        perform(this.calculateHeatmapTask, this.applicationObject3D, () => {
          this.applyHeatmap();
          this.heatmapConf.triggerLatestHeatmapUpdate();
        });
      }
    } catch (e) {
      // console.log(e);
    }
  }

  /**
   * Iterates over all box meshes and calls respective functions to label them
   */
  addLabels() {
    if (!this.font) { return; }

    const {
      clazzTextColor, componentTextColor, foundationTextColor,
    } = this.configuration.applicationColors;

    // Label all entities (excluding communication)
    this.applicationObject3D.getBoxMeshes().forEach((mesh) => {
      if (mesh instanceof ClazzMesh) {
        Labeler.addClazzTextLabel(mesh, this.font, clazzTextColor);
      } else if (mesh instanceof ComponentMesh) {
        Labeler.addBoxTextLabel(mesh, this.font, componentTextColor);
      } else if (mesh instanceof FoundationMesh) {
        Labeler.addBoxTextLabel(mesh, this.font, foundationTextColor);
      }
    });
  }

  updateDrawableClassCommunications() {
    const { structureLandscapeData, application } = this.args.landscapeData;
    const drawableClassCommunications = computeDrawableClassCommunication(
      structureLandscapeData,
      this.applicationObject3D.traces,
    );

    const allClasses = new Set(getAllClassesInApplication(application!));

    const communicationInApplication = drawableClassCommunications.filter(
      (comm) => allClasses.has(comm.sourceClass) || allClasses.has(comm.targetClass),
    );

    this.drawableClassCommunications = communicationInApplication;
  }

  // #endregion SCENE POPULATION

  // #region COLLABORATIVE
  @action
  setPerspective(position: number[], rotation: number[]) {
    this.camera.position.fromArray(position);
    this.applicationObject3D.rotation.fromArray(rotation);
  }
  // #endregion COLLABORATIVE

  // #region HEATMAP

  @restartableTask *
    calculateHeatmapTask(
      applicationObject3D: ApplicationObject3D,
      callback?: () => void,
  ) {
    try {
      const workerPayload = {
        structure: applicationObject3D.dataModel,
        dynamic: applicationObject3D.traces,
      };

      const metrics: Metric[] = yield this.worker.postMessage('metrics-worker', workerPayload);

      this.heatmapConf.applicationID = applicationObject3D.dataModel.id;
      this.heatmapConf.latestClazzMetricScores = metrics;
      this.heatmapConf.saveAndCalculateMetricScores(metrics);

      this.heatmapConf.updateCurrentlyViewedMetric();

      if (callback) callback();
    } catch (e) {
      this.debug(e);
    }
  }

  applyHeatmap() {
    if (!this.heatmapConf.latestClazzMetricScores
      || !this.heatmapConf.latestClazzMetricScores.firstObject) {
      AlertifyHandler.showAlertifyError('No metrics available.');
      return;
    }

    // Selected first metric if none is selected yet
    if (!this.heatmapConf.selectedMetric) {
      this.heatmapConf.selectedMetric = this.heatmapConf.latestClazzMetricScores.firstObject;
    }

    const { selectedMetric } = this.heatmapConf;

    this.applicationObject3D.setComponentMeshOpacity(0.1);
    this.applicationObject3D.setCommunicationOpacity(0.1);

    const foundationMesh = this.applicationObject3D
      .getBoxMeshbyModelId(this.args.landscapeData.application!.id);

    if (!(foundationMesh instanceof FoundationMesh)) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = foundationMesh.width;
    canvas.height = foundationMesh.depth;
    const simpleHeatMap = simpleHeatmap(selectedMetric.max, canvas,
      this.heatmapConf.getSimpleHeatGradient(),
      this.heatmapConf.heatmapRadius, this.heatmapConf.blurRadius);

    const foundationWorldPosition = new THREE.Vector3();

    foundationMesh.getWorldPosition(foundationWorldPosition);

    removeHeatmapHelperLines(this.applicationObject3D);

    const boxMeshes = this.applicationObject3D.getBoxMeshes();

    boxMeshes.forEach((boxMesh) => {
      if (boxMesh instanceof ClazzMesh) {
        this.heatmapClazzUpdate(boxMesh.dataModel, foundationMesh,
          simpleHeatMap);
      }
    });

    simpleHeatMap.draw(0.0);
    applySimpleHeatOnFoundation(foundationMesh, canvas);

    this.heatmapConf.currentApplication = this.applicationObject3D;
    this.heatmapConf.applicationID = this.applicationObject3D.dataModel.id;
    this.heatmapConf.heatmapActive = true;
  }

  removeHeatmap() {
    this.applicationObject3D.setOpacity(1);
    removeHeatmapHelperLines(this.applicationObject3D);

    const foundationMesh = this.applicationObject3D
      .getBoxMeshbyModelId(this.args.landscapeData.application!.id);

    if (foundationMesh && foundationMesh instanceof FoundationMesh) {
      foundationMesh.setDefaultMaterial();
    }

    updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, 1);

    this.heatmapConf.currentApplication = null;
    this.heatmapConf.heatmapActive = false;
  }

  heatmapClazzUpdate(clazz: Class, foundationMesh: FoundationMesh, simpleHeatMap: any) {
    // Calculate center point of the clazz floor. This is used for computing the corresponding
    // face on the foundation box.
    const clazzMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.id) as
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
    const viewPos = computeHeatMapViewPos(foundationMesh, this.camera);

    clazzPos.y -= clazzMesh.height / 2;

    this.applicationObject3D.localToWorld(clazzPos);

    // The vector from the viewPos to the clazz floor center point
    const rayVector = clazzPos.clone().sub(viewPos);

    // Following the ray vector from the floor center get the intersection with the foundation.
    raycaster.set(clazzPos, rayVector.normalize());

    const firstIntersection = raycaster.intersectObject(foundationMesh, false)[0];

    const worldIntersectionPoint = firstIntersection.point.clone();
    this.applicationObject3D.worldToLocal(worldIntersectionPoint);

    if (this.heatmapConf.useHelperLines) {
      addHeatmapHelperLine(this.applicationObject3D, clazzPos, worldIntersectionPoint);
    }

    // Compute color only for the first intersection point for consistency if one was found.
    if (firstIntersection && firstIntersection.uv) {
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

  // #endregion HEATMAP

  // #region RENDERING LOOP

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    const { value: showFpsCounter } = this.userSettings.applicationSettings.showFpsCounter;

    if (showFpsCounter && !this.threePerformance) {
      this.threePerformance = new THREEPerformance();
    } else if (!showFpsCounter && this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
      this.threePerformance = undefined;
    }

    if (this.threePerformance) {
      this.threePerformance.threexStats.update(this.renderer);
      this.threePerformance.stats.begin();
    }

    this.applicationObject3D.animationMixer?.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);

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
    const sphereGeometry = new THREE.SphereBufferGeometry(0.4, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color });

    for (let i = 0; i < 30; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(sphere);
      spheres.push(sphere);
    }
    return spheres;
  }

  // #endregion RENDERING LOOP

  // #region ACTIONS

  /**
   * Opens all parents / components of a given component or clazz.
   * Adds communication and restores highlighting.
   *
   * @param entity Component or Clazz of which the mesh parents shall be opened
   */
  @action
  openParents(entity: Package | Class) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    function getAllAncestorComponents(entity: Package | Class): Package[] {
      if (isClass(entity)) {
        return getAllAncestorComponents(entity.parent);
      }

      if (entity.parent === undefined) {
        return [];
      }

      return [entity.parent, ...getAllAncestorComponents(entity.parent)];
    }

    const ancestors = getAllAncestorComponents(entity);
    ancestors.forEach((anc) => {
      const ancestorMesh = this.applicationObject3D.getBoxMeshbyModelId(anc.id);
      if (ancestorMesh instanceof ComponentMesh) {
        openComponentMesh(ancestorMesh, this.applicationObject3D);
      }
    });
    this.addCommunication();

    if (this.appSettings.keepHighlightingOnOpenOrClose.value) {
      const { value } = this.appSettings.transparencyIntensity;
      updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
    } else {
      this.unhighlightAll();
    }
  }

  /**
   * Closes the corresponding component mesh to a given component
   *
   * @param component Data model of the component which shall be closed
   */
  @action
  closeComponent(component: Package) {
    const mesh = this.applicationObject3D.getBoxMeshbyModelId(component.id);
    if (mesh instanceof ComponentMesh) {
      closeComponentMesh(mesh, this.applicationObject3D);
    }
    this.addCommunication();

    if (this.appSettings.keepHighlightingOnOpenOrClose.value) {
      const { value } = this.appSettings.transparencyIntensity;
      updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
    } else {
      this.unhighlightAll();
    }
  }

  /**
   * Opens all component meshes. Then adds communication and restores highlighting.
   */
  @action
  openAllComponents() {
    openAllComponents(this.applicationObject3D);

    this.addCommunication();

    if (this.appSettings.keepHighlightingOnOpenOrClose.value) {
      const { value } = this.appSettings.transparencyIntensity;
      updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
    } else {
      this.unhighlightAll();
    }
  }

  @action
  updateHighlighting() {
    const { value } = this.appSettings.transparencyIntensity;
    updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, value);
  }

  @action
  addCommunication() {
    this.communicationRendering.addCommunication(this.applicationObject3D,
      this.drawableClassCommunications);
    updateHighlighting(this.applicationObject3D, this.drawableClassCommunications, 1);

    if (this.heatmapConf.heatmapActive) {
      this.applicationObject3D.setComponentMeshOpacity(0.1);
      this.applicationObject3D.setCommunicationOpacity(0.1);
    }
  }

  /**
   * Toggles the visualization of communication lines.
   */
  @action
  toggleCommunicationRendering() {
    this.configuration.isCommRendered = !this.configuration.isCommRendered;

    if (this.configuration.isCommRendered) {
      this.communicationRendering.addCommunication(this.applicationObject3D,
        this.drawableClassCommunications);
    } else {
      this.applicationObject3D.removeAllCommunication();

      // Remove highlighting if highlighted communication is no longer visible
      if (this.applicationObject3D.highlightedEntity instanceof ClazzCommunicationMesh) {
        removeHighlighting(this.applicationObject3D);
      }
    }
  }

  /**
   * Highlights a given component or clazz
   *
   * @param entity Component or clazz which shall be highlighted
   */
  @action
  highlightModel(entity: Package | Class) {
    const { value } = this.appSettings.transparencyIntensity;
    highlightModel(entity, this.applicationObject3D, this.drawableClassCommunications, value);
  }

  /**
   * Removes all (possibly) existing highlighting.
   */
  @action
  unhighlightAll() {
    removeHighlighting(this.applicationObject3D);
  }

  /**
   * Moves camera such that a specified clazz or clazz communication is in focus.
   *
   * @param model Clazz or clazz communication which shall be in focus of the camera
   */
  @action
  moveCameraTo(emberModel: Class | Span) {
    const applicationCenter = this.applicationObject3D.layout.center;

    moveCameraTo(emberModel, applicationCenter, this.camera, this.applicationObject3D);
  }

  /**
   * Sets rotation of application and position of camera to default positon
   */
  @action
  resetView() {
    this.camera.position.set(0, 0, 100);
    this.applicationObject3D.resetRotation();
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
   * Performs a run to re-populate the scene
   */
  @action
  onLandscapeUpdated() {
    perform(this.loadApplication);
  }

  /**
   * Highlights a trace or specified trace step.
   * Opens all component meshes to make whole trace visible.
   *
   * @param trace Trace which shall be highlighted.
   * @param step Step of the trace which shall be highlighted. Default is 1.
   */
  @action
  highlightTrace(trace: Trace, traceStep: string) {
    // Open components such that complete trace is visible
    this.openAllComponents();
    const { value } = this.appSettings.transparencyIntensity;
    highlightTrace(trace, traceStep, this.applicationObject3D,
      this.drawableClassCommunications, this.args.landscapeData.structureLandscapeData, value);
  }

  @action
  removeHighlighting() {
    removeHighlighting(this.applicationObject3D);
  }

  @action
  updateColors() {
    this.scene.traverse((object3D) => {
      if (object3D instanceof BaseMesh) {
        object3D.updateColor();
        // Special case because communication arrow is no base mesh
      } else if (object3D instanceof CommunicationArrowMesh) {
        object3D.updateColor(this.configuration.applicationColors.communicationArrowColor);
      }
    });
  }

  @action
  triggerHeatmapVisualization() {
    const metricName = this.heatmapConf.selectedMetric?.name;

    if (metricName) {
      this.heatmapConf.setSelectedMetricForCurrentMode(metricName);
    }

    if (this.heatmapConf.heatmapActive) {
      this.applyHeatmap();
    }
  }

  @action
  updateMetric(metric: Metric) {
    const metricName = metric.name;

    this.heatmapConf.setSelectedMetricForCurrentMode(metricName);

    if (this.heatmapConf.heatmapActive) {
      this.applyHeatmap();
    }
  }

  @action
  toggleHeatmap() {
    // Avoid unwanted reflections in heatmap mode
    this.setSpotLightVisibilityInScene(this.heatmapConf.heatmapActive);

    if (this.heatmapConf.heatmapActive) {
      this.removeHeatmap();
    } else {
      // TODO: Check whether new calculation of heatmap is necessary
      perform(this.calculateHeatmapTask, this.applicationObject3D, () => {
        this.applyHeatmap();
      });
    }
  }

  // #endregion ACTIONS

  // #region COMPONENT AND SCENE CLEAN-UP

  willDestroy() {
    super.willDestroy();

    cancelAnimationFrame(this.animationFrameId);
    this.cleanUpApplication();
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    this.heatmapConf.cleanup();
    this.configuration.isCommRendered = true;

    if (this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
    }

    this.debug('Cleaned up application rendering');
  }

  cleanUpApplication() {
    this.applicationObject3D.removeAllEntities();
    removeHighlighting(this.applicationObject3D);
  }

  // #endregion COMPONENT AND SCENE CLEAN-UP

  // #region ADDITIONAL HELPER FUNCTIONS

  /**
   * Sets all objects within the scene of type SpotLight to desired visibility
   *
   * @param isVisible Determines whether a spotlight is visible or not
   */
  setSpotLightVisibilityInScene(isVisible = true) {
    this.scene.children.forEach((child) => {
      if (child instanceof THREE.SpotLight) {
        child.visible = isVisible;
      }
    });
  }

  /**
   * Takes a map with plain JSON layout objects and creates BoxLayout objects from it
   *
   * @param layoutedApplication Map containing plain JSON layout data
   */
  static convertToBoxLayoutMap(layoutedApplication: Map<string, LayoutData>) {
    const boxLayoutMap: Map<string, BoxLayout> = new Map();

    layoutedApplication.forEach((value, key) => {
      const boxLayout = new BoxLayout();
      boxLayout.positionX = value.positionX;
      boxLayout.positionY = value.positionY;
      boxLayout.positionZ = value.positionZ;
      boxLayout.width = value.width;
      boxLayout.height = value.height;
      boxLayout.depth = value.depth;
      boxLayoutMap.set(key, boxLayout);
    });

    return boxLayoutMap;
  }

  // #endregion ADDITIONAL HELPER FUNCTIONS
}
