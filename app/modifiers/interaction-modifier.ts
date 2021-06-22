import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import Raycaster from 'explorviz-frontend/utils/raycaster';
import THREE, { Object3D, Mesh } from 'three';
import { inject as service } from '@ember/service';
import CollaborativeService from 'explorviz-frontend/services/collaborative-service';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';
import LabelMesh from 'explorviz-frontend/view-objects/3d/label-mesh';

export type Position2D = {
  x: number,
  y: number
};

type MouseStopEvent = {
  srcEvent: MouseEvent
};

interface InteractionModifierArgs {
  positional: [];
  named: {
    mousePositionX: number,
    camera: THREE.Camera;
    raycastObjects: Object3D | Object3D[],
    raycastFilter?: ((intersection: THREE.Intersection) => boolean) | null,
    hammerInteraction: HammerInteraction,
    mouseEnter?(): void,
    mouseOut?(): void,
    mouseMove?(intersection: THREE.Intersection | null): void,
    mouseStop?(intersection: THREE.Intersection | null, mousePosition?: Position2D): void,
    mouseWheel?(delta: number): void,
    singleClick?(intersection: THREE.Intersection | null): void,
    doubleClick?(intersection: THREE.Intersection | null): void,
    panning?(delta: { x: number, y: number }, button: 1 | 2 | 3): void,
    rotate?(deltaRotation: number, event: any): void,
    pinch?(deltaScaleInPercent: number, event: any): void,
    press?(intersection: THREE.Intersection | null, mousePosition: Position2D): void,
  }
}

export default class InteractionModifierModifier extends Modifier<InteractionModifierArgs> {
  // Used to determine if and which object was hit
  raycaster: Raycaster;

  @service('collaborative-service')
  collaborativeService!: CollaborativeService;

  @service('collaborative-settings-service')
  collaborativeSettings!: CollaborativeSettingsService;

  // We use this variable to count how many steps the mouse was moved
  // before an occurence of a single click.
  // On mobile devices, tapping will result in a mousemove + mousestop event.
  // Since we use the mousestop event in our rendering components to
  // trigger the display of the popups, on mobile, any tap would trigger
  // the display those popups. So we count actual movings of the mouse
  // to know if it was actually being moved or if there was just a click.
  mouseMoveSteps = 0;

  didInstall() {
    // mouseout handler for disabling notifications
    if (this.args.named.mouseOut) { this.canvas.addEventListener('mouseout', this.onMouseOut, false); }

    // mouseenter handler for disabling notifications
    if (this.args.named.mouseEnter) { this.canvas.addEventListener('mouseenter', this.onMouseEnter, false); }

    // zoom handler
    if (this.args.named.mouseWheel) { this.canvas.addEventListener('wheel', this.onMouseWheelStart, false); }

    // mouse move handler
    if (this.args.named.mouseMove) { this.canvas.addEventListener('mousemove', this.onMouseMove, false); }

    this.canvas.addEventListener('click', this.onRegularClickEvent, false);

    if (this.args.named.mouseStop) {
      this.createMouseStopEvent();
      this.canvas.addEventListener('mousestop', this.onMouseStop, false);
    }
    if (this.args.named.doubleClick) {
      this.hammerInteraction.on('doubletap', this.onDoubleClick);
    }

    if (this.args.named.panning) {
      this.hammerInteraction.on('panning', this.onPanning);
    }

    if (this.args.named.pinch) {
      this.hammerInteraction.on('pinch', this.onPinch);
    }

    if (this.args.named.rotate) {
      this.hammerInteraction.on('rotate', this.onRotate);
    }

    if (this.args.named.singleClick) {
      this.hammerInteraction.on('lefttap', this.onSingleClick);
    }

    if (this.args.named.press) {
      this.hammerInteraction.on('press', this.onPress);
    }
  }

