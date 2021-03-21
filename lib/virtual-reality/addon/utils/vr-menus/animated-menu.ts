import THREE from "three";
import BaseMenu, { BaseMenuArgs } from "./base-menu";

/**
 * An event that is fired by THREE.js's animation system when an animation
 * is done.
 */
type AnimationFinishedEvent = {
  type: 'finished',
  action: THREE.AnimationAction
};

/**
 * Base class for all menus that can be animated.
 */
export default abstract class AnimatedMenu extends BaseMenu {
  animationMixer: THREE.AnimationMixer;

  constructor(args: BaseMenuArgs) {
    super(args);
    this.animationMixer = new THREE.AnimationMixer(this);
  }

  /**
   * Waits the given animation action to finish and returns a promise that
   * is fullfilled once the animation is finished.
   */
  waitForAnimation(action: THREE.AnimationAction): Promise<null> {
    return new Promise((resolve) => {
      const listener = (evt: AnimationFinishedEvent) => {
        if (evt.action === action) {
          this.animationMixer.removeEventListener('finished', listener);
          resolve(null);
        }
      };
      this.animationMixer.addEventListener('finished', listener);
    });
  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);
    this.animationMixer.update(delta);
  }
}
