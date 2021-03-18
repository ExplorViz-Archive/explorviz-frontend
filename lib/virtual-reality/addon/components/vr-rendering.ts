import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import { LandscapeData } from 'explorviz-frontend/controllers/visualization';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';
import LocalVrUser from 'explorviz-frontend/services/local-vr-user';
import AppCommunicationRendering from 'explorviz-frontend/utils/application-rendering/communication-rendering';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import Interaction from 'explorviz-frontend/utils/interaction';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import HintMenu from 'explorviz-frontend/utils/vr-menus/hint-menu';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import THREE from 'three';
import DeltaTimeService from 'virtual-reality/services/delta-time';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import FloorMesh from 'virtual-reality/utils/view-objects/vr/floor-mesh';
import VRController from 'virtual-reality/utils/vr-controller';
import VRControllerBindings from 'virtual-reality/utils/vr-controller/vr-controller-bindings';
import VRControllerBindingsList from 'virtual-reality/utils/vr-controller/vr-controller-bindings-list';
import VRControllerButtonBinding from 'virtual-reality/utils/vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding, { VRControllerThumbpadDirection } from 'virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding';
import { EntityMesh, isEntityMesh } from 'virtual-reality/utils/vr-helpers/detail-info-composer';
import BaseMenu from 'virtual-reality/utils/vr-menus/base-menu';
import MenuGroup from 'virtual-reality/utils/vr-menus/menu-group';
import MenuQueue from 'virtual-reality/utils/vr-menus/menu-queue';
import CameraMenu from 'virtual-reality/utils/vr-menus/ui-menu/camera-menu';
import DetailInfoMenu from 'virtual-reality/utils/vr-menus/ui-menu/detail-info-menu';
import MainMenu from 'virtual-reality/utils/vr-menus/ui-menu/main-menu';
import ResetMenu from 'virtual-reality/utils/vr-menus/ui-menu/reset-menu';
import SettingsMenu from 'virtual-reality/utils/vr-menus/ui-menu/settings-menu';
import ZoomMenu from 'virtual-reality/utils/vr-menus/ui-menu/zoom-menu';
import { APPLICATION_ENTITY_TYPE, CLASS_COMMUNICATION_ENTITY_TYPE, CLASS_ENTITY_TYPE, COMPONENT_ENTITY_TYPE, EntityType, NODE_ENTITY_TYPE } from 'virtual-reality/utils/vr-message/util/entity_type';
import VrApplicationRenderer from 'virtual-reality/utils/vr-rendering/vr-application-renderer';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import WebXRPolyfill from 'webxr-polyfill';

interface Args {
  readonly id: string;
  readonly landscapeData: LandscapeData;
  readonly font: THREE.Font;
}

export default class VrRendering extends Component<Args> {
  // #region CLASS FIELDS AND GETTERS

  @service('configuration')
  configuration!: Configuration;

  @service('current-user')
  currentUser!: CurrentUser;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  deltaTimeService!: DeltaTimeService;

  @service()
  worker!: any;

  debug = debugLogger('VrRendering');

  // Used to register (mouse) events
  interaction!: Interaction;

  canvas!: HTMLCanvasElement;

  scene!: THREE.Scene;

  camera!: THREE.PerspectiveCamera;

  messageMenuQueue!: MenuQueue;
  hintMenuQueue!: MenuQueue;

  renderer!: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster;

  floor!: FloorMesh;

  detachedMenus!: THREE.Group;

  closeButtonTexture: THREE.Texture;

  readonly vrLandscapeRenderer: VrLandscapeRenderer;

  readonly vrApplicationRenderer: VrApplicationRenderer;

  // #endregion CLASS FIELDS AND GETTERS

  // #region COMPONENT AND SCENE INITIALIZATION

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.debug('Constructor called');

    this.raycaster = new THREE.Raycaster();
    this.detachedMenus = new THREE.Group();

    // Load image for delete button
    this.closeButtonTexture = new THREE.TextureLoader().load('images/x_white_transp.png');

