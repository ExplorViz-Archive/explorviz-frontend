import GlimmerComponent from "@glimmer/component";
import Application from "explorviz-frontend/models/application";
import { action } from "@ember/object";
import debugLogger from "ember-debug-logger";
import THREE from 'three';
import { inject as service } from '@ember/service';
import RenderingService from "explorviz-frontend/services/rendering-service";
import LandscapeRepository from "explorviz-frontend/services/repos/landscape-repository";
import { applyCommunicationLayout } from 'explorviz-frontend/utils/application-rendering/city-layouter';
import CalcCenterAndZoom from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import Interaction, { Position2D } from 'explorviz-frontend/utils/interaction';
import DS from "ember-data";
import Configuration from "explorviz-frontend/services/configuration";
import Clazz from "explorviz-frontend/models/clazz";
import CurrentUser from "explorviz-frontend/services/current-user";
import Component from "explorviz-frontend/models/component";
import FoundationMesh from "explorviz-frontend/view-objects/3d/application/foundation-mesh";
import HoverEffectHandler from "explorviz-frontend/utils/hover-effect-handler";
import ClazzMesh from "explorviz-frontend/view-objects/3d/application/clazz-mesh";
import ComponentMesh from "explorviz-frontend/view-objects/3d/application/component-mesh";
import BoxMesh from "explorviz-frontend/view-objects/3d/application/box-mesh";
import CommunicationMesh from "explorviz-frontend/view-objects/3d/communication-mesh";
import DrawableClazzCommunication from "explorviz-frontend/models/drawableclazzcommunication";
import { tracked } from "@glimmer/tracking";
import BaseMesh from "explorviz-frontend/view-objects/3d/base-mesh";

interface Args {
  id: string,
  application: Application
  addComponent(componentPath: string): void // is passed down to the viz navbar
}

type PopupData = {
  mouseX: number,
  mouseY: number,
  entity: Component | Clazz | DrawableClazzCommunication
}

