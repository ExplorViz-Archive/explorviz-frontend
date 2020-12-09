import THREE from "three";
import VRControllerBindings from "../vr-controller/vr-controller-bindings";
import BaseMenu from "./base-menu";

export default class MenuGroup extends THREE.Group {
    menus: BaseMenu[];
    controllerBindings: VRControllerBindings[];

    constructor() {
        super();
        this.menus = [];
        this.controllerBindings = [];
    }

    get currentMenu(): BaseMenu|undefined {
        if (this.menus.length === 0) return undefined;
        return this.menus[this.menus.length - 1];
    }

    openMenu(menu: BaseMenu) {
        // Hide current menu before opening the new menu.
        if (this.currentMenu) {
            this.remove(this.currentMenu);
        }

        this.menus.push(menu);
        this.controllerBindings.push(menu.makeControllerBindings());
        this.add(menu);
    }

    closeMenu() {
        var closedMenu = this.menus.pop();
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
    }
}