    this.vrLandscapeRenderer = new VrLandscapeRenderer({
      configuration: this.configuration,
      floor: this.floor,
      font: this.args.font,
      landscapeData: this.args.landscapeData,
      worker: this.worker
    });
    this.vrApplicationRenderer = new VrApplicationRenderer({
      appCommRendering: new AppCommunicationRendering(this.configuration, this.currentUser),
      closeButtonTexture: this.closeButtonTexture,
      configuration: this.configuration,
      font: this.args.font,
      landscapeData: this.args.landscapeData,
      onRemoveApplication: (application) => this.removeApplication(application),
      worker: this.worker,
    });
  }

  get landscapeObject3D(): LandscapeObject3D {
    return this.vrLandscapeRenderer.landscapeObject3D;
  }

  get applicationGroup(): ApplicationGroup {
    return this.vrApplicationRenderer.applicationGroup;
  }

  /**
    * Calls all init functions.
    */
  initRendering() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initInteraction();
    this.initControllers();
    this.initCameraMenuQueues();
  }

  /**
     * Creates a scene, its background and adds a landscapeObject3D to it
     */
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.background;
    this.scene.add(this.landscapeObject3D);

    const floorSize = 10;
    const floorMesh = new FloorMesh(floorSize, floorSize);
    this.floor = floorMesh;

    this.scene.add(floorMesh);
    this.scene.add(this.applicationGroup);
    this.scene.add(this.localUser.userGroup);
    this.scene.add(this.detachedMenus);

    this.debug('Scene created');
  }

  /**
     * Creates a PerspectiveCamera according to canvas size and sets its initial position
     */
  initCamera() {
    const { width, height } = this.canvas;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 1, 2);
    this.localUser.addCamera(this.camera);
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
    this.localUser.renderer = this.renderer;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.xr.enabled = true;

    const polyfill = new WebXRPolyfill();
    if (polyfill) {
      this.debug('Polyfill enabled');
    }
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
    const intersectableObjects = [
      this.landscapeObject3D, 
      this.applicationGroup, 
      this.floor,
      this.detachedMenus
    ];
    this.interaction = new Interaction(this.canvas, this.camera, this.renderer,
      intersectableObjects, {
        singleClick: (intersection) => this.handleSingleClick(intersection),
        doubleClick: (intersection) => this.handleDoubleClick(intersection),
        mouseWheel: (delta) => this.handleMouseWheel(delta),
        panning: (delta, button) => this.handlePanning(delta, button),
      }, VrRendering.raycastFilter);

    // Add key listener for room positioning
    window.onkeydown = (event: any) => {
      this.handleKeyboard(event);
    };
  }

  static raycastFilter(intersection: THREE.Intersection) {
    return !(intersection.object instanceof LabelMesh || intersection.object instanceof LogoMesh);
  }

  initControllers() {
    this.localUser.controller1 = this.initController({gamepadIndex: 0});
    this.localUser.controller2 = this.initController({gamepadIndex: 1});
  }

  initController({gamepadIndex}: {gamepadIndex: number}): VRController {
    const menuGroup = new MenuGroup();
    const controller = new VRController({
      gamepadIndex,
      scene: this.scene,
      bindings: new VRControllerBindingsList(this.makeControllerBindings(), menuGroup.controllerBindings),
      gripSpace: this.renderer.xr.getControllerGrip(gamepadIndex),
      raySpace: this.renderer.xr.getController(gamepadIndex),
      color: new THREE.Color('red'), 
      menuGroup,
      intersectableObjects: this.interaction.raycastObjects
    });
    controller.setToDefaultAppearance();
    controller.intersectableObjects.push(menuGroup);

    // Position menus above controller at an angle.
    menuGroup.position.y += 0.15;
    menuGroup.position.z -= 0.15;
    menuGroup.rotateX(340 * THREE.MathUtils.DEG2RAD);

    this.localUser.userGroup.add(controller);
    return controller;
  }

  /**
   * Add a menu queues for menus that are attached to the {@link camera}.
   */
  initCameraMenuQueues() {
    // Menu group for hints.
    this.hintMenuQueue = new MenuQueue();
    this.hintMenuQueue.position.x = 0.035;
    this.hintMenuQueue.position.y = -0.1;
    this.hintMenuQueue.position.z = -0.3;
    this.hintMenuQueue.rotation.x = -0.18;
    this.camera.add(this.hintMenuQueue);

    // Menu group for message boxes.
    this.messageMenuQueue = new MenuQueue();
    this.messageMenuQueue.position.x = 0.035;
    this.messageMenuQueue.position.y = 0.1;
    this.messageMenuQueue.position.z = -0.3;
    this.messageMenuQueue.rotation.x = 0.45;
    this.camera.add(this.messageMenuQueue);
  }

  // #endregion COMPONENT AND SCENE INITIALIZATION

  // #region ACTIONS

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

    this.initRendering();

    this.renderer.setAnimationLoop(() => this.render());

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
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  @action
  onVrSessionStarted(/* session: XRSession */) {
    this.debug('WebXRSession started');
  }

  @action
  onVrSessionEnded() {
    this.debug('WebXRSession ended');
    const outerDiv = this.canvas?.parentElement;
    if (outerDiv) {
      this.resize(outerDiv);
    }
  }

  // #endregion ACTIONS

  // #region RENDERING

  /**
   * Main rendering function
   */
  render() {
    if (this.isDestroyed) { return; }

    // Update delta time service.
    this.deltaTimeService.update();
    const delta = this.deltaTimeService.getDeltaTime();

    // Update controlelrs and menus.
    this.localUser.updateControllers(delta);
    this.hintMenuQueue.updateMenu(delta);
    this.messageMenuQueue.updateMenu(delta);

    // Render scene.
    this.renderer.render(this.scene, this.camera);
  }

  @task*
  loadNewLandscape() {
    yield perform(this.vrLandscapeRenderer.populateLandscape);
  }

  // #endregion RENDERING

  // #region APLICATION RENDERING

  addApplication(applicationModel: Application): Promise<ApplicationObject3D|null> {
    if (applicationModel.packages.length === 0) {
      this.showHint('No data available');
      return Promise.resolve(null);
    }
    if (this.applicationGroup.hasApplication(applicationModel.pid)) {
      this.showHint('Application already opened');
      return Promise.resolve(null);
    }
    return this.vrApplicationRenderer.addApplication(applicationModel);
  }

  // #endregion APPLICATION RENDERING

  // #region CONTROLLER HANDLERS

  makeControllerBindings(): VRControllerBindings {
    return new VRControllerBindings({
      triggerButton: new VRControllerButtonBinding('Open / Close', {
        onButtonDown: (controller: VRController) => {
          if (!controller.intersectedObject) return;

          this.handlePrimaryInputOn(controller.intersectedObject);
        },
        onButtonPress: (controller: VRController, value: number) => {
          if (!controller.intersectedObject) return;

          const { object, uv } = controller.intersectedObject;

          if (object.parent instanceof BaseMenu && uv) {
            object.parent.triggerPress(uv, value);
          }
        }
      }),

      menuButton: new VRControllerButtonBinding('Options', {
        onButtonDown: (controller) => this.openMainMenu(controller)
      }),

      gripButton: new VRControllerButtonBinding('Grab Object', {
        onButtonDown: (controller) => this.grabIntersectedObject(controller)
      }),

      thumbpad: new VRControllerThumbpadBinding({ 
        labelUp: 'Teleport / Highlight', 
        labelDown: 'Show Details', 
        labelRight: 'Zoom',
        labelLeft: 'Ping'
      }, {
        onThumbpadDown: (controller, axes) => {
          const direction = VRControllerThumbpadBinding.getDirection(axes);
          switch (direction) {
            case VRControllerThumbpadDirection.UP:
              if (controller.intersectedObject) {
                this.handleSecondaryInputOn(controller.intersectedObject)
              }
              break;
            case VRControllerThumbpadDirection.DOWN:
              if (controller.intersectedObject) {
                const { object } = controller.intersectedObject;
                if (isEntityMesh(object)) {
                  this.openInfoMenu(controller, object);
              }
              }
              break;
            case VRControllerThumbpadDirection.RIGHT:
              this.openZoomMenu(controller);
              break;
            case VRControllerThumbpadDirection.LEFT:
              this.openPingMenu(controller);
              break;
          }
        }
      })

    })
  }

  /**
   * Grabs the object currently intersected by the given controllers ray.
   *
   * @param controller The controller that should grab the intersected object.
   */
  grabIntersectedObject(_controller: VRController) {
    // Supported in multi-user mode only.
  }

  // #endregion CONTROLLER HANDLERS

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
    const mvDst = 0.05;
    // Handle keys
    switch (event.key) {
      case 'q':
        this.rotateLandscape(-mvDst);
        break;
      case 'e':
        this.rotateLandscape(mvDst);
        break;
      case 'w':
        this.moveLandscape(0, mvDst, 0);
        break;
      case 's':
        this.moveLandscape(0, -mvDst, 0);
        break;
      case 'a':
        this.moveLandscape(-mvDst, 0, 0);
        break;
      case 'd':
        this.moveLandscape(mvDst, 0, 0);
        break;
      case '1':
        this.moveLandscape(0, 0, -mvDst);
        break;
      case '2':
        this.moveLandscape(0, 0, mvDst);
        break;
      case 'c':
        this.localUser.connect();
        break;
      case 'r':
        this.resetLandscapePosition();
        break;
      case 'l':
        perform(this.loadNewLandscape);
        break;
      default:
        break;
    }
  }
  // #endregion MOUSE & KEYBOARD EVENT HANDLER

  // #region MENUS

  showHint(title: string, text: string|undefined = undefined) {
    // Show the hint only if there is no hint with the text in the queue
    // already. This prevents the same hint to be shown multiple times when
    // the user repeats the action that causes the hint.
    if (!this.hintMenuQueue.hasEnquedOrCurrentMenu((menu) => menu instanceof HintMenu && menu.titleItem.text === title && menu.textItem?.text === text)) {
      this.hintMenuQueue.enqueueMenu(new HintMenu(title, text));
    }
  }

  openMainMenu(controller: VRController) {
    if (!this.localUser.controller1) return;

    controller.menuGroup.openMenu(new MainMenu({
      openSettingsMenu: () => this.openSettingsMenu(controller),
      openResetMenu: () => this.openResetMenu(controller)
    }));
  }

  openResetMenu(controller: VRController) {
    controller.menuGroup.openMenu(new ResetMenu({
      localUser: this.localUser,
      resetAll: () => this.resetAll()
    }));
  }

  openZoomMenu(controller: VRController) {
    controller.menuGroup.openMenu(new ZoomMenu(this.renderer, this.scene, this.camera));
  }

  openPingMenu(_controller: VRController) {
    // Ping menu cannot be opened in single user mode.
  }

  openCameraMenu(controller: VRController) {
    controller.menuGroup.openMenu(new CameraMenu({
      getCameraDelta: () => this.localUser.getCameraDelta(), 
      changeCameraHeight: (deltaY) => this.localUser.changeCameraHeight(deltaY)
    }));
  }

  openSettingsMenu(controller: VRController) {
    controller.menuGroup.openMenu(new SettingsMenu({
      openCameraMenu: () => this.openCameraMenu(controller),
      labelGroups: [this.localUser.controller1?.labelGroup, this.localUser.controller2?.labelGroup]
    }));
  }

  openInfoMenu(controller: VRController, object: EntityMesh) {
    controller.menuGroup.openMenu(new DetailInfoMenu(object));
  }

  // #endregion MENUS

  // #region UTILS

  handlePrimaryInputOn({ object, uv, point }: THREE.Intersection) {
    const handleApplicationObject = (appObject: THREE.Object3D) => {
      if (!(appObject.parent instanceof ApplicationObject3D)) return;

      if (appObject instanceof ComponentMesh) {
        this.toggleComponentAndUpdate(appObject, appObject.parent);
      } else if (appObject instanceof FoundationMesh) {
        this.closeAllComponentsAndUpdate(appObject.parent);
      }
    }

    if (object instanceof ApplicationMesh) {
      this.addApplication(object.dataModel).then((applicationObject3D : ApplicationObject3D) => {
        // Rotate app so that it is aligned with landscape
        applicationObject3D.setRotationFromQuaternion(this.landscapeObject3D.quaternion);
        applicationObject3D.rotateX(90 * THREE.MathUtils.DEG2RAD);
        applicationObject3D.rotateY(90 * THREE.MathUtils.DEG2RAD);

        // Position app above clicked point.
        applicationObject3D.position.copy(point);
      });
    } else if (object instanceof CloseIcon) {
      if (!object.close()) {
        this.showHint('Object could not be closed');
      }
    } else if (object.parent instanceof ApplicationObject3D) {
      handleApplicationObject(object);
    } else if (object.parent instanceof BaseMenu && uv) {
        object.parent.triggerDown(uv);
    }
  }

  toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    EntityManipulation.toggleComponentMeshState(componentMesh, applicationObject3D);
    this.vrApplicationRenderer.addLabels(applicationObject3D);

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(applicationObject3D.dataModel.pid);

    if (drawableComm) {
      this.vrApplicationRenderer.appCommRendering.addCommunication(applicationObject3D, drawableComm);
      Highlighting.updateHighlighting(applicationObject3D, drawableComm);
    }
  }

  closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D) {
    EntityManipulation.closeAllComponents(applicationObject3D);

    const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(applicationObject3D.dataModel.pid);

    if (drawableComm) {
      this.vrApplicationRenderer.appCommRendering.addCommunication(applicationObject3D, drawableComm);
      Highlighting.updateHighlighting(applicationObject3D, drawableComm);
    }
  }

  handleSecondaryInputOn({ object, point }: THREE.Intersection) {
    if (object instanceof FloorMesh) {
      this.localUser.teleportToPosition(point);
    } else if (object.parent instanceof ApplicationObject3D) {
      this.highlightAppEntity(object, object.parent);
    }
  }

  // eslint-disable-next-line
  highlightAppEntity(object: THREE.Object3D, application: ApplicationObject3D) {
    if (object instanceof ComponentMesh || object instanceof ClazzMesh
      || object instanceof ClazzCommunicationMesh) {
      const drawableComm = this.vrApplicationRenderer.drawableClassCommunications.get(application.dataModel.pid);

      if (drawableComm) {
        Highlighting.highlight(object, application, drawableComm);
      }
    }
  }

  // eslint-disable-next-line
  translateApplication(application: THREE.Object3D, direction: THREE.Vector3, length: number){
    application.translateOnAxis(direction, length);
    application.updateMatrix();
  }

  moveLandscape(deltaX: number, deltaY: number, deltaZ: number) {
    const delta = new THREE.Vector3(deltaX, deltaY, deltaZ);
    this.landscapeObject3D.position.add(delta);
  }

  rotateLandscape(deltaX: number) {
    this.landscapeObject3D.rotation.x -= deltaX;
    this.updateLandscapeRotation(this.landscapeObject3D.quaternion.clone());
  }

  updateLandscapeRotation(quaternion: THREE.Quaternion) {
    this.landscapeObject3D.quaternion.copy(quaternion);
    this.vrLandscapeRenderer.centerLandscape();
  }

  resetLandscapePosition() {
    this.landscapeObject3D.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    this.landscapeObject3D.rotation.y = 0;
    this.landscapeObject3D.rotation.z = 0;
    this.vrLandscapeRenderer.centerLandscape();
  }

  removeApplication(application: ApplicationObject3D) {
    this.applicationGroup.removeApplicationById(application.dataModel.pid);
  }

  resetAll() {
    this.applicationGroup.clear();
    this.resetLandscapePosition();
    this.localUser.resetPosition();
  }

  willDestroy() {
    this.vrLandscapeRenderer.cleanUpLandscape();
    this.applicationGroup.clear();
    this.localUser.reset();
  }

  findMeshByModelId(entityType: EntityType, id: string) {
    if (entityType === NODE_ENTITY_TYPE || entityType === APPLICATION_ENTITY_TYPE) {
      return this.landscapeObject3D.getMeshbyModelId(id);
    } else if (entityType === COMPONENT_ENTITY_TYPE || entityType === CLASS_ENTITY_TYPE) {
      for (let application of Array.from(this.applicationGroup.getOpenedApps())) {
        return application.getBoxMeshbyModelId(id);
      }
    } else if (entityType === CLASS_COMMUNICATION_ENTITY_TYPE) {
      for (let application of Array.from(this.applicationGroup.getOpenedApps())) {
        return application.getCommMeshByModelId(id);
      }
    }
    return null;
}

  // #endregion UTILS
}
