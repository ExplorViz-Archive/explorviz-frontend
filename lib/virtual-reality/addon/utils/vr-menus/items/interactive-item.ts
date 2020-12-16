import Item from './item';

export default abstract class InteractiveItem extends Item {
  hoveredByButton = false;
  hoveredByRay = false;

  get isHovered() { return this.hoveredByButton || this.hoveredByRay;}

  onHover: (() => void)|undefined = undefined;

  onTriggerDown: (() => void)|undefined = undefined;

  onTriggerPressed: ((value: number) => void)|undefined = undefined;

  enableHoverEffect() {
    this.hoveredByRay = true;
  }

  resetHoverEffect() {
    this.hoveredByRay = false;
  }

  enableHoverEffectByButton() {
    this.hoveredByButton = true;
  }

  resetHoverEffectByButton() {
    this.hoveredByButton = false
  }
}
