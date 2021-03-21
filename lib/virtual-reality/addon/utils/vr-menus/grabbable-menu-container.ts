import THREE from "three";
import { DetachableMenu } from "./detachable-menu";
import { GrabbableObject } from "./ui-less-menu/grab-menu";

export class GrabbableMenuContainer extends THREE.Group implements GrabbableObject {
  private grabId: string | null;
  private menu: DetachableMenu;

  constructor(menu: DetachableMenu, grabId: string | null) {
    super();
    this.menu = menu;
    this.grabId = grabId;

    // Apply same position, rotation and scale as contained menu.
    this.menu.getWorldPosition(this.position);
    this.menu.getWorldQuaternion(this.quaternion);
    this.scale.copy(this.menu.scale);

    // Reset position, rotation and scale of contained menu.
    this.menu.position.set(0, 0, 0);
    this.menu.rotation.set(0, 0, 0);
    this.menu.scale.set(1, 1, 1);
    this.add(this.menu);
  }

  getGrabId(): string | null {
    return this.grabId;
  }
}
