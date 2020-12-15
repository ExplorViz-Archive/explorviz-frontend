import Item from './item';

export default abstract class InteractiveItem extends Item {
  counter = 0;

  get isHovered() { return this.counter > 0;}

  onHover: (() => void)|undefined = undefined;

  onTriggerDown: (() => void)|undefined = undefined;

  onTriggerPressed: ((value: number) => void)|undefined = undefined;

  enableHoverEffect() {
    this.counter++;
  }

  resetHoverEffect() {
    this.counter--;
  }
}