  willDestroy() {
    if (this.args.named.doubleClick) { this.hammerInteraction.hammerManager.off('doubletap'); }

    if (this.args.named.panning) { this.hammerInteraction.hammerManager.off('panning'); }

    if (this.args.named.singleClick) { this.hammerInteraction.hammerManager.off('singletap'); }

    if (this.args.named.pinch) { this.hammerInteraction.hammerManager.off('pinch'); }

    if (this.args.named.rotate) { this.hammerInteraction.hammerManager.off('rotate'); }

    if (this.args.named.press) { this.hammerInteraction.hammerManager.off('press'); }

    if (this.args.named.mouseOut) { this.canvas.removeEventListener('mouseout', this.onMouseOut); }

    if (this.args.named.mouseEnter) { this.canvas.removeEventListener('mouseenter', this.onMouseEnter); }

    if (this.args.named.mouseWheel) { this.canvas.removeEventListener('wheel', this.onMouseWheelStart); }

    if (this.args.named.mouseMove) { this.canvas.removeEventListener('mousemove', this.onMouseMove); }

    if (this.args.named.mouseStop) { this.canvas.removeEventListener('mousestop', this.onMouseStop); }

    this.canvas.removeEventListener('click', this.onRegularClickEvent);
  }

  get canvas(): HTMLCanvasElement {
    assert(
      `Element must be 'HTMLCanvasElement' but was ${typeof this.element}`,
      this.element instanceof HTMLCanvasElement,
    );
    return this.element;
  }

  get raycastObjects(): Object3D | Object3D[] {
    return this.args.named.raycastObjects;
  }

  get raycastFilter(): ((intersection: THREE.Intersection) => boolean) | undefined {
    const filter = this.args.named.raycastFilter;

    // Use default filter if no one is passed
    if (filter === undefined) {
      return (intersection: THREE.Intersection) => !(intersection.object instanceof LabelMesh
        || intersection.object instanceof LogoMesh);
    // Use no filter if null is passed explicitly
    } if (filter === null) {
      return undefined;
    }
    return filter;
  }

  get camera(): THREE.Camera {
    return this.args.named.camera;
  }

  get hammerInteraction(): HammerInteraction {
    return this.args.named.hammerInteraction;
  }

  constructor(owner: any, args: InteractionModifierArgs) {
    super(owner, args);
    this.raycaster = new Raycaster();
  }

