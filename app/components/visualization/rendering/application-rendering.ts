import GlimmerComponent from "@glimmer/component";
import Application from "explorviz-frontend/models/application";
import { action } from "@ember/object";
import debugLogger from "ember-debug-logger";
import THREE from 'three';
import { inject as service } from '@ember/service';
import RenderingService, { RenderingContext } from "explorviz-frontend/services/rendering-service";
import LandscapeRepository from "explorviz-frontend/services/repos/landscape-repository";
import FoundationBuilder from 'explorviz-frontend/utils/application-rendering/foundation-builder';
import { applyBoxLayout, applyCommunicationLayout } from 'explorviz-frontend/utils/application-rendering/city-layouter';
import CalcCenterAndZoom from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import Interaction, { Position2D } from 'explorviz-frontend/utils/application-rendering/interaction';
import DS from "ember-data";
import Configuration from "explorviz-frontend/services/configuration";
import Clazz from "explorviz-frontend/models/clazz";
import CurrentUser from "explorviz-frontend/services/current-user";
import Component from "explorviz-frontend/models/component";
import FoundationMesh from "explorviz-frontend/view-objects/3d/application/foundation-mesh";
import HoverEffectHandler from "explorviz-frontend/utils/hover-effect-handler";
import ClazzMesh from "explorviz-frontend/view-objects/3d/application/clazz-mesh";
import ComponentMesh from "explorviz-frontend/view-objects/3d/application/component-mesh";
import EntityMesh from "explorviz-frontend/view-objects/3d/entity-mesh";
import CommunicationMesh from "explorviz-frontend/view-objects/3d/communication-mesh";
import DrawableClazzCommunication from "explorviz-frontend/models/drawableclazzcommunication";
import { tracked } from "@glimmer/tracking";

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

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  font !: THREE.Font;

  foundationBuilder = new FoundationBuilder();

  applicationObject3D = new THREE.Object3D();

  animationFrameId = 0;

  interaction !: Interaction;

  modelIdToMesh: Map<string, THREE.Mesh> = new Map();
  commIdToMesh: Map<string, CommunicationMesh> = new Map();

  boxLayoutMap: any;

  foundationData: any;

  hoverHandler: HoverEffectHandler = new HoverEffectHandler();

  @tracked
  popupData: PopupData | null = null;

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug("Constructor called");
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

    const renderingContext: RenderingContext = {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
    this.renderingService.addRendering(this.args.id, renderingContext, [this.step1, this.step2, this.step3]);
    this.renderingService.render(this.args.id, this.args.application);
  }

  @action
  resize(outerDiv: HTMLElement) {
    const width = Number(outerDiv.clientWidth);
    const height = Number(outerDiv.clientHeight);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  resetScene() {
    this.scene.remove(this.applicationObject3D);
    this.renderingService.render(this.args.id, this.args.application);
  }

  @action
  handleSingleClick(mesh: THREE.Mesh | undefined) {
    if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh || mesh instanceof CommunicationMesh) {
      this.highlight(mesh);
    }
  }

  @action
  handleDoubleClick(mesh: THREE.Mesh | undefined) {
    if (mesh instanceof ComponentMesh) {
      if (mesh.opened) {
        this.closeComponentMesh(mesh);
      } else {
        this.openComponentMesh(mesh);
      }
      const curveHeight = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCurvyCommHeight');
      if (typeof curveHeight === "number") {
        this.addCommunication(this.args.application);
      } else {
        this.addCommunication(this.args.application);
      }
    }
  }

  @action
  handleMouseMove(mesh: THREE.Mesh | undefined) {
    let enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;

    if (mesh === undefined) {
      this.hoverHandler.handleHoverEffect(mesh);
    }

    if (mesh instanceof EntityMesh) {
      if (enableHoverEffects)
        this.hoverHandler.handleHoverEffect(mesh);
    }

    this.popupData = null;
  }

  @action
  handleMouseWheel(delta: number) {
    this.popupData = null;
    this.camera.position.z += delta * 3.5;
  }

  @action
  handleMouseOut() {
    this.popupData = null;
  }

  @action
  handleMouseEnter() {
  }

  @action
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

  @action
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

  @action
  openAllComponents() {
    let foundation = this.foundationBuilder.foundationObj;
    if (foundation === null)
      return;

    foundation.children.forEach((child) => {
      let mesh = this.modelIdToMesh.get(child.get('id'));
      if (mesh !== undefined && mesh instanceof ComponentMesh) {
        this.openComponentMesh(mesh);
      }
      this.openComponentsRecursively(child);
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
          this.unhighlightAll();
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
          this.unhighlightAll();
        }
      }
    });
  }

  highlight(mesh: ComponentMesh | ClazzMesh | CommunicationMesh): void {
    // Reset highlighting if highlighted mesh is clicked
    if (mesh.highlighted) {
      this.unhighlightAll();
      return;
    }

    // Reset highlighting
    this.unhighlightAll();
    let model = mesh.dataModel;

    let foundation = this.foundationBuilder.foundationObj;
    if (foundation === null)
      return;

    // All clazzes in application
    let allClazzes = new Set<Clazz>();
    foundation.getContainedClazzes(allClazzes);

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

  unhighlightAll() {
    let boxMeshes = Array.from(this.modelIdToMesh.values());
    let commMeshes = Array.from(this.commIdToMesh.values());
    let meshes = boxMeshes.concat(commMeshes);
    for (let mesh of meshes) {
      if (mesh instanceof EntityMesh || mesh instanceof CommunicationMesh) {
        mesh.unhighlight();
      }
    }
  }

  turnComponentAndAncestorsTransparent(component: Component, ignorableComponents: Set<Component>) {
    if (ignorableComponents.has(component) || component.get('foundation'))
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
    if (component.get('foundation') || set.has(component))
      return;

    set.add(component);

    const parent = component.getParentComponent();
    this.getAllAncestorComponents(parent, set);
  }

  @action
  step1() {
    this.foundationBuilder.createFoundation(this.args.application, this.store);
  }

  @action
  step2() {
    // this.args.application.applyDefaultOpenLayout(false);
    this.boxLayoutMap = applyBoxLayout(this.args.application);
  }

  @action
  step3() {
    const foundationColor = this.configuration.applicationColors.foundation;
    // Foundation is created in step1(), so we can safely assume the foundationObj to be not null
    this.addComponentToScene(this.foundationBuilder.foundationObj as Component, foundationColor);
    this.addCommunication(this.args.application);

    this.scene.add(this.applicationObject3D);
    this.resetRotation(this.applicationObject3D);
  }

  addComponentToScene(component: Component, color: string) {

    const OPENED_COMPONENT_HEIGHT = 1.5;

    const { foundation: foundationColor, componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor } = this.configuration.applicationColors;

    let mesh;
    let componentData = this.boxLayoutMap.get(component.id);
    let layoutPos = new THREE.Vector3(componentData.positionX, componentData.positionY, componentData.positionZ);

    if (component.get('foundation')) {
      this.foundationData = componentData;

      mesh = new FoundationMesh(layoutPos, OPENED_COMPONENT_HEIGHT, componentData.width, componentData.depth,
        component, new THREE.Color(foundationColor), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(mesh, componentData, OPENED_COMPONENT_HEIGHT);

      // Regular component
    } else {
      mesh = new ComponentMesh(layoutPos, componentData.height, componentData.width, componentData.depth,
        component, new THREE.Color(color), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(mesh, componentData, componentData.height);
      this.updateMeshVisiblity(mesh);
    }

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      let clazzData = this.boxLayoutMap.get(clazz.get('id'));
      layoutPos = new THREE.Vector3(clazzData.positionX, clazzData.positionY, clazzData.positionZ)
      mesh = new ClazzMesh(layoutPos, clazzData.height, clazzData.width, clazzData.depth,
        clazz, new THREE.Color(clazzColor), new THREE.Color(highlightedEntityColor));
      this.addMeshToScene(mesh, clazzData, clazzData.height);
      this.updateMeshVisiblity(mesh);
    });

    children.forEach((child: Component) => {
      if (component.get('foundation')) {
        this.addComponentToScene(child, componentOddColor);
      } else if (color === componentEvenColor) {
        this.addComponentToScene(child, componentOddColor);
      } else {
        this.addComponentToScene(child, componentEvenColor);
      }
    });
  } // END addComponentToScene


  addMeshToScene(mesh: ComponentMesh | ClazzMesh | FoundationMesh, boxData: any, height: number) {
    let centerPoint = new THREE.Vector3(
      boxData.positionX + boxData.width / 2.0,
      boxData.positionY + height / 2.0,
      boxData.positionZ + boxData.depth / 2.0);

    let applicationCenter = CalcCenterAndZoom(this.foundationData);
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

      let viewCenterPoint = CalcCenterAndZoom(this.foundationData);

      let pipe = new CommunicationMesh(commLayout, drawableClazzComm,
        new THREE.Color(communicationColor), new THREE.Color(highlightedEntityColor));

      pipe.render(viewCenterPoint, curveHeight);

      let arrowHeight = isCurved ? curveHeight / 2 + 1 : 0.8;
      let arrowThickness = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize');
      let arrowColor = new THREE.Color(arrowColorString).getHex();

      if (typeof arrowThickness === "number")
        pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColor);

      this.applicationObject3D.add(pipe);
      this.commIdToMesh.set(drawableClazzComm.get('id'), pipe);
    });
  }


  removeAllCommunication() {
    this.commIdToMesh.forEach(mesh => {
      mesh.delete();
    });
    this.commIdToMesh.clear();
  }

  resetRotation(application: THREE.Object3D) {
    const ROTATION_X = 0.65;
    const ROTATION_Y = 0.80;

    application.rotation.x = ROTATION_X;
    application.rotation.y = ROTATION_Y;
  }

  initThreeJs() {
    this.loadFont();

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

  // Rendering loop //
  @action
  render() {
    if (this.isDestroyed)
      return;

    const animationId = requestAnimationFrame(this.render);
    this.animationFrameId = animationId;

    this.renderer.render(this.scene, this.camera);
  }

  @action
  cleanAndUpdateScene() {
    this.debug("cleanAndUpdateScene");
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

  willDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.cleanUpObject3D(this.scene);
    this.scene.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderingService.removeRendering(this.args.id);
    this.foundationBuilder.removeFoundation(this.store);
    this.interaction.removeHandlers();

    this.debug("Cleaned up application rendering");
  }

  cleanUpObject3D(obj: THREE.Object3D) {
    obj.children.forEach((object: THREE.Object3D) => {
      this.cleanUpObject3D(object);
      if (object instanceof THREE.Mesh) {
        this.disposeMesh(object);
      }
    });
  }

  disposeMesh(mesh: THREE.Mesh) {
    mesh.geometry.dispose();
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose();
    } else {
      mesh.material.forEach(material => {
        material.dispose();
      });
    }
  }

  disposeApplicationMeshes() {
    this.modelIdToMesh.forEach(mesh => {
      this.disposeMesh(mesh);
    });
    this.commIdToMesh.forEach(mesh => {
      this.disposeMesh(mesh);
    });
  }
}
