import THREE from "three";
import CloseIcon from "../view-objects/vr/close-icon";
import VRControllerBindings from "../vr-controller/vr-controller-bindings";
import VRController from "../vr-rendering/VRController";
import BaseMenu from "./base-menu";
import { GrabbableObject } from "./pseudo-menu/grab-menu";

export interface DetachableMenu extends BaseMenu {
    getDetachId(): string;
}

export function isDetachableMenu(menu: BaseMenu): menu is DetachableMenu {
    return 'getDetachId' in menu;
}

export type MenuDistachedEvent = {type: string, menuContainer: GrabbableMenuContainer};

export class GrabbableMenuContainer extends THREE.Group implements GrabbableObject {
    grabId: string;
    menu: DetachableMenu;

    constructor(menu: DetachableMenu, grabId: string) {
        super();
        this.menu = menu;
        this.grabId = grabId;
    }
    getGrabId(): string {
        return this.grabId;
    }

}

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
        let closedMenu = this.menus.pop();
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
        let menu = this.currentMenu;
        if (menu && isDetachableMenu(menu)) {
            
            this.closeMenu(true);

            // send detached menu
            let menuContainer = new GrabbableMenuContainer(menu, menu.getDetachId());
            this.dispatchEvent({type: 'detachMenu', menuContainer: menuContainer});
        }
    }
}