  @action
  onMouseEnter() {
    if (!this.args.named.mouseEnter || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.args.named.mouseEnter();
  }

  @action
  onMouseOut() {
    if (!this.args.named.mouseOut || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.args.named.mouseOut();

    if (this.collaborativeSettings.meeting) {
      this.collaborativeService.sendMouseOut();
    }
  }

  @action
  onMouseMove(evt: MouseEvent) {
    if (!this.args.named.mouseMove || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.mouseMoveSteps++;

    if (this.mouseMoveSteps < 2) {
      return;
    }

    // Extract mouse position
    const mouse: Position2D = InteractionModifierModifier.getMousePos(this.canvas, evt);

    const intersectedViewObj = this.raycast(mouse);

    this.args.named.mouseMove(intersectedViewObj);

    if (this.raycastObjects instanceof Object3D && intersectedViewObj
    && intersectedViewObj.object instanceof Mesh && this.collaborativeSettings.meeting) {
      this.collaborativeService.sendMouseMove(intersectedViewObj.point,
        this.raycastObjects.quaternion, intersectedViewObj.object);
    }
  }

  @action
  onMouseStop(evt: CustomEvent<MouseStopEvent>) {
    if (!this.args.named.mouseStop || !this.collaborativeSettings.isInteractionAllowed) { return; }

    if (this.mouseMoveSteps < 2) {
      this.mouseMoveSteps = 0;
      return;
    }

    this.mouseMoveSteps = 0;

    // Extract mouse position
    const mouse: Position2D = InteractionModifierModifier
      .getMousePos(this.canvas, evt.detail.srcEvent);

    const intersectedViewObj = this.raycast(mouse);
    this.args.named.mouseStop(intersectedViewObj, mouse);

    if (this.raycastObjects instanceof Object3D && intersectedViewObj
      && intersectedViewObj.object instanceof Mesh && this.collaborativeSettings.meeting) {
      this.collaborativeService.sendMouseStop(intersectedViewObj.point,
        this.raycastObjects.quaternion, intersectedViewObj.object);
    }
  }

  @action
  onMouseWheelStart(evt: WheelEvent) {
    if (!this.args.named.mouseWheel || !this.collaborativeSettings.isInteractionAllowed) { return; }

    // Either 1 or -1 (depending on mouse wheel direction)
    const delta = Math.sign(evt.deltaY);

    this.args.named.mouseWheel(delta);
    this.sendPerspective();
  }

  @action
  onSingleClick(mouse: Position2D) {
    if (!this.args.named.singleClick || !this.collaborativeSettings.isInteractionAllowed
      || !this.collaborativeSettings.canIOpen) { return; }

    const intersectedViewObj = this.raycast(mouse);
    this.args.named.singleClick(intersectedViewObj);

    if (intersectedViewObj && intersectedViewObj.object instanceof Mesh
      && this.collaborativeSettings.meeting) {
      this.collaborativeService.sendSingleClick(intersectedViewObj.object);
    }
  }

  @action
  onDoubleClick(mouse: Position2D) {
    if (!this.args.named.doubleClick || !this.collaborativeSettings.isInteractionAllowed
      || !this.collaborativeSettings.canIOpen) { return; }

    const intersectedViewObj = this.raycast(mouse);
    this.args.named.doubleClick(intersectedViewObj);

    if (intersectedViewObj && intersectedViewObj.object instanceof Mesh
      && this.collaborativeSettings.meeting) {
      this.collaborativeService.sendDoubleClick(intersectedViewObj.object);
    }
  }

  @action
  onRegularClickEvent() {
    this.mouseMoveSteps = 0;
  }

  @action
  onPress(mouse: Position2D) {
    if (!this.args.named.press || !this.collaborativeSettings.isInteractionAllowed) { return; }

    const intersectedViewObj = this.raycast(mouse);
    this.args.named.press(intersectedViewObj, mouse);

    // Send press event here?
    /*     if (intersectedViewObj && intersectedViewObj.object instanceof Mesh
      && this.collaborativeSettings.meeting) {
      this.collaborativeService.sendSingleClick(intersectedViewObj.object);
    } */
  }

  @action
  onPanning(delta: { x: number, y: number }, event: any) {
    if (!this.args.named.panning || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.args.named.panning(delta, event.button);
    this.sendPerspective();
  }

  @action
  onRotate(deltaRotation: number, event: any) {
    if (!this.args.named.rotate || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.args.named.rotate(deltaRotation, event);
    this.sendPerspective();
  }

  @action
  onPinch(deltaScaleInPercent: number, center: Position2D) {
    if (!this.args.named.pinch || !this.collaborativeSettings.isInteractionAllowed) { return; }

    this.args.named.pinch(deltaScaleInPercent, center);
    this.sendPerspective();
  }

  sendPerspective() {
    if (this.collaborativeSettings.meeting && this.raycastObjects instanceof Object3D) {
      this.collaborativeService.sendPerspective({
        position: this.camera.position.toArray(),
        rotation: this.raycastObjects.rotation?.toArray().slice(0, 3),
        requested: false,
      });
    }
  }

  raycast(mouseOnCanvas: Position2D) {
    const origin = this.calculatePositionInScene(mouseOnCanvas);

    const possibleObjects = this.raycastObjects instanceof Object3D
      ? [this.raycastObjects] : this.raycastObjects;

    const intersectedViewObj = this.raycaster.raycasting(origin, this.args.named.camera,
      possibleObjects, this.raycastFilter);

    return intersectedViewObj;
  }

  calculatePositionInScene(mouseOnCanvas: Position2D) {
    const x = (mouseOnCanvas.x / this.canvas.clientWidth) * 2 - 1;

    const y = -(mouseOnCanvas.y / this.canvas.clientHeight) * 2 + 1;

    return { x, y };
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

  static getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }
}
