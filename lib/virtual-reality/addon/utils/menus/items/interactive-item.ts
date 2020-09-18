import Item from './item';

export default abstract class InteractiveItem extends Item {
  isHovered = false;

  onHover: (() => void)|undefined = undefined;

  onTriggerPressed: (() => void)|undefined = undefined;

  onTriggerHeld: (() => void)|undefined = undefined;

  enableHoverEffect() {
    this.isHovered = true;
  }

  removeHoverEffect() {
    this.isHovered = false;
  }
}
