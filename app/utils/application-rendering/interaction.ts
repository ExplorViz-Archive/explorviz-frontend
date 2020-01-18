import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import Raycaster from 'explorviz-frontend/utils/raycaster';
import { action } from "@ember/object";
import THREE from 'three';

type CallbackFunctions = {
  mouseEnter?(): void,
  mouseOut?(): void,
  mouseMove?(mesh?: THREE.Mesh): void,
  mouseStop?(mesh?: THREE.Mesh, mousePosition?: Position2D): void,
  mouseWheel?(delta: number): void,
  singleClick?(mesh?: THREE.Mesh): void,
  doubleClick?(mesh?: THREE.Mesh): void,
  panning?(delta: {x:number,y:number}, button: 1|2|3): void
}

type MouseOffsetPosition = {
  offsetX: number,
  offsetY: number
}

export type Position2D = {
  x: number,
  y: number
}

export default class ApplicationInteraction {

  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  application: THREE.Object3D;
  raycaster: Raycaster;
  hammerHandler: HammerInteraction;
  eventCallbackFunctions: CallbackFunctions;

  mouseOnCanvas = true;

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer:THREE.WebGLRenderer, application: THREE.Object3D, eventCallbackFunctions: CallbackFunctions) {
    this.canvas = canvas;
    this.camera = camera;
    this.renderer = renderer;
    this.application = application;
    this.eventCallbackFunctions = eventCallbackFunctions;

    this.raycaster = new Raycaster();

    // init Hammer
    this.hammerHandler = HammerInteraction.create();
    this.hammerHandler.setupHammer(canvas);

    this.setupInteraction();
  }

  setupInteraction() {
    // mouseout handler for disabling notifications
    if(this.eventCallbackFunctions.mouseOut)
      this.canvas.addEventListener('mouseout', this.onMouseOut, false);

    // mouseenter handler for disabling notifications
    if(this.eventCallbackFunctions.mouseEnter)
      this.canvas.addEventListener('mouseenter', this.onMouseEnter, false);

    // zoom handler
    if(this.eventCallbackFunctions.mouseWheel)
      this.canvas.addEventListener('wheel', this.onMouseWheelStart, false);

    // mouse move handler
    if(this.eventCallbackFunctions.mouseMove)
      this.canvas.addEventListener('mousemove', this.onMouseMove, false);

    if(this.eventCallbackFunctions.mouseStop) {
      this.createMouseStopEvent();
      this.canvas.addEventListener('mousestop', this.onMouseStop, false);
    }

    this.setupHammerListener();
  }

  setupHammerListener() {
    const self = this;

    if(this.eventCallbackFunctions.doubleClick) {
      this.hammerHandler.on('doubletap', function(mouse: Position2D) {
        self.onDoubleClick(mouse);
      });
    }

    if(this.eventCallbackFunctions.panning) {
      this.hammerHandler.on('panning', function(delta, event) {
        self.onPanning(delta, event);
      });
    }

    if(this.eventCallbackFunctions.singleClick) {
      this.hammerHandler.on('singletap', function(mouse: Position2D) {
        self.onSingleClick(mouse);
      });
    }
  }

  @action
  onMouseEnter() {
    this.mouseOnCanvas = true;
    if(!this.eventCallbackFunctions.mouseEnter)
      return;

    this.eventCallbackFunctions.mouseEnter();
  }

  @action
  onMouseOut() {
    this.mouseOnCanvas = false;
    if(!this.eventCallbackFunctions.mouseOut)
      return;

    this.eventCallbackFunctions.mouseOut();
  }

  @action
  onMouseMove(evt: MouseEvent) {
    if(!this.eventCallbackFunctions.mouseMove)
      return;

    const mouse = {
      x: evt.offsetX,
      y: evt.offsetY
    };

    const intersectedViewObj = this.raycast(mouse);

    if(intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseMove(intersectedViewObj.object)
    } else {
      this.eventCallbackFunctions.mouseMove();
    }
  }

  @action
  onMouseStop(evt: CustomEvent<MouseOffsetPosition>) {
    if(!this.eventCallbackFunctions.mouseStop)
      return;

    if(!this.mouseOnCanvas)
      return;

    const mouse = {
      x: evt.detail.offsetX,
      y: evt.detail.offsetY
    };

    const intersectedViewObj = this.raycast(mouse);

    if(intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.mouseStop(intersectedViewObj.object, mouse);
    } else {
      this.eventCallbackFunctions.mouseStop();
    }
  }

  @action
  onMouseWheelStart(evt: WheelEvent) {
    if(!this.eventCallbackFunctions.mouseWheel)
      return;

    const delta = Math.sign(evt.deltaY);

    this.eventCallbackFunctions.mouseWheel(delta);
  }

  @action
  onSingleClick(mouse: Position2D) {
    if(!this.eventCallbackFunctions.singleClick)
      return;

    const intersectedViewObj = this.raycast(mouse);

    if(intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.singleClick(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.singleClick();
    }
  }

  @action
  onDoubleClick(mouse: Position2D) {
    if(!this.eventCallbackFunctions.doubleClick)
      return;

    const intersectedViewObj = this.raycast(mouse);

    if(intersectedViewObj && intersectedViewObj.object instanceof THREE.Mesh) {
      this.eventCallbackFunctions.doubleClick(intersectedViewObj.object);
    } else {
      this.eventCallbackFunctions.doubleClick();
    }
  }

  @action
  onPanning(delta: {x:number, y:number}, event: any) {
    if(!this.eventCallbackFunctions.panning)
      return;

    this.eventCallbackFunctions.panning(delta, event.button);
  }

  // Handler

  calculatePositionInScene(mouseOnCanvas: Position2D) {
    let x = (mouseOnCanvas.x / this.renderer.domElement.clientWidth) * 2 - 1;

    let y = -(mouseOnCanvas.y / this.renderer.domElement.clientHeight) * 2 + 1;

    const origin = { x, y };

    return origin;
  }

  raycast(mouseOnCanvas: Position2D) {
    let origin = this.calculatePositionInScene(mouseOnCanvas);

    const intersectedViewObj =
      this.raycaster.raycasting(origin, this.camera, this.application.children);

    return intersectedViewObj;
  }

  createMouseStopEvent() {
    const self = this;

    // custom event for mousemovement end
    (function (delay) {
      var timeout: NodeJS.Timeout;
      self.canvas.addEventListener('mousemove', function (evt: MouseEvent) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          var event = new CustomEvent<MouseOffsetPosition>("mousestop", {
            detail: {
              offsetX: evt.offsetX,
              offsetY: evt.offsetY
            },
            bubbles: true,
            cancelable: true
          });
          if(evt.target)
            evt.target.dispatchEvent(event);
        }, delay);
      });
    })(300);
  }

  removeHandlers() {
    this.hammerHandler.hammerManager.off('doubletap');
    this.hammerHandler.hammerManager.off('panning');
    this.hammerHandler.hammerManager.off('singletap');
    this.canvas.removeEventListener('mouseout', this.onMouseOut);
    this.canvas.removeEventListener('mouseenter', this.onMouseEnter);
    this.canvas.removeEventListener('wheel', this.onMouseWheelStart);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mousestop', this.onMouseStop);
  }
}
