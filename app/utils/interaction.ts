import CollaborativeService from 'collaborative-mode/services/collaborative-service';
import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import Raycaster from 'explorviz-frontend/utils/raycaster';
import THREE from 'three';
import { CursorPosition } from './collaborative-mode/collaborative-data';

type CallbackFunctions = {
  mouseEnter?(): void,
  mouseOut?(): void,
  mouseMove?(mesh?: THREE.Mesh): void,
  mouseStop?(mesh?: THREE.Mesh, mousePosition?: Position2D): void,
  mouseWheel?(delta: number): void,
  singleClick?(mesh?: THREE.Mesh): void,
  doubleClick?(mesh?: THREE.Mesh): void,
  panning?(delta: { x: number, y: number }, button: 1 | 2 | 3): void
};

type MouseStopEvent = {
  srcEvent: MouseEvent
};

export type Position2D = {
  x: number,
  y: number
};

/**
 * This class provides generic interaction functions which are triggered by
 * (mouse) events on a canvas. These functions in turn are calling
 * callback functions which are passed via the constructor. For some
 * events additional computing (e.g. raycasting) is provided to determine
 * the nature of the event.
 */
export default class Interaction {
  // Needed to register event listeners
  canvas: HTMLCanvasElement;

  // Needed for raycasting
  camera: THREE.Camera;

  // Needed to calculate current position of mouse in the scene
  renderer: THREE.WebGLRenderer;

  // Contains all Objects3D which shall be raycasted
  raycastObject3D: THREE.Object3D;

  // Used to determine if and which object was hit
  raycaster: Raycaster;

  // Needed for events like 'double tap'
  hammerHandler: HammerInteraction;

  // Contains functions which should be called in case of an event
  eventCallbackFunctions: CallbackFunctions;

