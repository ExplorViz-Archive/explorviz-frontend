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
import DS from "ember-data";
import Configuration from "explorviz-frontend/services/configuration";
import Clazz from "explorviz-frontend/models/clazz";
import CurrentUser from "explorviz-frontend/services/current-user";
import Component from "explorviz-frontend/models/component";

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

  debug = debugLogger('ApplicationRendering');

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  font !: THREE.Font;

  foundationBuilder = new FoundationBuilder();

  applicationObject3D = new THREE.Object3D();

  animationFrameId = 0;

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
    
    const renderingContext:RenderingContext = {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
    this.renderingService.addRendering(this.args.id, renderingContext, [this.step1, this.step2, this.step3]);
    this.renderingService.render(this.args.id, this.args.application);
  }

  @action
  step1() {
    this.foundationBuilder.createFoundation(this.args.application, this.store);
  }

  @action
  step2() {
    this.args.application.applyDefaultOpenLayout(false);
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

    this.createBox(component, color);

    const clazzes = component.get('clazzes');
    const children = component.get('children');

    if(component.get('opened')) {
      clazzes.forEach((clazz: Clazz) => {
        if(clazz.highlighted) {
          this.createBox(clazz, highlightedEntityColor);
        } else {
          this.createBox(clazz, clazzColor);
        }
      });

      children.forEach((child: Component) => {
        if(child.highlighted) {
          this.addComponentToScene(child, highlightedEntityColor);
        } else if(component.foundation) {
          this.addComponentToScene(child, componentOddColor);
        } else if(color === componentEvenColor) {
          this.addComponentToScene(child, componentOddColor);
        } else {
          this.addComponentToScene(child, componentEvenColor);
        }
      });
    }
  } // END addComponentToScene


  /**
   * Adds a Box to an application, therefore also computes color, size etc.
   * @method createBox
   * @param {emberModel} boxEntity Component or clazz
   * @param {string}     color     Color for box
   */
  createBox(boxEntity: any, color: string) {
    let centerPoint = new THREE.Vector3(boxEntity.get('positionX') +
      boxEntity.get('width') / 2.0, boxEntity.get('positionY') +
      boxEntity.get('height') / 2.0,
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
      boxEntity.get('height') / 2.0, boxEntity.get('depth') / 2.0);

    const cube = new THREE.BoxGeometry(extension.x, extension.y, extension.z);
    const mesh = new THREE.Mesh(cube, material);

    mesh.position.set(centerPoint.x, centerPoint.y, centerPoint.z);
    mesh.updateMatrix();

    mesh.userData.model = boxEntity;
    mesh.userData.name = boxEntity.get('name');
    mesh.userData.foundation = boxEntity.get('foundation');
    mesh.userData.opened = boxEntity.get('opened');

    this.applicationObject3D.add(mesh);
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
