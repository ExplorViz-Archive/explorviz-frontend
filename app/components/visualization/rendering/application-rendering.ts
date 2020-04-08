import GlimmerComponent from '@glimmer/component';
import Application from 'explorviz-frontend/models/application';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import { inject as service } from '@ember/service';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import { applyCommunicationLayout } from 'explorviz-frontend/utils/application-rendering/city-layouter';
import CalcCenterAndZoom from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import Interaction, { Position2D } from 'explorviz-frontend/utils/interaction';
import DS from 'ember-data';
import Configuration from 'explorviz-frontend/services/configuration';
import Clazz from 'explorviz-frontend/models/clazz';
import CurrentUser from 'explorviz-frontend/services/current-user';
import Component from 'explorviz-frontend/models/component';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import HoverEffectHandler from 'explorviz-frontend/utils/hover-effect-handler';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import { tracked } from '@glimmer/tracking';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import { reduceApplication } from 'explorviz-frontend/utils/application-rendering/model-reducer';
import Trace from 'explorviz-frontend/models/trace';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';

interface Args {
  id: string,
  application: Application,
  font: THREE.Font,
  addComponent(componentPath: string): void // is passed down to the viz navbar
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity: Component | Clazz | DrawableClazzCommunication
};

export type BoxLayout = {
  height: number,
  width: number,
  depth: number,
  positionX: number,
  positionY: number,
  positionZ: number
};

export default class ApplicationRendering extends GlimmerComponent<Args> {
  @service('store')
  store!: DS.Store;

  @service('configuration')
  configuration!: Configuration;

  @service('current-user')
  currentUser!: CurrentUser;

  @service('rendering-service')
  renderingService!: RenderingService;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service()
  worker!: any;

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  camera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  threePerformance: THREEPerformance|undefined;

  applicationObject3D = new THREE.Object3D();

  animationFrameId = 0;

  interaction!: Interaction;

  modelIdToMesh: Map<string, BaseMesh> = new Map();

  commIdToMesh: Map<string, ClazzCommunicationMesh> = new Map();

  boxLayoutMap: Map<string, BoxLayout> = new Map();

  hoverHandler: HoverEffectHandler = new HoverEffectHandler();

  highlighter: Highlighting = new Highlighting(this.modelIdToMesh, this.commIdToMesh);

  @tracked
  popupData: PopupData | null = null;