  collaborativeService: CollaborativeService;

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer: THREE.WebGLRenderer,
    application: THREE.Object3D, collaborativeService: CollaborativeService, eventCallbackFunctions: CallbackFunctions) {
    this.canvas = canvas;
    this.camera = camera;
    this.renderer = renderer;
    this.raycastObject3D = application;
    this.eventCallbackFunctions = { ...eventCallbackFunctions };

    this.raycaster = new Raycaster();

    // Init Hammer interaction
    this.hammerHandler = HammerInteraction.create();
    this.hammerHandler.setupHammer(canvas);

    this.collaborativeService = collaborativeService

    this.setupInteraction();
  }

  setupInteraction() {
    this.bindThisOnEventListeners();
    this.setupEventListener();
    this.setupHammerListener();
  }

  bindThisOnEventListeners() {
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseWheelStart = this.onMouseWheelStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseStop = this.onMouseStop.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onPanning = this.onPanning.bind(this);
    this.onSingleClick = this.onSingleClick.bind(this);
  }

  setupEventListener() {
    // mouseout handler for disabling notifications
    if (this.eventCallbackFunctions.mouseOut) { this.canvas.addEventListener('mouseout', this.onMouseOut, false); }

    // mouseenter handler for disabling notifications
    if (this.eventCallbackFunctions.mouseEnter) { this.canvas.addEventListener('mouseenter', this.onMouseEnter, false); }

    // zoom handler
    if (this.eventCallbackFunctions.mouseWheel) { this.canvas.addEventListener('wheel', this.onMouseWheelStart, false); }

    // mouse move handler
    if (this.eventCallbackFunctions.mouseMove) { this.canvas.addEventListener('mousemove', this.onMouseMove, false); }

    if (this.eventCallbackFunctions.mouseStop) {
      this.createMouseStopEvent();
      this.canvas.addEventListener('mousestop', this.onMouseStop, false);
    }
  }

  setupHammerListener() {
    if (this.eventCallbackFunctions.doubleClick) {
      this.hammerHandler.on('doubletap', this.onDoubleClick);
    }

    if (this.eventCallbackFunctions.panning) {
      this.hammerHandler.on('panning', this.onPanning);
    }

    if (this.eventCallbackFunctions.singleClick) {
      this.hammerHandler.on('singletap', this.onSingleClick);
    }
  }

  onMouseEnter() {
    if (!this.eventCallbackFunctions.mouseEnter) { return; }

    this.eventCallbackFunctions.mouseEnter();
  }

  onMouseOut() {
    if (!this.eventCallbackFunctions.mouseOut) { return; }

    this.eventCallbackFunctions.mouseOut();
  }

  onMouseMove(evt: MouseEvent) {
    if (!this.eventCallbackFunctions.mouseMove) { return; }

    // Extract mouse position
    const mouse: Position2D = Interaction.getMousePos(this.canvas, evt);

    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseMove(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.mouseMove();
    }
    const payload = this.getPointerPosition(mouse);
    this.collaborativeService.sendMouseMove(payload);
  }

  onMouseMove2(cursorPosition: CursorPosition) {
    if (!this.eventCallbackFunctions.mouseMove) { return; }

    const mouse = this.calculateMousePosition(cursorPosition);
    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseMove(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.mouseMove();
    }
  }

  calculateMousePosition(cursorPosition: CursorPosition) {
    var mouse = new THREE.Vector3(); // create once and reuse
    mouse.set(cursorPosition.x, cursorPosition.y, 0);
    mouse.project(this.camera);
    mouse.x = Math.round((0.5 + mouse.x / 2) * (this.renderer.domElement.width / window.devicePixelRatio));
    mouse.y = Math.round((0.5 - mouse.y / 2) * (this.renderer.domElement.height / window.devicePixelRatio));
    // console.log("Vec2: " + mouse.x + "==" +  mouse.y)

    const pointerX = mouse.x - 5;
    const pointerY = mouse.y - 5;
    return {x: pointerX, y: pointerY, color: 'grey'};
  }

  onMouseStop(evt: CustomEvent<MouseStopEvent>) {
    if (!this.eventCallbackFunctions.mouseStop) { return; }

    // Extract mouse position
    const mouse: Position2D = Interaction.getMousePos(this.canvas, evt.detail.srcEvent);

    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseStop(intersectedViewObj.object, mouse);
    } else {
      this.eventCallbackFunctions.mouseStop();
    }
    const payload = this.getPointerPosition(mouse);
    this.collaborativeService.sendMouseStop(payload);
  }

  onMouseStop2(cursorPosition: CursorPosition) {
    if (!this.eventCallbackFunctions.mouseStop) { return; }
    const mouse = this.calculateMousePosition(cursorPosition);
    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseStop(intersectedViewObj.object, mouse);
    } else {
      this.eventCallbackFunctions.mouseStop();
    }
  }


  getPointerPosition(mouse: Position2D) {
    const pointerPosition = this.calculatePositionInScene(mouse)

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(pointerPosition.x, pointerPosition.y, 0);
    // vec.set(mouse.x, mouse.y, 0);
    vec.unproject(this.camera);

    vec.sub(this.camera.position).normalize();
    var distance = - this.camera.position.z / vec.z;

    pos.copy(this.camera.position).add(vec.multiplyScalar(distance))

    return {x: pos.x, y: pos.y};
  }

  onMouseWheelStart(evt: WheelEvent) {
    if (!this.eventCallbackFunctions.mouseWheel) { return; }

    // Either 1 or -1 (depending on mouse wheel direction)
    const delta = Math.sign(evt.deltaY);

    this.eventCallbackFunctions.mouseWheel(delta);
    this.sendPerspective();
  }

  onSingleClick(mouse: Position2D) {
    if (!this.eventCallbackFunctions.singleClick) { return; }

    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.singleClick(intersectedViewObj.object);
      this.collaborativeService.sendSingleClick(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.singleClick();
    }
  }

  onDoubleClick(mouse: Position2D) {
    if (!this.eventCallbackFunctions.doubleClick) { return; }

    const intersectedViewObj = this.raycast(mouse);

    if (intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.doubleClick(intersectedViewObj.object);
      this.collaborativeService.sendDoubleClick(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.doubleClick();
    }
  }

  onPanning(delta: { x: number, y: number }, event: any) {
    if (!this.eventCallbackFunctions.panning) { return; }

    this.eventCallbackFunctions.panning(delta, event.button);
    this.sendPerspective();
  }

  sendPerspective() {
    this.collaborativeService.sendPerspective( {
        position: {x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z},
        rotation: {x: this.raycastObject3D.rotation?.x, y: this.raycastObject3D.rotation?.y, z: this.raycastObject3D.rotation?.z}
    });
  }
  // Handler

  calculatePositionInScene(mouseOnCanvas: Position2D) {
    const x = (mouseOnCanvas.x / this.renderer.domElement.clientWidth) * 2 - 1;

    const y = -(mouseOnCanvas.y / this.renderer.domElement.clientHeight) * 2 + 1;

    const origin = { x, y };

    return origin;
  }

  raycast(mouseOnCanvas: Position2D) {
    const origin = this.calculatePositionInScene(mouseOnCanvas);

    const intersectedViewObj = this.raycaster.raycasting(origin, this.camera,
      this.raycastObject3D.children);

    return intersectedViewObj;
  }

  createMouseStopEvent() {
    const self = this;

    // Custom event for mousemovement end
    (function computeMouseMoveEvent(delay) {
      let timeout: NodeJS.Timeout;
      self.canvas.addEventListener('mousemove', (evt: MouseEvent) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const event = new CustomEvent<MouseStopEvent>('mousestop', {
            detail: {
              srcEvent: evt,
            },
            bubbles: true,
            cancelable: true,
          });
          if (evt.target) evt.target.dispatchEvent(event);
        }, delay);
      });
    }(300));
  }

  /**
   * Removes all listeners for mouse and hammer events
   */
  removeHandlers() {
    if (this.eventCallbackFunctions.doubleClick) { this.hammerHandler.hammerManager.off('doubletap'); }

    if (this.eventCallbackFunctions.panning) { this.hammerHandler.hammerManager.off('panning'); }

    if (this.eventCallbackFunctions.singleClick) { this.hammerHandler.hammerManager.off('singletap'); }

    if (this.eventCallbackFunctions.mouseOut) { this.canvas.removeEventListener('mouseout', this.onMouseOut); }

    if (this.eventCallbackFunctions.mouseEnter) { this.canvas.removeEventListener('mouseenter', this.onMouseEnter); }

    if (this.eventCallbackFunctions.mouseWheel) { this.canvas.removeEventListener('wheel', this.onMouseWheelStart); }

    if (this.eventCallbackFunctions.mouseMove) { this.canvas.removeEventListener('mousemove', this.onMouseMove); }

    if (this.eventCallbackFunctions.mouseStop) { this.canvas.removeEventListener('mousestop', this.onMouseStop); }
  }

  static getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }
}
