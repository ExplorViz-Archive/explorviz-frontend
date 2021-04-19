import { IntersectableObject } from 'virtual-reality/utils/view-objects/interfaces/intersectable-object';
import AnimatedMenu from './animated-menu';

export default class InteractiveMenu
  extends AnimatedMenu
  implements IntersectableObject {
  /**
   * Interactive menus can be intersected by a controller's ray by default.
   */
  canBeIntersected(_intersection: THREE.Intersection) {
    return true;
  }

  /**
   * Called when the other controller's ray intersects this menu.
   */
  hover(_intersection: THREE.Intersection) {}

  /**
   * Called once when the other controller's trigger is pressed down while
   * hovering this menu. This method is not called again before the trigger
   * is released.
   *
   * @param intersection The intersected point of the menu that is hovered.
   */
  triggerDown(_intersection: THREE.Intersection) {}

  /**
   * Called when the other controller's trigger is pressed while hovering this
   * menu.
   *
   * @param intersection The intersected point of the menu that is hovered.
   * @param value The intensity of the trigger press.
   */
  triggerPress(_intersection: THREE.Intersection, _value: number) {}

  /**
   * Called once when the other controller's trigger is released while
   * hovering this menu.
   *
   * @param intersection The intersected point of the menu that is hovered.
   */
  triggerUp(_intersection: THREE.Intersection) {}

  /**
   * Called when this menu is hovered to apply visual feedback for the hover
   * effect.
   */
  applyHoverEffect() {}

  /**
   * Called when this menu is not hovered anymore to reset the visual feedback
   * for the hover effect.
   */
  resetHoverEffect() {}
}
