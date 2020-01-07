import GlimmerComponent from "@glimmer/component";
import Application from "explorviz-frontend/models/application";
import { action } from "@ember/object";
import debugLogger from "ember-debug-logger";
import THREE from 'three';
import { inject as service } from '@ember/service';
import RenderingService, { RenderingContext } from "explorviz-frontend/services/rendering-service";
import LandscapeRepository from "explorviz-frontend/services/repos/landscape-repository";
import FoundationBuilder from 'explorviz-frontend/utils/application-rendering/foundation-builder';
import applyCityLayout from 'explorviz-frontend/utils/application-rendering/city-layouter';
import CalcCenterAndZoom from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import Interaction, { Position2D } from 'explorviz-frontend/utils/application-rendering/interaction';
import DS from "ember-data";
import Configuration from "explorviz-frontend/services/configuration";
import Clazz from "explorviz-frontend/models/clazz";
import CurrentUser from "explorviz-frontend/services/current-user";
import Component from "explorviz-frontend/models/component";
import { getOwner } from "@ember/application";
import Highlighter from "explorviz-frontend/services/visualization/application/highlighter";
import FoundationMesh from "explorviz-frontend/utils/3d/application/foundation-mesh";
import PopupHandler from "explorviz-frontend/utils/application-rendering/popup-handler";
import HoverEffectHandler from "explorviz-frontend/utils/hover-effect-handler";

interface Args {
  id: string,
  application: Application
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

  @service('visualization/application/highlighter')
  highlighter!: Highlighter;

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  font !: THREE.Font;

  foundationBuilder = new FoundationBuilder();

  applicationObject3D = new THREE.Object3D();

  animationFrameId = 0;

  interaction !: any;

  meshIdToModel: Map<number, Clazz | Component> = new Map();

  modelToMesh: Map<Clazz | Component, THREE.Mesh> = new Map();

  map: any;

  foundationData: any;

  hoverHandler: HoverEffectHandler = new HoverEffectHandler();
  popUpHandler: PopupHandler = new PopupHandler();

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
    this.canvas.height = outerDiv.clientHeight;
    this.canvas.width = outerDiv.clientWidth;
    this.canvas.style.width = "";
    this.canvas.style.height = "";

    this.initThreeJs();
    this.initInteraction();
    this.render();    

    const renderingContext: RenderingContext = {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
    this.renderingService.addRendering(this.args.id, renderingContext, [this.step1, this.step2, this.step3]);
    this.renderingService.render(this.args.id, this.args.application);
  }

  resetScene() {
    this.scene.remove(this.applicationObject3D);
    this.renderingService.render(this.args.id, this.args.application);
  }

  @action
  handleSingleClick(mesh: THREE.Mesh|undefined) {
    if (mesh === undefined) {
      // unhighlight all
    } else {
      const { id } = mesh;
      const model = this.meshIdToModel.get(id)
      console.log("Mesh height: " + mesh.scale.y);

      if (model instanceof Component && !model.get('foundation')) {
        this.highlight(model, mesh);
      }
      if (model instanceof Clazz) {
        this.highlight(model, mesh);
      }
    }
  }

  @action
  handleDoubleClick(mesh: THREE.Mesh|undefined) {
    if (mesh !== undefined) {
      const { id } = mesh;
      console.log("Clicked mesh ${id}")
      const model = this.meshIdToModel.get(id);
      if (model instanceof Component && !model.get('foundation')) {
        model.toggleProperty('opened');
        // Component shall be opened
        if (model.get('opened')) {
          this.openComponentMesh(mesh);
          model.get('clazzes').forEach(clazz => {
            clazz.threeJSModel.visible = true;
          })
          model.get('children').forEach(component => {
            component.threeJSModel.visible = true;
          })
          // Component shall be closed
        } else {
          this.closeComponentMesh(mesh, model);
          model.getAllClazzes().forEach(clazz => {
            clazz.threeJSModel.visible = false;
          })
          model.getAllComponents().forEach(component => {
            component.threeJSModel.visible = false;
            console.log("Component invisible: ${component.id}")
            if (!component.get('opened'))
              return;
            component.set('opened', false);
            this.closeComponentMesh(component.threeJSModel, component);
          })
        }
      }
    }
  }

  @action
  handleMouseMove(mesh: THREE.Mesh|undefined) {
    let enableHoverEffects = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects') as boolean;
    if(enableHoverEffects)
      this.hoverHandler.handleHoverEffect(mesh);

    this.popUpHandler.hideTooltip();
  }

  @action
  handleMouseWheel(delta: number) {
    this.popUpHandler.hideTooltip()
    this.camera.position.z += delta * 3.5;
  }

