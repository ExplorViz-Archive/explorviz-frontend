import { DetachableMenu } from "./detachable-menu";
import MenuGroup, { MenuGroupArgs } from './menu-group';
import { GrabbableObject } from "./ui-less-menu/grab-menu";

export type DetachedMenuGroupArgs = MenuGroupArgs & {
  menu: DetachableMenu,
  menuId: string | null
};

/**
 * A menu group that contains a single detched menu and makes it grabbable.
 *
 * Since this is a menu group, the detached menu can still open sub menus.
 */
export default class DetachedMenuGroup extends MenuGroup implements GrabbableObject {
  private menuId: string | null;

  constructor({ menu, menuId, ...args }: DetachedMenuGroupArgs) {
    super(args);
    this.menuId = menuId;
    this.addMenu(menu);
  }

  getGrabId(): string | null {
    return this.menuId;
  }
}