export type BoxLayout = {
  height: number,
  width: number,
  depth: number,
  positionX: number,
  positionY: number,
  positionZ: number
}

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
  worker !: any

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  font !: THREE.Font;

  applicationObject3D = new THREE.Object3D();

  animationFrameId = 0;

  interaction !: Interaction;

  modelIdToMesh: Map<string, THREE.Mesh> = new Map();
  commIdToMesh: Map<string, CommunicationMesh> = new Map();

  boxLayoutMap: Map<string, BoxLayout> = new Map();

  hoverHandler: HoverEffectHandler = new HoverEffectHandler();

  @tracked
  popupData: PopupData | null = null;

  //#region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug("Constructor called");

    this.render = this.render.bind(this);

    this.loadFont();
  }

  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug("Canvas inserted");

    this.canvas = canvas;

    canvas.oncontextmenu = function (e) {
      e.preventDefault();
    };
  }

  @action
  outerDivInserted(outerDiv: HTMLElement) {
    this.debug("Outer Div inserted");

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
      canvas: this.canvas
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
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseStop = this.handleMouseStop.bind(this);
    this.handlePanning = this.handlePanning.bind(this);

    this.interaction = new Interaction(this.canvas, this.camera, this.renderer, this.applicationObject3D, {
      singleClick: this.handleSingleClick,
      doubleClick: this.handleDoubleClick,
      mouseMove: this.handleMouseMove,
      mouseWheel: this.handleMouseWheel,
      mouseOut: this.handleMouseOut,
      mouseEnter: this.handleMouseEnter,
      mouseStop: this.handleMouseStop,
      panning: this.handlePanning
    });
  }

  loadFont() {
    new THREE.FontLoader().load(
      // resource URL
      '/three.js/fonts/roboto_mono_bold_typeface.json',

      // onLoad callback
      font => {
        if (this.isDestroyed)
          return;

        this.font = font;
        this.debug("(THREE.js) font sucessfully loaded.");
      }
    );
  }

  //#endregion COMPONENT AND SCENE INITIALIZATION


  //#region MOUSE EVENT HANDLER

  handleSingleClick(mesh: THREE.Mesh | undefined) {
    if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh || mesh instanceof CommunicationMesh) {
      this.highlight(mesh);
    }
  }

  handleDoubleClick(mesh: THREE.Mesh | undefined) {
    if (mesh instanceof ComponentMesh) {
      if (mesh.opened) {
        this.closeComponentMesh(mesh);
      } else {
        this.openComponentMesh(mesh);
      }
      this.addCommunication(this.args.application);
    } else if(mesh instanceof FoundationMesh) {
      this.closeAllComponents();
    }
  }

  handleMouseMove(mesh: THREE.Mesh | undefined) {
    let enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    if (mesh === undefined) {
      this.hoverHandler.handleHoverEffect(mesh);
    }

    if (mesh instanceof BoxMesh) {
      if (enableHoverEffects)
        this.hoverHandler.handleHoverEffect(mesh);
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

  handleMouseEnter() {
  }

  handleMouseStop(mesh: THREE.Mesh | undefined, mouseOnCanvas: Position2D) {
    if (mesh === undefined)
      return;

    if (mesh instanceof ClazzMesh || mesh instanceof ComponentMesh || mesh instanceof CommunicationMesh) {
      this.popupData = {
        mouseX: mouseOnCanvas.x,
        mouseY: mouseOnCanvas.y,
        entity: mesh.dataModel
      };
    }
  }

  handlePanning(delta: { x: number, y: number }, button: 1 | 2 | 3) {
    if (button === 3) {
      // rotate object
      this.applicationObject3D.rotation.x += delta.y / 100;
      this.applicationObject3D.rotation.y += delta.x / 100;
    }

    else if (button === 1) {
      // translate camera
      const distanceXInPercent = (delta.x / this.canvas.clientWidth) * 100.0;

      const distanceYInPercent = (delta.y / this.canvas.clientHeight) * 100.0;

      const xVal = this.camera.position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(this.camera.position.z) / 4.0);

      const yVal = this.camera.position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(this.camera.position.z) / 4.0);

      this.camera.position.x = xVal;
      this.camera.position.y = yVal;
    }
  }

  //#endregion MOUSE EVENT HANDLER


  //#region COMPONENT OPENING AND CLOSING

  closeAllComponents() {
    this.modelIdToMesh.forEach(mesh => {
      if(mesh instanceof ComponentMesh) {
        this.closeComponentMesh(mesh);
      }
    });
    this.addCommunication(this.args.application);
  }

  openComponentsRecursively(component: Component) {
    let components = component.children;
    components.forEach((child) => {
      let mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });
  }

  openComponentMesh(mesh: ComponentMesh) {
    if (mesh.opened)
      return;

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = HEIGHT_OPENED_COMPONENT;

    // Reset y coordinate
    mesh.position.y -= mesh.layoutHeight / 2;
    // Set y coordinate according to open component height
    mesh.position.y += HEIGHT_OPENED_COMPONENT / 2;

    mesh.opened = true;
    mesh.visible = true;
    mesh.positionLabel();

    let childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      let mesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (mesh) {
        mesh.visible = true;
      }
    });

    let clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      let mesh = this.modelIdToMesh.get(clazz.get('id'));
      if (mesh) {
        mesh.visible = true;
      }
    });
  }

  closeComponentMesh(mesh: ComponentMesh) {
    if (!mesh.opened)
      return;

    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.height = mesh.layoutHeight;

    // Reset y coordinate
    mesh.position.y -= HEIGHT_OPENED_COMPONENT / 2;
    // Set y coordinate according to closed component height
    mesh.position.y += mesh.layoutHeight / 2;

    mesh.opened = false;
    mesh.positionLabel();

    let childComponents = mesh.dataModel.get('children');
    childComponents.forEach((childComponent) => {
      let mesh = this.modelIdToMesh.get(childComponent.get('id'));
      if (mesh instanceof ComponentMesh) {
        mesh.visible = false;
        if (mesh.opened) {
          this.closeComponentMesh(mesh);
        }
        // Reset highlighting if highlighted entity is no longer visible
        if (mesh.highlighted) {
          this.removeHighlighting();
        }
      }
    });

    let clazzes = mesh.dataModel.get('clazzes');
    clazzes.forEach((clazz) => {
      let mesh = this.modelIdToMesh.get(clazz.get('id'));
      if (mesh instanceof ClazzMesh) {
        mesh.visible = false;
        // Reset highlighting if highlighted entity is no longer visible
        if (mesh.highlighted) {
          this.removeHighlighting();
        }
      }
    });
  }

  //#endregion COMPONENT OPENING AND CLOSING

  
  //#region COMPONENT AND CLAZZ HIGHLIGHTING

  highlight(mesh: ComponentMesh | ClazzMesh | CommunicationMesh): void {
    // Reset highlighting if highlighted mesh is clicked
    if (mesh.highlighted) {
      this.removeHighlighting();
      return;
    }

    // Reset highlighting
    this.removeHighlighting();
    let model = mesh.dataModel;

    // All clazzes in application
    let allClazzesAsArray = this.args.application.getAllClazzes();
    let allClazzes = new Set<Clazz>(allClazzesAsArray);

    // Highlight the entity itself
    mesh.highlight();

    // Get all clazzes in current component
    let containedClazzes = new Set<Clazz>();

    if (model instanceof Component)
      model.getContainedClazzes(containedClazzes);
    else if (model instanceof Clazz)
      containedClazzes.add(model);
    else
      return;

    let allInvolvedClazzes = new Set<Clazz>(containedClazzes);

    containedClazzes.forEach((clazz: Clazz) => {
      clazz.clazzCommunications.forEach(clazzCommunication => {
        allInvolvedClazzes.add(clazzCommunication.belongsTo('sourceClazz').value() as Clazz);
        allInvolvedClazzes.add(clazzCommunication.belongsTo('targetClazz').value() as Clazz);
      })
    });

    let nonInvolvedClazzes = new Set([...allClazzes].filter(x => !allInvolvedClazzes.has(x)));

    let componentSet = new Set<Component>();
    allInvolvedClazzes.forEach(clazz => {
      this.getAllAncestorComponents(clazz.getParent(), componentSet);
    });

    nonInvolvedClazzes.forEach(clazz => {
      let clazzMesh = this.modelIdToMesh.get(clazz.get('id'));
      let componentMesh = this.modelIdToMesh.get(clazz.parent.get('id'));
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh && componentMesh.opened) {
        clazzMesh.material.opacity = 0.3;
        clazzMesh.material.transparent = true;
      }
      this.turnComponentAndAncestorsTransparent(clazz.getParent(), componentSet);
    });
  }

  @action
  removeHighlighting() {
    let boxMeshes = Array.from(this.modelIdToMesh.values());
    let commMeshes = Array.from(this.commIdToMesh.values());
    let meshes = boxMeshes.concat(commMeshes);
    for (let mesh of meshes) {
      if (mesh instanceof BoxMesh || mesh instanceof CommunicationMesh) {
        mesh.unhighlight();
      }
    }
  }

  turnComponentAndAncestorsTransparent(component: Component, ignorableComponents: Set<Component>) {
    if (ignorableComponents.has(component))
      return;

    ignorableComponents.add(component);
    const parent = component.getParentComponent();

    let parentMesh = this.modelIdToMesh.get(component.get('id'));
    if (parentMesh instanceof ComponentMesh && parentMesh.opened) {
      parentMesh.turnTransparent(0.3);
    }
    this.turnComponentAndAncestorsTransparent(parent, ignorableComponents);
  }

  getAllAncestorComponents(component: Component, set: Set<Component>) {
    if (set.has(component))
      return;

    set.add(component);

    const parent = component.getParentComponent();
    if(parent === null) {
      return;
    }

    this.getAllAncestorComponents(parent, set);
  }

  //#endregion COMPONENT AND CLAZZ HIGHLIGHTING

  
  //#region SCENE POPULATION

  async populateScene() {
    let serializedApp = this.serializeApplication(this.args.application);

    try {
      let layoutedApplication: Map<string, BoxLayout> = await this.worker.postMessage('city-layouter', serializedApp);
      this.boxLayoutMap = layoutedApplication;
      // Foundation is created in step1(), so we can safely assume the foundationObj to be not null
      this.addFoundationToScene(this.args.application);
      this.addCommunication(this.args.application);
      this.addLabels();
  
      this.scene.add(this.applicationObject3D);
      this.resetRotation(this.applicationObject3D);
    } catch(e) {
      console.log(e)
    }
  }

  addFoundationToScene(application: Application) {
    let foundationData = this.boxLayoutMap.get(application.id);

    if(foundationData === undefined)
      return;

    const OPENED_COMPONENT_HEIGHT = 1.5;

    const {
      foundation: foundationColor,
      componentOdd: componentOddColor,
      highlightedEntity: highlightedEntityColor
    } = this.configuration.applicationColors;

    let layoutPos = new THREE.Vector3(foundationData.positionX, foundationData.positionY, foundationData.positionZ);

    let mesh = new FoundationMesh(layoutPos, OPENED_COMPONENT_HEIGHT, foundationData.width, foundationData.depth,
      application, new THREE.Color(foundationColor), new THREE.Color(highlightedEntityColor));
    this.addMeshToScene(mesh, foundationData, OPENED_COMPONENT_HEIGHT);

    const children = application.get('components');

    children.forEach((child: Component) => {
      this.addComponentToScene(child, componentOddColor);
    });

  }

  addComponentToScene(component: Component, color: string) {
    let componentData = this.boxLayoutMap.get(component.id);

    if(componentData === undefined)
      return;

    const { componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor } = this.configuration.applicationColors;

    let layoutPos = new THREE.Vector3(componentData.positionX, componentData.positionY, componentData.positionZ);

    let mesh = new ComponentMesh(layoutPos, componentData.height, componentData.width, componentData.depth,
      component, new THREE.Color(color), new THREE.Color(highlightedEntityColor));
    this.addMeshToScene(mesh, componentData, componentData.height);
    this.updateMeshVisiblity(mesh);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      let clazzData = this.boxLayoutMap.get(clazz.get('id'));

      if(clazzData === undefined)
        return;

      layoutPos = new THREE.Vector3(clazzData.positionX, clazzData.positionY, clazzData.positionZ)
      let mesh = new ClazzMesh(layoutPos, clazzData.height, clazzData.width, clazzData.depth,
        clazz, new THREE.Color(clazzColor), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(mesh, clazzData, clazzData.height);
      this.updateMeshVisiblity(mesh);
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
    let foundationData = this.boxLayoutMap.get(this.args.application.id);

    if(foundationData === undefined)
      return;

    let centerPoint = new THREE.Vector3(
      boxData.positionX + boxData.width / 2.0,
      boxData.positionY + height / 2.0,
      boxData.positionZ + boxData.depth / 2.0);

    let applicationCenter = CalcCenterAndZoom(foundationData);
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
    let parentMesh = this.modelIdToMesh.get(parent.get('id'));
    if (parentMesh instanceof ComponentMesh) {
      mesh.visible = parentMesh.opened;
    }
  }

  addCommunication(application: Application) {
    let foundationData = this.boxLayoutMap.get(this.args.application.id);

    if(foundationData === undefined)
      return;

    this.removeAllCommunication();

    let maybeCurveHeight = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCurvyCommHeight');
    let curveHeight = typeof maybeCurveHeight === "number" ? maybeCurveHeight : 0.0;
    let isCurved = curveHeight !== 0.0;

    let commLayoutMap = applyCommunicationLayout(application, this.boxLayoutMap, this.modelIdToMesh);
    const { communication: communicationColor, highlightedEntity: highlightedEntityColor, 
      communicationArrow: arrowColorString } = this.configuration.applicationColors;

    let drawableClazzCommunications = application.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((drawableClazzComm) => {
      let commLayout = commLayoutMap.get(drawableClazzComm.get('id'));

      // No layouting information available due to hidden communication
      if (!commLayout) {
        return;
      }

      let viewCenterPoint = CalcCenterAndZoom(foundationData);

      let pipe = new CommunicationMesh(commLayout, drawableClazzComm,
        new THREE.Color(communicationColor), new THREE.Color(highlightedEntityColor));

      pipe.render(viewCenterPoint, curveHeight);

      const ARROW_OFFSET = 0.8;
      let arrowHeight = isCurved ? curveHeight / 2 + ARROW_OFFSET : ARROW_OFFSET;
      let arrowThickness = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize');
      let arrowColor = new THREE.Color(arrowColorString).getHex();

      if (typeof arrowThickness === "number" && arrowThickness > 0.0)
        pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColor);

      this.applicationObject3D.add(pipe);
      this.commIdToMesh.set(drawableClazzComm.get('id'), pipe);
    });
  }

  addLabels(){
    if (!this.font)
      return;
    
    let clazzTextColor = this.configuration.applicationColors.clazzText;
    let componentTextColor = this.configuration.applicationColors.componentText;
    let foundationTextColor = this.configuration.applicationColors.foundationText;

    this.modelIdToMesh.forEach(mesh => {
      if (mesh instanceof ClazzMesh){
        mesh.createLabel(this.font, new THREE.Color(clazzTextColor));
      } else if (mesh instanceof ComponentMesh){
        mesh.createLabel(this.font, new THREE.Color(componentTextColor));
      } else if (mesh instanceof FoundationMesh){
        mesh.createLabel(this.font, new THREE.Color(foundationTextColor));
      }
    });
  }

  //#endregion SCENE POPULATION


  //#region RENDERING LOOP
  render() {
    if (this.isDestroyed)
      return;

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    this.renderer.render(this.scene, this.camera);
  }

  //#endregion RENDERING LOOP


  //#region ACTIONS

  @action
  openParents(entity: Component|Clazz) {
    if(entity instanceof Component) {
      let ancestors:Set<Component> = new Set();
      this.getAllAncestorComponents(entity, ancestors);
      ancestors.forEach(anc => {
        let ancestorMesh = this.modelIdToMesh.get(anc.get('id'));
        if(ancestorMesh instanceof ComponentMesh) {
          this.openComponentMesh(ancestorMesh);
        }
      });
    } else if(entity instanceof Clazz) {
      let ancestors:Set<Component> = new Set();
      this.getAllAncestorComponents(entity.getParent(), ancestors);
      ancestors.forEach(anc => {
        let ancestorMesh = this.modelIdToMesh.get(anc.get('id'));
        if(ancestorMesh instanceof ComponentMesh) {
          this.openComponentMesh(ancestorMesh);
        }
      });
    }
  }

  @action
  closeComponent(component: Component) {
    let mesh = this.modelIdToMesh.get(component.get('id'));
    if(mesh instanceof ComponentMesh) {
      this.closeComponentMesh(mesh);
    }
  }

  @action
  openAllComponents() {
    this.args.application.components.forEach((child) => {
      let mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
    });

    this.addCommunication(this.args.application);
  }

  @action
  highlightModel(entity: Component|Clazz) {
    let mesh = this.modelIdToMesh.get(entity.id);
    if(mesh instanceof ComponentMesh || mesh instanceof ClazzMesh) {
      mesh.highlight();
    }
  }

  @action
  unhighlightAll() {
    this.removeHighlighting();
  }

  @action
  resetView() {
    this.removeHighlighting();
    this.closeAllComponents();
    this.removeAllCommunication();
    this.camera.position.set(0, 0, 100);
    this.resetRotation(this.applicationObject3D);
  }

  @action
  resize(outerDiv: HTMLElement) {
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  //#endregion ACTIONS


  //#region COMPONENT AND SCENE CLEAN-UP

  willDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.cleanUpApplication();
    this.scene.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderingService.removeRendering(this.args.id);
    this.interaction.removeHandlers();

    this.debug("Cleaned up application rendering");
  }

  cleanUpApplication() {
    this.modelIdToMesh.forEach((mesh) => {
      if(mesh instanceof BaseMesh) {
        mesh.delete();
      }
    });
    this.modelIdToMesh.clear();
    this.removeAllCommunication();
  }

  cleanAndUpdateScene() {
    this.debug("cleanAndUpdateScene");

    this.cleanUpApplication();
    this.populateScene();
  }

  removeAllCommunication() {
    this.commIdToMesh.forEach(mesh => {
      mesh.delete();
    });
    this.commIdToMesh.clear();
  }

  //#endregion COMPONENT AND SCENE CLEAN-UP

  serializeApplication(application: Application) : SerializedApplication {
    let childComponents = application.get('components').toArray();
    let serializedComponents = childComponents.map(child => this.serializeComponent(child));
    return {
      id: application.get('id'),
      components: serializedComponents
    }
  }

  serializeComponent(component: Component) : SerializedComponent {
    let childComponents = component.get('children').toArray();
    let clazzes = component.get('clazzes').toArray();

    let serializedClazzes = clazzes.map(clazz => this.serializeClazz(clazz));
    let serializedComponents = childComponents.map(child => this.serializeComponent(child));

    return {
      id: component.get('id'),
      name: component.get('name'),
      clazzes: serializedClazzes,
      children: serializedComponents
    }
  }

  serializeClazz(clazz: Clazz) : SerializedClazz {
    return {
      id: clazz.get('id'),
      name: clazz.get('name'),
      instanceCount: clazz.get('instanceCount')
    }
  }
  
  //#region ADDITIONAL HELPER FUNCTIONS

  resetRotation(application: THREE.Object3D) {
    const ROTATION_X = 0.65;
    const ROTATION_Y = 0.80;

    application.rotation.x = ROTATION_X;
    application.rotation.y = ROTATION_Y;
  }

  //#endregion ADDITIONAL HELPER FUNCTIONS
}

export type SerializedClazz = {
  id: string,
  name: string,
  instanceCount: number
}

export type SerializedComponent = {
  id: string,
  name: string,
  clazzes: SerializedClazz[],
  children: SerializedComponent[]
}

export type SerializedApplication = {
  id: string,
  components: SerializedComponent[]
}