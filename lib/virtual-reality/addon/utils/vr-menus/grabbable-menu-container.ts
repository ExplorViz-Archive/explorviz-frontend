import THREE from "three";
import { GrabbableObject } from "./ui-less-menu/grab-menu";
import { DetachableMenu } from "./detachable-menu";

export class GrabbableMenuContainer extends THREE.Group implements GrabbableObject {
    grabId: string|null;
    menu: DetachableMenu;

    constructor(menu: DetachableMenu, grabId: string|null) {
        super();
        this.menu = menu;
        this.grabId = grabId;
      
        // Apply same position, rotation and scale as contained menu.
        menu.getWorldPosition(this.position);
        menu.getWorldQuaternion(this.quaternion);
        this.scale.copy(menu.scale);

        // Reset position, rotation and scale of contained menu.
        menu.position.set(0, 0, 0);
        menu.rotation.set(0, 0, 0);
        menu.scale.set(1, 1, 1);
        this.add(menu);
    }

    getGrabId(): string|null {
        return this.grabId;
    }
}