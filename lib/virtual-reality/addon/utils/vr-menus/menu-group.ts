import THREE from "three";
import FloorMesh from "../view-objects/vr/floor-mesh";
import VRControllerBindings from "../vr-controller/vr-controller-bindings";
import VRController from "../vr-rendering/VRController";
import BaseMenu from "./base-menu";
import { DetachableMenu, isDetachableMenu } from "./detachable-menu";

export const MENU_DETACH_EVENT_TYPE = 'detach-menu';

export type MenuDetachedEvent = {
    type: typeof MENU_DETACH_EVENT_TYPE,
    menu: DetachableMenu
};

export default class MenuGroup extends THREE.Group {
    menus: BaseMenu[];
    controllerBindings: VRControllerBindings[];

    constructor() {
        super();
        this.menus = [];
        this.controllerBindings = [];
    }

    /**
     * The currently open menu or `null` if no menu is open.
     */
    get currentMenu(): BaseMenu|null {
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

        this.menus.push(menu);
        this.controllerBindings.push(menu.makeControllerBindings());
        this.add(menu);
        menu.onOpenMenu();

        // Hide or show the controllers ray.
        this.toggleControllerRay();
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
    closeMenu(detach: boolean = false) {
        const closedMenu = this.menus.pop();
        this.controllerBindings.pop();
        if (closedMenu && !detach) {
            closedMenu.onCloseMenu();
            this.remove(closedMenu);
        }

        // Show previously hidden menu if any.
        if (this.currentMenu) {
            this.add(this.currentMenu);
            this.currentMenu.onResumeMenu();
        }

        // Hide or show the controllers ray.
        this.toggleControllerRay();
    }

    detachMenu() {
        const menu = this.currentMenu;
        if (menu && isDetachableMenu(menu)) {
            this.closeMenu(true);

            // send detached menu
            this.dispatchEvent({
                type: MENU_DETACH_EVENT_TYPE, 
                menu
            });
        }
    }
}
