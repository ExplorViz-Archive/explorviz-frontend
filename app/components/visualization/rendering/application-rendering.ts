import GlimmerComponent from '@glimmer/component';
import { action } from '@ember/object';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';
import { inject as service } from '@ember/service';
import * as Labeler from 'explorviz-frontend/utils/application-rendering/labeler';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
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
import Trace from 'explorviz-frontend/models/trace';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import EntityRendering from 'explorviz-frontend/utils/application-rendering/entity-rendering';
import CommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import { task } from 'ember-concurrency-decorators';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import CommunicationArrowMesh from 'explorviz-frontend/view-objects/3d/application/communication-arrow-mesh';
import { Application, Class, Package } from 'explorviz-frontend/services/landscape-listener';

interface Args {
  readonly id: string,
  readonly application: Application,
  readonly font: THREE.Font,
  addComponent(componentPath: string): void // is passed down to the viz navbar
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity: Package | Class | DrawableClazzCommunication
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

  @service('store')
  store!: DS.Store;

  @service('configuration')
  configuration!: Configuration;

  @service('current-user')
  currentUser!: CurrentUser;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service()
  worker!: any;

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  camera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  // Used to display performance and memory usage information
  threePerformance: THREEPerformance|undefined;

  // Incremented every time a frame is rendered
  animationFrameId = 0;

  // Used to register (mouse) events
  interaction!: Interaction;

  boxLayoutMap: Map<string, BoxLayout>;

  // Extended Object3D which manages application meshes
  readonly applicationObject3D: ApplicationObject3D;

  readonly hoverHandler: HoverEffectHandler;

  readonly highlighter: Highlighting;

  readonly entityRendering: EntityRendering;

  readonly communicationRendering: CommunicationRendering;

  readonly entityManipulation: EntityManipulation;

  @tracked
  popupData: PopupData | null = null;

  get font() {
    return this.args.font;
  }

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.render = this.render.bind(this);

    this.applicationObject3D = new ApplicationObject3D(this.args.application);

    this.boxLayoutMap = new Map();

    this.hoverHandler = new HoverEffectHandler();

    this.highlighter = new Highlighting(this.applicationObject3D);

    this.entityRendering = new EntityRendering(this.applicationObject3D, this.configuration);

    this.communicationRendering = new CommunicationRendering(this.applicationObject3D,
      this.configuration, this.currentUser);

    this.entityManipulation = new EntityManipulation(this.applicationObject3D,
      this.communicationRendering, this.highlighter);
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

    await this.loadNewApplication.perform();

    // Display application nicely for first rendering
    this.entityManipulation.applyDefaultApplicationLayout();
    /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
    this.applicationObject3D.resetRotation();
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

