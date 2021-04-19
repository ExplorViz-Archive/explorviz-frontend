import VRController from '../vr-controller';

export type VrInputEvent<T> = {
  target: T;
  controller: VRController | null;
  intersection: THREE.Intersection;
};

export type VrTriggerPressEvent<T> = VrInputEvent<T> & {
  value: number;
};

export type VrInputHandler<T extends THREE.Object3D> = {
  targetType: Function & { prototype: T };
  triggerDown?(event: VrInputEvent<T>): void;
  triggerPress?(event: VrTriggerPressEvent<T>): void;
  triggerUp?(event: VrInputEvent<T>): void;
  hover?(event: VrInputEvent<T>): void;
  resetHover?(event: VrInputEvent<T>): void;
};

type LastHover<T extends THREE.Object3D> = {
  handler: VrInputHandler<T>;
  target: T;
  intersection: THREE.Intersection;
};

export default class VrInputManager {
  private inputHandlers: VrInputHandler<any>[];

  private lastHovers: Map<VRController | null, LastHover<any>[]>;

  constructor() {
    this.inputHandlers = [];
    this.lastHovers = new Map();
  }

  addInputHandler<T extends THREE.Object3D>(handler: VrInputHandler<T>) {
    this.inputHandlers.push(handler);
  }

  handleTriggerDown(
    intersection: THREE.Intersection,
    controller: VRController | null = null,
  ) {
    for (const [handler, target] of this.findInputHandlers(
      intersection,
    ).entries()) {
      if (handler.triggerDown) handler.triggerDown({ target, intersection, controller });
    }
  }

  handleTriggerPress(
    intersection: THREE.Intersection,
    value: number,
    controller: VRController | null = null,
  ) {
    for (const [handler, target] of this.findInputHandlers(
      intersection,
    ).entries()) {
      if (handler.triggerPress) {
        handler.triggerPress({
          target,
          intersection,
          value,
          controller,
        });
      }
    }
  }

  handleTriggerUp(
    intersection: THREE.Intersection,
    controller: VRController | null = null,
  ) {
    for (const [handler, target] of this.findInputHandlers(
      intersection,
    ).entries()) {
      if (handler.triggerUp) handler.triggerUp({ target, intersection, controller });
    }
  }

  handleHover(
    intersection: THREE.Intersection,
    controller: VRController | null = null,
  ) {
    const targetsByHandler = this.findInputHandlers(intersection);

    // Reset hover effect when target changed.
    const lastHovers = this.lastHovers.get(controller) || [];
    for (const lastHover of lastHovers) {
      if (
        lastHover.handler.resetHover
        && lastHover.target !== targetsByHandler.get(lastHover.handler)
      ) {
        lastHover.handler.resetHover({
          controller,
          intersection: lastHover.intersection,
          target: lastHover.target,
        });
      }
    }

    // Enable hover effect.
    const hovers = [];
    for (const [handler, target] of targetsByHandler.entries()) {
      if (handler.hover) {
        handler.hover({ target, intersection, controller });
        hovers.push({ handler, target, intersection });
      }
    }
    this.lastHovers.set(controller, hovers);
  }

  resetHover(controller: VRController | null = null) {
    for (const lastHover of this.lastHovers.get(controller) || []) {
      if (lastHover.handler.resetHover) {
        lastHover.handler.resetHover({
          controller,
          intersection: lastHover.intersection,
          target: lastHover.target,
        });
      }
    }
    this.lastHovers.delete(controller);
  }

  /**
   * Finds all handlers that can handle an ancestor object of the intersected object.
   *
   * Returns for every handler the corresponding target object, i.e., the first
   * ancestor of the intersected object that has the handler's target type.
   */
  private findInputHandlers(
    intersection: THREE.Intersection,
  ): Map<VrInputHandler<THREE.Object3D>, THREE.Object3D> {
    const result = new Map();
    for (const handler of this.inputHandlers) {
      let target: THREE.Object3D | null = intersection.object;
      while (target && !(target instanceof handler.targetType)) {
        target = target.parent;
      }
      if (target) result.set(handler, target);
    }
    return result;
  }
}
