import THREE from 'three';
import VRControllerBindings from '../vr-controller/vr-controller-bindings';
import VRControllerThumbpadBinding from '../vr-controller/vr-controller-thumbpad-binding';
import VRControllerButtonBinding from '../vr-controller/vr-controller-button-binding';
import MenuGroup from './menu-group';

export default abstract class BaseMenu extends THREE.Group {
  isMenuOpen: boolean;

  constructor() {
    super();
    this.isMenuOpen = false;
  }

  /**
   * Called when the other controller's ray intersects this menu.
   */
  hover(_uv: THREE.Vector2) {}

  /**
   * Called once when the other controller's trigger is pressed down while
   * hovering this menu. This method is not called again before the trigger
   * is released.
   * 
   * @param uv The coordinate of the menu that is hovered.
   */
  triggerDown(_uv: THREE.Vector2) {}

  /**
   * Called when the other controller's trigger is pressed while hovering this
   * menu.
   * 
   * @param uv The coordinate of the menu that is hovered.
   * @param value The intensity of the trigger press.
   */
  triggerPress(_uv: THREE.Vector2, _value: number) {}

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

  /**
   * Creates the bindings for the thumbpad of the controller that holds this
   * menu.
   */
  makeThumbpadBinding(): VRControllerThumbpadBinding|undefined {
    return undefined;
  }

  /**
   * Creates the binding for the trigger button of the controller that holds
   * this menu.
   */
  makeTriggerButtonBinding(): VRControllerButtonBinding<number>|undefined {
    return undefined;
  }

  /**
   * Creates the binding for the controller's grip button to use for the
   * controller that holds this menu.
   */
  makeGripButtonBinding(): VRControllerButtonBinding<undefined>|undefined {
    return undefined;
  }

  /**
   * Creates the binding for the menu button to use for the controller that
   * holds this menu.
   * 
   * By default the menu button closes the menu. Overwrite this method to
   * return `undefined` to disable this behavior.
   */
  makeMenuButtonBinding(): VRControllerButtonBinding<undefined>|undefined {
    return new VRControllerButtonBinding('Back', {
      onButtonDown: this.closeMenu.bind(this)
    });
  }

  /**
   * Creates the controller bindings to use for the controller that has opened
   * this menu instead of the default bindings whenever this menu is open.
   * 
   * The controller bindings are created when the menu is opened. They do not
   * refresh automatically.
   */
  makeControllerBindings(): VRControllerBindings {
    return new VRControllerBindings({
      thumbpad: this.makeThumbpadBinding(),
      triggerButton: this.makeTriggerButtonBinding(),
      gripButton: this.makeGripButtonBinding(),
      menuButton: this.makeMenuButtonBinding()
    });
  }

  /**
   * Whether the controller's ray should be shown when this menu is open.
   *
   * By default, the controller's ray is hidden since the controller cannot
   * be used to interact with the environment while a menu is open. If the
   * controller bindings are overridden by a subclass such that the controller
   * can interact with the environment again, this getter should be overridden
   * as well.
   */
  get enableControllerRay(): boolean {
    return false;
  }

  closeMenu() {
    if (this.parent instanceof MenuGroup) {
      this.parent.closeMenu();
    }
  }

  detachMenu() {
    if (this.parent instanceof MenuGroup) {
      this.parent.detachMenu();
    }
  }

  /**
   * Callback that is invoked by the menu group when this menu is opened.
   */
  onOpenMenu() {
    this.isMenuOpen = true;
  }

  /**
   * Callback that is invoked by the menu group once per frame.
   * 
   * @param delta The time in seconds since the last frame.
   */
  onUpdateMenu(_delta: number) {}

  /**
   * Callback that is invoked by the menu group when this menu is hidden because
   * another menu is openend instead.
   */
  onPauseMenu() {}

  /**
   * Callback that is invoked by the menu group when this menu is shown again
   * after it was hidden becaus ethe other menu was closed.
   */
  onResumeMenu() {}

  /**
   * Callback that is invoked by the menu group when this menu is closed.
   */
  onCloseMenu() {
    this.isMenuOpen = false;
  }
}
