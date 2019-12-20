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
import Interaction from 'explorviz-frontend/utils/application-rendering/interaction';
import DS from "ember-data";
import Configuration from "explorviz-frontend/services/configuration";
import Clazz from "explorviz-frontend/models/clazz";
import CurrentUser from "explorviz-frontend/services/current-user";
import Component from "explorviz-frontend/models/component";
import { getOwner } from "@ember/application";
import Highlighter from "explorviz-frontend/services/visualization/application/highlighter";

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

  meshIdToModel:Map<number, Clazz|Component> = new Map();

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
    
    this.interaction = Interaction.create(getOwner(this).ownerInjection());
    this.interaction.setupInteraction(this.canvas, this.camera, this.renderer, this.applicationObject3D);
    this.interaction.on('singleClick', this.handleSingleClick);
    this.interaction.on('doubleClick', this.handleDoubleClick);

    const renderingContext:RenderingContext = {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
    this.renderingService.addRendering(this.args.id, renderingContext, [this.step1, this.step2, this.step3]);
    this.renderingService.render(this.args.id, this.args.application);
  }

  resetScene() {
    this.scene.children = [];
    this.initLights();
    this.renderingService.render(this.args.id, this.args.application);
  }

  @action
  handleSingleClick(mesh: THREE.Mesh|undefined) {
    if(mesh === undefined) {
      // unhighlight all
    } else {
      const { id } = mesh;
      const model = this.meshIdToModel.get(id)

      if(model instanceof Component && !model.get('foundation')) {
        this.highlight(model, mesh);
      }
      if(model instanceof Clazz) {
        this.highlight(model, mesh);
      }
    }
  }

  @action
  handleDoubleClick(mesh: THREE.Mesh|undefined) {
    if(mesh !== undefined) {
      const { id } = mesh;
      const model = this.meshIdToModel.get(id)
      if(model instanceof Component){
        model.toggleProperty('opened');
        if(model.get('opened')) {
          this.openComponentMesh(mesh, model);
          model.get('clazzes').forEach(clazz => {
            clazz.threeJSModel.visible = true;
          })
          model.get('children').forEach(component => {
            component.threeJSModel.visible = true;
          })
        } else {
          this.closeComponentMesh(mesh, model);
          model.getAllClazzes().forEach(clazz => {
            clazz.threeJSModel.visible = false;
          })
          model.getAllComponents().forEach(component => {
            component.threeJSModel.visible = false;
            if(!component.get('opened'))
              return;
            component.set('opened', false);
            this.closeComponentMesh(component.threeJSModel, component);
          })
        }
      }
    }
  }

  openComponentMesh(mesh: THREE.Mesh, model: Component) {
    const geometry = mesh.geometry as THREE.BoxGeometry;
    geometry.scale(1, 1.5/model.get('height'), 1);
    mesh.position.y = mesh.position.y - model.get('height')/2 + 1.5/2;
  }

  closeComponentMesh(mesh: THREE.Mesh, model: Component) {
    const geometry = mesh.geometry as THREE.BoxGeometry;
    geometry.scale(1, model.get('height')/1.5, 1);
    mesh.position.y = mesh.position.y + model.get('height')/2 - 1.5/2;
  }

  highlight(clazz: Clazz, mesh: THREE.Mesh): void
  highlight(component: Component, mesh: THREE.Mesh): void
  highlight(entity: Component|Clazz, mesh: THREE.Mesh): void {
    if(entity.highlighted) {
      // reset entire application highlighting
      entity.unhighlight();
      const material = mesh.material as THREE.MeshLambertMaterial;
      material.color = new THREE.Color(this.configuration.applicationColors.clazz);
      return;
    }
    // get all clazzes
    let foundation = this.foundationBuilder.foundationObj;
    if(foundation === null)
      return;

    // all clazzes in application
    let allClazzes = new Set<Clazz>();
    foundation.getContainedClazzes(allClazzes);

    // highlight the entity itself
    entity.highlight();
    const material = mesh.material as THREE.MeshLambertMaterial;
    material.color = new THREE.Color(this.configuration.applicationColors.highlightedEntity);

    // get all clazzes in current component
    let containedClazzes = new Set<Clazz>();

    if(entity instanceof Component)
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
      if(clazz.getParent().get('opened')) {
        (clazz.get('threeJSModel').material as THREE.MeshLambertMaterial).opacity = 0.3;
        (clazz.get('threeJSModel').material as THREE.MeshLambertMaterial).transparent = true;
      }
      this.turnComponentAndAncestorsTransparent(clazz.getParent(), componentSet);
    });
  }

  turnComponentAndAncestorsTransparent(component: Component, ignorableComponents: Set<Component>) {
    if(ignorableComponents.has(component) || component.get('foundation'))
      return;

    ignorableComponents.add(component);
    const parent = component.getParentComponent();
    if(parent.get('opened')) {
      (component.get('threeJSModel').material as THREE.MeshLambertMaterial).opacity = 0.3;
      (component.get('threeJSModel').material as THREE.MeshLambertMaterial).transparent = true;
    }
    this.turnComponentAndAncestorsTransparent(parent, ignorableComponents);
  }

  getAllAncestorComponents(component: Component, set: Set<Component>) {
    if(component.get('foundation') || set.has(component))
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
    applyCityLayout(this.args.application);
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

    const { componentOdd:componentOddColor, componentEven:componentEvenColor,
      clazz:clazzColor, highlightedEntity:highlightedEntityColor } = this.configuration.applicationColors;

    const mesh = this.createBox(component, color);
    component.set('threeJSModel', mesh);
    if(!component.foundation && !component.getParentComponent().opened)
      mesh.visible = false;

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    clazzes.forEach((clazz: Clazz) => {
      if(clazz.highlighted) {
        const mesh = this.createBox(clazz, highlightedEntityColor);
        clazz.set('threeJSModel', mesh);
        if(!clazz.getParent().opened)
          mesh.visible = false;
      } else {
        const mesh = this.createBox(clazz, clazzColor);
        clazz.set('threeJSModel', mesh);
        if(!clazz.getParent().opened)
          mesh.visible = false;
      }
    });

    children.forEach((child: Component) => {
      if(child.highlighted) {
        this.addComponentToScene(child, highlightedEntityColor);
      } else if(component.get('foundation')) {
        this.addComponentToScene(child, componentOddColor);
      } else if(color === componentEvenColor) {
        this.addComponentToScene(child, componentOddColor);
      } else {
        this.addComponentToScene(child, componentEvenColor);
      }
    });
  } // END addComponentToScene


  /**
   * Adds a Box to an application, therefore also computes color, size etc.
   * @method createBox
   * @param {emberModel} boxEntity Component or clazz
   * @param {string}     color     Color for box
   */
  createBox(boxEntity: any, color: string) {
    let boxHeight = boxEntity.get('height');

    if(boxEntity instanceof Component && boxEntity.get('opened')) {
      boxHeight = 3;
    }
    let centerPoint = new THREE.Vector3(boxEntity.get('positionX') +
      boxEntity.get('width') / 2.0, boxEntity.get('positionY') +
      boxHeight / 2.0,
      boxEntity.get('positionZ') + boxEntity.get('depth') / 2.0);

    let transparent = false;
    let opacityValue = 1.0;

    if (boxEntity.get('state') === "TRANSPARENT") {
      transparent = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'appVizTransparency') as boolean|undefined || transparent;
      opacityValue = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizTransparencyIntensity') as number|undefined || opacityValue;
    }

    const material = new THREE.MeshLambertMaterial({
      opacity: opacityValue,
      transparent: transparent
    });

    material.color = new THREE.Color(color);

    centerPoint.sub(CalcCenterAndZoom(this.args.application));
    centerPoint.multiplyScalar(0.5);

    const extension = new THREE.Vector3(boxEntity.get('width') / 2.0,
    boxHeight / 2, boxEntity.get('depth') / 2.0);

    const cube = new THREE.BoxGeometry(extension.x, extension.y, extension.z);
    const mesh = new THREE.Mesh(cube, material);

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

  }

  // Rendering loop //
  @action
  render() {
    if(this.isDestroyed)
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
