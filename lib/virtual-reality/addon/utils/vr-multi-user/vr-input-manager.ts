export type VrInputHandler<T extends THREE.Object3D> = {
  canHandle(object: THREE.Object3D): object is T,
  triggerDown?(object: T, intersection: THREE.Intersection): void,
  triggerPress?(object: T, intersection: THREE.Intersection, value: number): void,
  triggerUp?(object: T, intersection: THREE.Intersection): void,
};

export default class VrInputManager {
  private inputHandlers: VrInputHandler<any>[];

  constructor() {
    this.inputHandlers = [];
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