    /*    const showFpsCounter = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'showFpsCounter');

    if (showFpsCounter) {
      this.threePerformance = new THREEPerformance();
    } */
  }

  /**
   * Creates a scene, its background and adds a landscapeObject3D to it
   */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.applicationColors.background;
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
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
    // User clicked on blank spot on the canvas
    if (mesh === undefined) {
      this.highlighter.removeHighlighting();
    } else if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh
      || mesh instanceof ClazzCommunicationMesh) {
      this.highlighter.highlight(mesh);
    }
  }

  handleDoubleClick(mesh: THREE.Mesh | undefined) {
    // Toggle open state of clicked component
    if (mesh instanceof ComponentMesh) {
      this.entityManipulation.toggleComponentMeshState(mesh);
      /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
      this.highlighter.updateHighlighting();
    // Close all components since foundation shall never be closed itself
    } else if (mesh instanceof FoundationMesh) {
      this.entityManipulation.closeAllComponents(this.boxLayoutMap);
    }
  }

  handleMouseMove(mesh: THREE.Mesh | undefined) {
    /*     const enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    // Indicate on top of which mesh mouse is located (using a hover effect)
    if (mesh === undefined) {
      this.hoverHandler.resetHoverEffect();
    } else if (mesh instanceof BaseMesh && enableHoverEffects) {
      this.hoverHandler.applyHoverEffect(mesh);
    } */

    // Hide popups when mouse moves
    this.popupData = null;
  }

  handleMouseWheel(delta: number) {
    // Do not show popups while zooming
    this.popupData = null;

    // Change zoom depending on mouse wheel direction
    this.camera.position.z += delta * 3.5;
  }

  handleMouseOut() {
    this.popupData = null;
  }

  /*   handleMouseEnter() {
  } */

  handleMouseStop(mesh: THREE.Mesh | undefined, mouseOnCanvas: Position2D) {
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

  @task
  // eslint-disable-next-line
  loadNewApplication = task(function* (this: ApplicationRendering) {
    this.applicationObject3D.dataModel = this.args.application;
    yield this.populateScene.perform();
  });

  @task({ restartable: true })
  // eslint-disable-next-line
  populateScene = task(function* (this: ApplicationRendering) {
    try {
      const layoutedApplication: Map<string, LayoutData> = yield this.worker.postMessage('city-layouter', this.applicationObject3D.dataModel);

      // Converting plain JSON layout data due to worker limitations
      this.boxLayoutMap = ApplicationRendering.convertToBoxLayoutMap(layoutedApplication);
      const { openComponentIds } = this.applicationObject3D;

      // Clean up old application
      this.cleanUpApplication();

      // Add new meshes to application
      this.entityRendering.addFoundationAndChildrenToScene(this.applicationObject3D.dataModel,
        this.boxLayoutMap);

      // Restore old state of components
      this.entityManipulation.setComponentState(openComponentIds);
      /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
      this.addLabels();

      this.scene.add(this.applicationObject3D);
    } catch (e) {
      // console.log(e);
    }
  });

  /**
   * Iterates over all box meshes and calls respective functions to label them
   */
  addLabels() {
    if (!this.font) { return; }

    const clazzTextColor = this.configuration.applicationColors.clazzText;
    const componentTextColor = this.configuration.applicationColors.componentText;
    const foundationTextColor = this.configuration.applicationColors.foundationText;

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

  // #endregion SCENE POPULATION

  // #region RENDERING LOOP

  /**
   * Main rendering function
   */
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

  /**
   * Opens all parents / components of a given component or clazz.
   * Adds communication and restores highlighting.
   *
   * @param entity Component or Clazz of which the mesh parents shall be opened
   */
  @action
  openParents(entity: Component|Clazz) {
    const ancestors = entity.getAllAncestorComponents();
    ancestors.forEach((anc) => {
      const ancestorMesh = this.applicationObject3D.getBoxMeshbyModelId(anc.get('id'));
      if (ancestorMesh instanceof ComponentMesh) {
        this.entityManipulation.openComponentMesh(ancestorMesh);
      }
    });
    /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
    this.highlighter.updateHighlighting();
  }

  /**
   * Closes the corresponding component mesh to a given component
   *
   * @param component Data model of the component which shall be closed
   */
  @action
  closeComponent(component: Component) {
    const mesh = this.applicationObject3D.getBoxMeshbyModelId(component.get('id'));
    if (mesh instanceof ComponentMesh) {
      this.entityManipulation.closeComponentMesh(mesh);
    }
    /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
    this.highlighter.updateHighlighting();
  }

  /**
   * Opens all component meshes. Then adds communication and restores highlighting.
   */
  @action
  openAllComponents() {
    this.applicationObject3D.dataModel.packages.forEach((child) => {
      const mesh = this.applicationObject3D.getBoxMeshbyModelId(child.id);
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.entityManipulation.openComponentMesh(mesh);
      }
      this.entityManipulation.openComponentsRecursively(child);
    });

    /* this.communicationRendering.addCommunication(this.boxLayoutMap); */
    this.highlighter.updateHighlighting();
  }

  /**
   * Highlights a given component or clazz
   *
   * @param entity Component or clazz which shall be highlighted
   */
  @action
  highlightModel(entity: Component|Clazz) {
    this.highlighter.highlightModel(entity);
  }

  /**
   * Removes all (possibly) existing highlighting.
   */
  @action
  unhighlightAll() {
    this.highlighter.removeHighlighting();
  }

  /**
   * Moves camera such that a specified clazz or clazz communication is in focus.
   *
   * @param emberModel Clazz or clazz communication which shall be in focus of the camera
   */
  @action
  moveCameraTo(emberModel: Clazz|ClazzCommunication) {
    const applicationLayout = this.boxLayoutMap.get(this.applicationObject3D.dataModel.pid);

    if (!emberModel || !applicationLayout) {
      return;
    }

    this.entityManipulation.moveCameraTo(emberModel, applicationLayout.center,
      this.camera, this.applicationObject3D);
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
    this.loadNewApplication.perform();
  }

  /**
   * Highlights a trace or specified trace step.
   * Opens all component meshes to make whole trace visible.
   *
   * @param trace Trace which shall be highlighted.
   * @param step Step of the trace which shall be highlighted. Default is 1.
   */
  @action
  highlightTrace(trace: Trace, step = 1) {
    // Open components such that complete trace is visible
    this.openAllComponents();
    /* this.highlighter.highlightTrace(trace, step, this.applicationObject3D.dataModel); */
  }

  @action
  updateColors() {
    this.scene.traverse((object3D) => {
      if (object3D instanceof BaseMesh) {
        object3D.updateColor();
      // Special case because communication arrow is no base mesh
      } else if (object3D instanceof CommunicationArrowMesh) {
        object3D.updateColor(this.configuration.applicationColors.communicationArrow);
      }
    });
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
    this.applicationObject3D.removeAllEntities();
    this.highlighter.removeHighlighting();
  }

  // #endregion COMPONENT AND SCENE CLEAN-UP

  // #region ADDITIONAL HELPER FUNCTIONS

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