  @action
  handleMouseOut() {
    this.popUpHandler.enableTooltips = false;
    this.popUpHandler.hideTooltip();
  }

  @action
  handleMouseEnter() {
    this.popUpHandler.enableTooltips = true;
  }

  @action
  handleMouseStop(mesh: THREE.Mesh|undefined, mouseOnCanvas: Position2D) {
    if(mesh === undefined)
      return;

    this.popUpHandler.showTooltip(
      mouseOnCanvas,
      this.meshIdToModel.get(mesh.id)
    );
  }

  @action
  handlePanning(delta: {x:number,y:number}, button: 1|2|3) {
    if(button === 3) {
      // rotate object
      this.applicationObject3D.rotation.x += delta.y / 100;
      this.applicationObject3D.rotation.y += delta.x / 100;
    }

    else if(button === 1){
      // translate camera
      const distanceXInPercent = (delta.x / this.canvas.clientWidth) * 100.0;

      const distanceYInPercent = (delta.y / this.canvas.clientHeight) * 100.0;

      const xVal = this.camera.position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(this.camera.position.z) / 4.0);

      const yVal = this.camera.position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(this.camera.position.z) / 4.0);

      this.camera.position.x = xVal;
      this.camera.position.y = yVal;
    }
  }

  openComponentMesh(mesh: THREE.Mesh) {
    const HEIGHT_OPENED_COMPONENT = 1.5;

    let model = this.meshIdToModel.get(mesh.id);
    if (model === undefined)
      return;

    let meshHeight = mesh.scale.y;
    mesh.position.y = mesh.position.y + HEIGHT_OPENED_COMPONENT / 2 - meshHeight / 2;
    mesh.scale.y = HEIGHT_OPENED_COMPONENT;
  }

  closeComponentMesh(mesh: THREE.Mesh, model: Component) {
    const HEIGHT_OPENED_COMPONENT = 1.5;
    mesh.scale.y = this.map.get(model.id).height;
    mesh.position.y += this.map.get(model.id).height / 2 - HEIGHT_OPENED_COMPONENT / 2;
  }

  highlight(clazz: Clazz, mesh: THREE.Mesh): void
  highlight(component: Component, mesh: THREE.Mesh): void
  highlight(entity: Component | Clazz, mesh: THREE.Mesh): void {
    if (entity.highlighted) {
      // Reset entire application highlighting
      entity.unhighlight();
      const material = mesh.material as THREE.MeshLambertMaterial;
      material.color = new THREE.Color(this.configuration.applicationColors.clazz);
      return;
    }
    // get all clazzes
    let foundation = this.foundationBuilder.foundationObj;
    if (foundation === null)
      return;

    // All clazzes in application
    let allClazzes = new Set<Clazz>();
    foundation.getContainedClazzes(allClazzes);

    // Highlight the entity itself
    entity.highlight();
    const material = mesh.material as THREE.MeshLambertMaterial;
    material.color = new THREE.Color(this.configuration.applicationColors.highlightedEntity);

    // Get all clazzes in current component
    let containedClazzes = new Set<Clazz>();

    if (entity instanceof Component)
      entity.getContainedClazzes(containedClazzes);
    else
      containedClazzes.add(entity)

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
      if (clazz.getParent().get('opened')) {
        (clazz.get('threeJSModel').material as THREE.MeshLambertMaterial).opacity = 0.3;
        (clazz.get('threeJSModel').material as THREE.MeshLambertMaterial).transparent = true;
      }
      this.turnComponentAndAncestorsTransparent(clazz.getParent(), componentSet);
    });
  }

  turnComponentAndAncestorsTransparent(component: Component, ignorableComponents: Set<Component>) {
    if (ignorableComponents.has(component) || component.get('foundation'))
      return;

    ignorableComponents.add(component);
    const parent = component.getParentComponent();
    if (parent.get('opened')) {
      (component.get('threeJSModel').material as THREE.MeshLambertMaterial).opacity = 0.3;
      (component.get('threeJSModel').material as THREE.MeshLambertMaterial).transparent = true;
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
    let map = applyCityLayout(this.args.application);
    this.map = map;
  }

  @action
  step3() {
    const foundationColor = this.configuration.applicationColors.foundation;
    // Foundation is created in step1(), so we can safely assume the foundationObj to be not null
    this.addComponentToScene(this.foundationBuilder.foundationObj as Component, foundationColor);

    this.scene.add(this.applicationObject3D);
    this.resetRotation();
  }

  addComponentToScene(component: Component, color: string) {

    const OPENED_COMPONENT_HEIGHT = 1.5;

    const { componentOdd: componentOddColor, componentEven: componentEvenColor,
      clazz: clazzColor, highlightedEntity: highlightedEntityColor } = this.configuration.applicationColors;

    let mesh;
    if (component.get('foundation')) {
      let componentData = this.map.get(component.id);
      this.foundationData = componentData;

      mesh = new FoundationMesh(component, color, OPENED_COMPONENT_HEIGHT, componentData.width, componentData.depth, false);
      let centerPoint = new THREE.Vector3(
        componentData.positionX + componentData.width / 2.0,
        componentData.positionY + OPENED_COMPONENT_HEIGHT / 2.0,
        componentData.positionZ + componentData.depth / 2.0);

      centerPoint.sub(CalcCenterAndZoom(this.foundationData));
      centerPoint.x *= 0.5;
      centerPoint.z *= 0.5;

      mesh.position.set(centerPoint.x, centerPoint.y, centerPoint.z);

      mesh.updateMatrix();
      this.applicationObject3D.add(mesh);
      this.meshIdToModel.set(mesh.id, component);
    } else {
      let height = component.get('opened') ? OPENED_COMPONENT_HEIGHT : this.map.get(component.id).height;
      mesh = this.createBox(component, color, height);
    }
    component.set('threeJSModel', mesh);
    if (!component.foundation && !component.getParentComponent().opened)
      mesh.visible = false;

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      let height = this.map.get(clazz.id).height;
      if (clazz.highlighted) {
        const mesh = this.createBox(clazz, highlightedEntityColor, height);
        clazz.set('threeJSModel', mesh);
        if (!clazz.getParent().opened)
          mesh.visible = false;
      } else {
        const mesh = this.createBox(clazz, clazzColor, height);
        clazz.set('threeJSModel', mesh);
        if (!clazz.getParent().opened)
          mesh.visible = false;
      }
    });

    children.forEach((child: Component) => {
      if (child.highlighted) {
        this.addComponentToScene(child, highlightedEntityColor);
      } else if (component.get('foundation')) {
        this.addComponentToScene(child, componentOddColor);
      } else if (color === componentEvenColor) {
        this.addComponentToScene(child, componentOddColor);
      } else {
        this.addComponentToScene(child, componentEvenColor);
      }
    });
  } // END addComponentToScene

  static calculateCenter(componentData: any) {
    let centerPoint = new THREE.Vector3(
      componentData.positionX + componentData.width / 2.0,
      componentData.positionY + componentData.height / 2.0,
      componentData.positionZ + componentData.depth / 2.0);

    centerPoint.sub(CalcCenterAndZoom(componentData));
    centerPoint.multiplyScalar(0.5);
    return centerPoint;
  }


  /**
   * Adds a Box to an application, therefore also computes color, size etc.
   * @method createBox
   * @param {emberModel} boxEntity Component or clazz
   * @param {string}     color     Color for box
   */
  createBox(boxEntity: any, color: string, height: number) {
    let data = this.map.get(boxEntity.id);

    let centerPoint = new THREE.Vector3(
      data.positionX + data.width / 2.0,
      data.positionY + height / 2.0,
      data.positionZ + data.depth / 2.0);

    let transparent = false;
    let opacityValue = 1.0;

    if (boxEntity.get('state') === "TRANSPARENT") {
      transparent = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'appVizTransparency') as boolean | undefined || transparent;
      opacityValue = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizTransparencyIntensity') as number | undefined || opacityValue;
    }

    const material = new THREE.MeshLambertMaterial({
      opacity: opacityValue,
      transparent: transparent
    });

    material.color = new THREE.Color(color);

    centerPoint.sub(CalcCenterAndZoom(this.foundationData));
    centerPoint.x *= 0.5;
    centerPoint.z *= 0.5;

    const extension = new THREE.Vector3(data.width / 2.0,
      height, data.depth / 2.0);

    const cube = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(cube, material);
    mesh.scale.x = extension.x;
    mesh.scale.y = extension.y;
    mesh.scale.z = extension.z;

    mesh.position.set(centerPoint.x, centerPoint.y, centerPoint.z);
    mesh.updateMatrix();

    this.applicationObject3D.add(mesh);
    this.meshIdToModel.set(mesh.id, boxEntity);
    return mesh;
  } // END createBox


  resetRotation() {
    const rotationX = 0.65;
    const rotationY = 0.80;

    this.applicationObject3D.rotation.x = rotationX;
    this.applicationObject3D.rotation.y = rotationY;
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
    this.scene.background = new THREE.Color('#DDD');
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
    this.renderingService.removeRendering(this.args.id);
    this.foundationBuilder.removeFoundation(this.store);
  }
}