  get font() {
    return this.args.font;
  }

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.render = this.render.bind(this);
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
  outerDivInserted(outerDiv: HTMLElement) {
    this.debug('Outer Div inserted');

    this.initThreeJs();
    this.initInteraction();
    this.render();

    this.resize(outerDiv);

    this.populateScene();
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
    this.scene.background = new THREE.Color(this.configuration.applicationColors.background);
    this.debug('Scene created');
  }

  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
    this.debug('Camera added');
  }

  initRenderer() {
    const { width, height } = this.canvas;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.debug('Renderer set up');
  }

  initLights() {
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.scene.add(spotLight);

    const light = new THREE.AmbientLight(new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);
    this.debug('Lights added');
  }

  initInteraction() {
    this.handleSingleClick = this.handleSingleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    // this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseStop = this.handleMouseStop.bind(this);
    this.handlePanning = this.handlePanning.bind(this);

    this.interaction = new Interaction(this.canvas, this.camera, this.renderer,
      this.applicationObject3D, {
        singleClick: this.handleSingleClick,
        doubleClick: this.handleDoubleClick,
        mouseMove: this.handleMouseMove,
        mouseWheel: this.handleMouseWheel,
        mouseOut: this.handleMouseOut,
        // mouseEnter: this.handleMouseEnter,
        mouseStop: this.handleMouseStop,
        panning: this.handlePanning,
      });
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION


  // #region MOUSE EVENT HANDLER

  handleSingleClick(mesh: THREE.Mesh | undefined) {
    if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh
      || mesh instanceof ClazzCommunicationMesh) {
      this.highlighter.highlight(mesh, this.args.application);
    }
  }

  handleDoubleClick(mesh: THREE.Mesh | undefined) {
    // Toggle open state of component
    if (mesh instanceof ComponentMesh) {
      if (mesh.opened) {
        this.closeComponentMesh(mesh);
      } else {
        this.openComponentMesh(mesh);
      }
      this.addCommunication(this.args.application);
    // Close all components since foundation shall never be closed itself
    } else if (mesh instanceof FoundationMesh) {
      this.closeAllComponents();
    }
  }

  handleMouseMove(mesh: THREE.Mesh | undefined) {
    const enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    if (mesh === undefined) {
      this.hoverHandler.resetHoverEffect();
    } else if (mesh instanceof BaseMesh && enableHoverEffects) {
      this.hoverHandler.applyHoverEffect(mesh);
    }

    this.popupData = null;
  }

  handleMouseWheel(delta: number) {
    this.popupData = null;
    this.camera.position.z += delta * 3.5;
  }

  handleMouseOut() {
    this.popupData = null;
  }

  /*   handleMouseEnter() {
  } */

  handleMouseStop(mesh: THREE.Mesh | undefined, mouseOnCanvas: Position2D) {
    if (mesh === undefined) { return; }

    if ((mesh instanceof ClazzMesh || mesh instanceof ComponentMesh
      || mesh instanceof ClazzCommunicationMesh) && !mesh.dataModel.isDestroyed) {
      this.popupData = {
        mouseX: mouseOnCanvas.x,
        mouseY: mouseOnCanvas.y,
        entity: mesh.dataModel,
      };
    }
  }

  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    if (button === 3) {
      // Rotate object
      this.applicationObject3D.rotation.x += delta.y / 100;
      this.applicationObject3D.rotation.y += delta.x / 100;
    } else if (button === 1) {
      // Translate camera
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

  // #endregion MOUSE EVENT HANDLER


  // #region COMPONENT OPENING AND CLOSING

  closeAllComponents() {
    this.modelIdToMesh.forEach((mesh) => {
      if (mesh instanceof ComponentMesh) {
        this.closeComponentMesh(mesh);
      }
    });
    this.addCommunication(this.args.application);
  }

  openComponentsRecursively(component: Component) {
    const components = component.children;
    components.forEach((child) => {
      const mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });
  }

  openComponentMesh(mesh: ComponentMesh) {
    if (mesh.opened) { return; }

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = HEIGHT_OPENED_COMPONENT;

    // Reset y coordinate
    mesh.position.y -= mesh.layoutHeight / 2;
    // Set y coordinate according to open component height
    mesh.position.y += HEIGHT_OPENED_COMPONENT / 2;

    mesh.opened = true;
    mesh.visible = true;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = this.modelIdToMesh.get(clazz.get('id'));
      if (childMesh) {
        childMesh.visible = true;
      }
    });
  }

  closeComponentMesh(mesh: ComponentMesh) {
    if (!mesh.opened) { return; }

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = mesh.layoutHeight;

    // Reset y coordinate
    mesh.position.y -= HEIGHT_OPENED_COMPONENT / 2;
    // Set y coordinate according to closed component height
    mesh.position.y += mesh.layoutHeight / 2;

    mesh.opened = false;
    Labeler.positionBoxLabel(mesh);

    const childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      const childMesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (childMesh instanceof ComponentMesh) {
        childMesh.visible = false;
        if (childMesh.opened) {
          this.closeComponentMesh(childMesh);
        }
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted) {
          this.highlighter.removeHighlighting();
        }
      }
    });

    const clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      const childMesh = this.modelIdToMesh.get(clazz.get('id'));
      if (childMesh instanceof ClazzMesh) {
        childMesh.visible = false;
        // Reset highlighting if highlighted entity is no longer visible
        if (childMesh.highlighted) {
          this.highlighter.removeHighlighting();
        }
      }
    });
  }

  // #endregion COMPONENT OPENING AND CLOSING


  // #region COMPONENT AND CLAZZ HIGHLIGHTING

  @action
  highlightTrace(trace: Trace, step = 1) {
    // Open components such that complete trace is visible
    this.openAllComponents();
    this.highlighter.highlightTrace(trace, step, this.args.application);
  }

  @action
  removeHighlighting() {
    this.highlighter.removeHighlighting();
  }

  // #endregion COMPONENT AND CLAZZ HIGHLIGHTING


  // #region SCENE POPULATION

  async populateScene() {
    const reducedApplication = reduceApplication(this.args.application);

    try {
      const layoutedApplication: Map<string, BoxLayout> = await this.worker.postMessage('city-layouter', reducedApplication);
      this.boxLayoutMap = layoutedApplication;
      this.addFoundationToScene(this.args.application);
      this.addCommunication(this.args.application);
      this.addLabels();

      this.scene.add(this.applicationObject3D);
      ApplicationRendering.resetRotation(this.applicationObject3D);
    } catch (e) {
      // console.log(e);
    }
  }

  addFoundationToScene(application: Application) {
    const foundationData = this.boxLayoutMap.get(application.id);

    if (foundationData === undefined) { return; }

    const OPENED_COMPONENT_HEIGHT = 1.5;

    const {
      foundation: foundationColor,
      componentOdd: componentOddColor,
      highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    const layoutPos = new THREE.Vector3(foundationData.positionX, foundationData.positionY,
      foundationData.positionZ);

    const mesh = new FoundationMesh(layoutPos, OPENED_COMPONENT_HEIGHT, foundationData.width,
      foundationData.depth, application, new THREE.Color(foundationColor),
      new THREE.Color(highlightedEntityColor));
    this.addMeshToScene(mesh, foundationData, OPENED_COMPONENT_HEIGHT);

    const children = application.get('components');

    children.forEach((child: Component) => {
      this.addComponentToScene(child, componentOddColor);
    });
  }

  addComponentToScene(component: Component, color: string) {
    const componentData = this.boxLayoutMap.get(component.id);

    if (componentData === undefined) { return; }

    const {
      componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    let layoutPos = new THREE.Vector3(componentData.positionX, componentData.positionY,
      componentData.positionZ);

    const mesh = new ComponentMesh(layoutPos, componentData.height, componentData.width,
      componentData.depth, component, new THREE.Color(color),
      new THREE.Color(highlightedEntityColor));
    this.addMeshToScene(mesh, componentData, componentData.height);
    this.updateMeshVisiblity(mesh);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      const clazzData = this.boxLayoutMap.get(clazz.get('id'));

      if (clazzData === undefined) { return; }

      layoutPos = new THREE.Vector3(clazzData.positionX, clazzData.positionY, clazzData.positionZ);
      const clazzMesh = new ClazzMesh(layoutPos, clazzData.height, clazzData.width, clazzData.depth,
        clazz, new THREE.Color(clazzColor), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(clazzMesh, clazzData, clazzData.height);
      this.updateMeshVisiblity(clazzMesh);
    });

    children.forEach((child: Component) => {
      if (color === componentEvenColor) {
        this.addComponentToScene(child, componentOddColor);
      } else {
        this.addComponentToScene(child, componentEvenColor);
      }
    });
  } // END addComponentToScene

  addMeshToScene(mesh: ComponentMesh | ClazzMesh | FoundationMesh, boxData: any, height: number) {
    const foundationData = this.boxLayoutMap.get(this.args.application.id);

    if (foundationData === undefined) { return; }

    const centerPoint = new THREE.Vector3(
      boxData.positionX + boxData.width / 2.0,
      boxData.positionY + height / 2.0,
      boxData.positionZ + boxData.depth / 2.0,
    );

    const applicationCenter = CalcCenterAndZoom(foundationData);
    centerPoint.sub(applicationCenter);

    mesh.position.copy(centerPoint);

    this.applicationObject3D.add(mesh);
    this.modelIdToMesh.set(mesh.dataModel.id, mesh);
  }

  updateMeshVisiblity(mesh: ComponentMesh | ClazzMesh) {
    let parent: Component;
    if (mesh instanceof ComponentMesh) {
      parent = mesh.dataModel.parentComponent;
    } else {
      parent = mesh.dataModel.parent;
    }
    const parentMesh = this.modelIdToMesh.get(parent.get('id'));
    if (parentMesh instanceof ComponentMesh) {
      mesh.visible = parentMesh.opened;
    }
  }

  addCommunication(application: Application) {
    const foundationData = this.boxLayoutMap.get(application.id);

    if (foundationData === undefined) {
      return;
    }

    this.removeAllCommunication();

    const maybeCurveHeight = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCurvyCommHeight');
    const curveHeight = typeof maybeCurveHeight === 'number' ? maybeCurveHeight : 0.0;
    const isCurved = curveHeight !== 0.0;

    const commLayoutMap = applyCommunicationLayout(application, this.boxLayoutMap,
      this.modelIdToMesh);
    const {
      communication: communicationColor,
      highlightedEntity: highlightedEntityColor,
      communicationArrow: arrowColorString,
    } = this.configuration.applicationColors;

    const drawableClazzCommunications = application.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((drawableClazzComm) => {
      const commLayout = commLayoutMap.get(drawableClazzComm.get('id'));

      // No layouting information available due to hidden communication
      if (!commLayout) {
        return;
      }

      const viewCenterPoint = CalcCenterAndZoom(foundationData);

      const pipe = new ClazzCommunicationMesh(commLayout, drawableClazzComm,
        new THREE.Color(communicationColor), new THREE.Color(highlightedEntityColor));

      pipe.render(viewCenterPoint, curveHeight);

      const ARROW_OFFSET = 0.8;
      const arrowHeight = isCurved ? curveHeight / 2 + ARROW_OFFSET : ARROW_OFFSET;
      const arrowThickness = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize');
      const arrowColor = new THREE.Color(arrowColorString).getHex();

      if (typeof arrowThickness === 'number' && arrowThickness > 0.0) { pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColor); }

      this.applicationObject3D.add(pipe);
      this.commIdToMesh.set(drawableClazzComm.get('id'), pipe);
    });

    this.highlighter.updateHighlighting(this.args.application);
  }

  /**
   * Iterates over all box meshes and calls respective functions to label them
   */
  addLabels() {
    if (!this.font) { return; }

    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors.componentText;
    const foundationTextColor = this.configuration.applicationColors.foundationText;

    // Label all entities (excluding communication)
    this.modelIdToMesh.forEach((mesh) => {
      if (mesh instanceof ClazzMesh) {
        Labeler.addClazzTextLabel(mesh, this.font, new THREE.Color(clazzTextColor));
      } else if (mesh instanceof ComponentMesh) {
        Labeler.addBoxTextLabel(mesh, this.font, new THREE.Color(componentTextColor));
      } else if (mesh instanceof FoundationMesh) {
        Labeler.addBoxTextLabel(mesh, this.font, new THREE.Color(foundationTextColor));
      }
    });
  }

  // #endregion SCENE POPULATION


  // #region RENDERING LOOP
  render() {
    if (this.isDestroyed) { return; }

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    if (this.threePerformance) {
      this.threePerformance.threexStats.update(this.renderer);
      this.threePerformance.stats.begin();
    }

    this.renderer.render(this.scene, this.camera);

    if (this.threePerformance) {
      this.threePerformance.stats.end();
    }
  }

  // #endregion RENDERING LOOP

  // #region ACTIONS

  @action
  openParents(entity: Component|Clazz) {
    const ancestors = entity.getAllAncestorComponents();
    ancestors.forEach((anc) => {
      const ancestorMesh = this.modelIdToMesh.get(anc.get('id'));
      if (ancestorMesh instanceof ComponentMesh) {
        this.openComponentMesh(ancestorMesh);
      }
    });
    this.addCommunication(this.args.application);
  }

  @action
  closeComponent(component: Component) {
    const mesh = this.modelIdToMesh.get(component.get('id'));
    if (mesh instanceof ComponentMesh) {
      this.closeComponentMesh(mesh);
    }
    this.addCommunication(this.args.application);
  }

  @action
  openAllComponents() {
    this.args.application.components.forEach((child) => {
      const mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });

    this.addCommunication(this.args.application);
  }

  @action
  highlightModel(entity: Component|Clazz) {
    this.highlighter.highlightModel(entity, this.args.application);
  }

  @action
  unhighlightAll() {
    this.highlighter.removeHighlighting();
  }

  @action
  moveCameraTo(emberModel: Clazz|ClazzCommunication) {
    if (!emberModel) {
      return;
    }

    // Calculate center point of application
    const foundationData = this.boxLayoutMap.get(this.args.application.id);

    if (foundationData === undefined) { return; }

    const applicationCenter = CalcCenterAndZoom(foundationData);

    if (emberModel instanceof ClazzCommunication) {
      const sourceClazzMesh = this.modelIdToMesh.get(emberModel.sourceClazz.get('id'));
      const targetClazzMesh = this.modelIdToMesh.get(emberModel.targetClazz.get('id'));

      if (sourceClazzMesh instanceof ClazzMesh && targetClazzMesh instanceof ClazzMesh) {
        const sourceLayoutPos = new THREE.Vector3().copy(sourceClazzMesh.layoutPos);
        const targetLayoutPos = new THREE.Vector3().copy(targetClazzMesh.layoutPos);

        const directionVector = targetLayoutPos.sub(sourceLayoutPos);

        const middleLayoutPos = sourceLayoutPos.add(directionVector.divideScalar(2));
        this.applyCameraPosition(applicationCenter, this.camera, middleLayoutPos);
        // Apply zoom
        this.camera.position.z += 50;
      }
    } else {
      const clazzMesh = this.modelIdToMesh.get(emberModel.get('id'));
      if (clazzMesh instanceof ClazzMesh) {
        const layoutPos = new THREE.Vector3().copy(clazzMesh.layoutPos);
        this.applyCameraPosition(applicationCenter, this.camera, layoutPos);
        // Apply zoom
        this.camera.position.z += 25;
      }
    }
  }

  applyCameraPosition(centerPoint: THREE.Vector3, camera: THREE.PerspectiveCamera,
    layoutPos: THREE.Vector3) {
    layoutPos.sub(centerPoint);
    layoutPos.multiplyScalar(0.5);

    const appQuaternion = new THREE.Quaternion();

    this.applicationObject3D.getWorldQuaternion(appQuaternion);
    layoutPos.applyQuaternion(appQuaternion);

    const appPosition = new THREE.Vector3();
    this.applicationObject3D.getWorldPosition(appPosition);
    layoutPos.sub(appPosition);

    // Move camera on to given position
    camera.position.set(layoutPos.x, layoutPos.y, layoutPos.z);
  }

  @action
  resetView() {
    this.highlighter.removeHighlighting();
    this.closeAllComponents();
    this.addCommunication(this.args.application);
    this.camera.position.set(0, 0, 100);
    ApplicationRendering.resetRotation(this.applicationObject3D);
  }

  @action
  resize(outerDiv: HTMLElement) {
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // #endregion ACTIONS


  // #region COMPONENT AND SCENE CLEAN-UP

  willDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.cleanUpApplication();
    this.scene.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.interaction.removeHandlers();

    if (this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
    }

    this.debug('Cleaned up application rendering');
  }

  cleanUpApplication() {
    this.modelIdToMesh.forEach((mesh) => {
      if (mesh instanceof BaseMesh) {
        mesh.delete();
      }
    });
    this.modelIdToMesh.clear();
    this.removeAllCommunication();
  }

  cleanAndUpdateScene() {
    this.debug('cleanAndUpdateScene');

    this.cleanUpApplication();
    this.populateScene();
  }

  removeAllCommunication() {
    this.commIdToMesh.forEach((mesh: ClazzCommunicationMesh) => {
      mesh.delete();
    });
    this.commIdToMesh.clear();
  }

  // #endregion COMPONENT AND SCENE CLEAN-UP

  // #region ADDITIONAL HELPER FUNCTIONS

  static resetRotation(application: THREE.Object3D) {
    const ROTATION_X = 0.65;
    const ROTATION_Y = 0.80;

    application.rotation.x = ROTATION_X;
    application.rotation.y = ROTATION_Y;
  }

  // #endregion ADDITIONAL HELPER FUNCTIONS
}
