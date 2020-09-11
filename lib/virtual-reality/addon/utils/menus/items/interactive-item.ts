import Item from './item';

export interface InteractionCallbackFunctions {
  onHover?(): void;
  onTriggerPressed?(): void;
  onTriggerHeld?(): void;
}

export default abstract class InteractiveItem extends Item {
  isHovered = false;

  interactionCallbacks: InteractionCallbackFunctions;

  constructor(id: string, position: { x: number, y: number },
    interactionCallbacks: InteractionCallbackFunctions) {
    super(id, position);

    this.interactionCallbacks = interactionCallbacks;
  }

  enableHoverEffect() {
    this.isHovered = true;
  }

  removeHoverEffect() {
    this.isHovered = false;
  }
}
