export type VrInputHandler<T extends THREE.Object3D> = {
  canHandle(object: THREE.Object3D): object is T,
  triggerDown?(object: T, intersection: THREE.Intersection): void,
  triggerPress?(object: T, intersection: THREE.Intersection, value: number): void,
  triggerUp?(object: T, intersection: THREE.Intersection): void,
  hover?(object: T, intersection: THREE.Intersection): void,
  resetHover?(object: T): void,
};

type LastHover<T extends THREE.Object3D> = {
  handler: VrInputHandler<T>,
  object: T
};

export default class VrInputManager {
  private inputHandlers: VrInputHandler<any>[];
  private lastHover: LastHover<any> | null;

  constructor() {
    this.inputHandlers = [];
    this.lastHover = null;
  }

  addInputHandler<T extends THREE.Object3D>(handler: VrInputHandler<T>) {
    this.inputHandlers.push(handler);
  }

  handleTriggerDown(intersection: THREE.Intersection) {
    const result = this.findInputHandler(intersection);
    if (result && result.handler.triggerDown) result.handler.triggerDown(result.object, intersection);
  }

  handleTriggerPress(intersection: THREE.Intersection, value: number) {
    const result = this.findInputHandler(intersection);
    if (result && result.handler.triggerPress) result.handler.triggerPress(result.object, intersection, value);
  }

  handleTriggerUp(intersection: THREE.Intersection) {
    const result = this.findInputHandler(intersection);
    if (result && result.handler.triggerUp) result.handler.triggerUp(result.object, intersection);
  }

  handleHover(intersection: THREE.Intersection) {
    const result = this.findInputHandler(intersection);
    if (this.lastHover?.object !== result?.object) this.resetHover();
    if (result && result.handler.hover) {
      this.lastHover = result;
      result.handler.hover(result.object, intersection);
    }
  }

  resetHover() {
    if (this.lastHover && this.lastHover.handler.resetHover) {
      this.lastHover.handler.resetHover(this.lastHover.object);
    }
    this.lastHover = null;
  }

  private findInputHandler(intersection: THREE.Intersection): {
    object: THREE.Object3D, handler: VrInputHandler<THREE.Object3D>
  } | null {
    let object: THREE.Object3D | null = intersection.object;
    while (object) {
      for (const handler of this.inputHandlers) {
        if (handler.canHandle(object)) return {object, handler};
      }
      object = object.parent;
    }
    return null;
  }
}
