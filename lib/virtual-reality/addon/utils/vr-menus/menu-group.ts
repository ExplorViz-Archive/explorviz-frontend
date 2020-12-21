import THREE from "three";
import VRControllerBindings from "../vr-controller/vr-controller-bindings";
import VRController from "../vr-rendering/VRController";
import BaseMenu from "./base-menu";

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
        let controller = VRController.findController(this);
        if (controller) {
            let visible = !this.currentMenu || this.currentMenu.enableControllerRay;
            if (controller.ray) controller.ray.visible = visible;
            if (controller.teleportArea) controller.teleportArea.visible = visible;
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
            this.remove(this.currentMenu);
        }

        this.menus.push(menu);
        this.controllerBindings.push(menu.makeControllerBindings());
        this.add(menu);

        // Hide or show the controllers ray.
        this.toggleControllerRay();
    }

    /**
     * Closes the currently open menu.
     *
     * If a previously open menu was hidden by {@link MenuGroup.openMenu},
     * it is shown again by adding the mesh back to this group.
     */
    closeMenu() {
        let closedMenu = this.menus.pop();
        this.controllerBindings.pop();
        if (closedMenu) {
            closedMenu.onClose();
            this.remove(closedMenu);
            closedMenu.disposeRecursively();
        }

        // Show previously hidden menu if any.
        if (this.currentMenu) {
            this.add(this.currentMenu);
        }

        // Hide or show the controllers ray.
        this.toggleControllerRay();
    }
}
