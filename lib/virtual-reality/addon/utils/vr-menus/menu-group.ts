import THREE from "three";
import FloorMesh from "../view-objects/vr/floor-mesh";
import VRController from "../vr-controller";
import VRControllerBindings from "../vr-controller/vr-controller-bindings";
import BaseMenu from "./base-menu";
import { DetachableMenu, isDetachableMenu } from "./detachable-menu";

export const MENU_DETACH_EVENT_TYPE = 'detach-menu';

export type MenuDetachedEvent = {
  type: typeof MENU_DETACH_EVENT_TYPE,
  menu: DetachableMenu
};

export default class MenuGroup extends THREE.Group {
  private menus: BaseMenu[];
  readonly controllerBindings: VRControllerBindings[];

  constructor() {
    super();
    this.menus = [];
    this.controllerBindings = [];
  }

  /**
   * The currently open menu or `null` if no menu is open.
   */
  get currentMenu(): BaseMenu | null {
    if (this.menus.length === 0) return null;
    return this.menus[this.menus.length - 1];
  }

  /**
   * Makes the ray and teleport area of the parent controller of this menu
   * group visible or invisible based on the currently open menu.
   */
  toggleControllerRay() {
    const controller = VRController.findController(this);
    if (controller) {
      let rayVisibleInMenu = !this.currentMenu || this.currentMenu.enableControllerRay;
      let enableTeleportInMenu = !this.currentMenu || this.currentMenu.enableTeleport;
      if (controller.ray) controller.ray.visible = rayVisibleInMenu;
      if (controller.teleportArea) {
        const intersectsFloor = controller.intersectedObject?.object instanceof FloorMesh;
        controller.enableTeleport = enableTeleportInMenu;
        controller.teleportArea.visible = enableTeleportInMenu && intersectsFloor;
      }
    }
  }

  /**
   * Opens the given menu.
   *
   * If another menu is currently open, it is hidden by removing the mesh
   * from this group until the newly opened menu is closed.
   *
   * @param menu The menu to open.
   */
  openMenu(menu: BaseMenu) {
    // Hide current menu before opening the new menu.
    if (this.currentMenu) {
      this.currentMenu.onPauseMenu();
      this.remove(this.currentMenu);
    }

    this.addMenu(menu);
    menu.onOpenMenu();
  }

  /**
   * Updates the currently open menu if any.
   */
  updateMenu(delta: number) {
    this.currentMenu?.onUpdateMenu(delta);
  }

  /**
   * Closes the currently open menu if any.
   *
   * If a previously open menu was hidden by {@link MenuGroup.openMenu},
   * it is shown again by adding the mesh back to this group.
   */
  closeMenu() {
    this.removeMenu((m) => m.onCloseMenu());
    this.resumeMenu();
  }

  /**
   * Closes menus until the current menu does not match the given predicate.
   *
   * Only the final menu (i.e., the first menu that is not closed) is resumed.
   */
  closeMenusWhile(predicate: (menu: BaseMenu) => boolean) {
    while (this.currentMenu && predicate(this.currentMenu)) {
      this.removeMenu((m) => m.onCloseMenu());
    }
    this.resumeMenu();
  }

  /**
   * Closes the currently open menu and opens the given menu without
   * resuming the previously open menu.
   */
  replaceMenu(nextMenu: BaseMenu) {
    this.removeMenu((m) => m.onCloseMenu());
    this.addMenu(nextMenu);
    nextMenu.onOpenMenu();
  }

  /**
   * Detaches the currently active menu if it is an instance of `DetachableMenu`.
   */
  detachMenu() {
    const detachedMenu = this.currentMenu;
    if (detachedMenu && isDetachableMenu(detachedMenu)) {
      this.popMenu((m) => m.onDetachMenu());
      this.resumeMenu();

      // send detached menu
      this.dispatchEvent({
        type: MENU_DETACH_EVENT_TYPE,
        menu: detachedMenu
      });
    }
  }

  /**
   * Adds the given menu to the menu group, making it the currently active
   * menu.
   *
   * @param menu  The menu to add.
   */
  private addMenu(menu: BaseMenu) {
    this.menus.push(menu);
    this.controllerBindings.push(menu.makeControllerBindings());
    this.add(menu);

    // Hide or show the controllers ray.
    this.toggleControllerRay();
  }

  /**
   * Removes the currently active menu.
   *
   * @param callback Determines whethe the `onClose` or `onDetach` callback
   * is invoked.
   */
  private removeMenu(callback: (removedMenu: BaseMenu) => void): BaseMenu | undefined {
    const menu = this.popMenu(callback);
    if (menu) {
      this.remove(menu);
    }
    return menu;
  }

  /**
   * Pop active menu.
   *
   * @param callback Determines whethe the `onClose` or `onDetach` callback
   * is invoked.
   */
  private popMenu(callback: (menu: BaseMenu) => void): BaseMenu | undefined {
    const menu = this.menus.pop();
    this.controllerBindings.pop();
    if (menu) {
      callback(menu);
    }
    return menu;
  }

  /**
   * Resumes the previously active menu.
   *
   * This method must be called after the current menu has been removed
   * (see `removeMenu`).
   */
  private resumeMenu() {
    // Show previously hidden menu if any.
    if (this.currentMenu) {
      this.add(this.currentMenu);
      this.currentMenu.onResumeMenu();
    }

    // Hide or show the controllers ray.
    this.toggleControllerRay();
  }
}
