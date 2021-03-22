import THREE from 'three';
import VrMessageReceiver from 'virtual-reality/services/vr-message-receiver';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import { isMenuDetachedResponse, MenuDetachedResponse } from 'virtual-reality/utils/vr-message/receivable/response/menu-detached';
import { isObjectClosedResponse, ObjectClosedResponse } from 'virtual-reality/utils/vr-message/receivable/response/object-closed';
import { DetachableMenu } from './detachable-menu';
import DetachedMenuGroup from './detached-menu-group';

export type DetachedMenuGroupContainerArgs = {
  closeButtonTexture: THREE.Texture,
  sender: VrMessageSender,
  receiver: VrMessageReceiver
};

/**
 * A group of detached menu groups. Each detached menu group contains a single
 * detached menu and its sub-menus.
 */
export default class DetachedMenuGroupContainer extends THREE.Group {
  private closeButtonTexture: THREE.Texture;
  private sender: VrMessageSender;
  private receiver: VrMessageReceiver;

  private detachedMenuGroupsById: Map<string, DetachedMenuGroup>;

  constructor({closeButtonTexture, sender, receiver}: DetachedMenuGroupContainerArgs) {
    super();
    this.closeButtonTexture = closeButtonTexture;
    this.sender = sender;
    this.receiver = receiver;

    this.detachedMenuGroupsById = new Map();
  }

  /**
   * Asks the backend for an id for the given menu and adds a detached menu
   * group for the menu. In offline mode, the menu is not assigned an id
   * but still detached.
   */
  addDetachedMenu(menu: DetachableMenu) {
    // Notify backend about detached menu.
    const nonce = this.sender.sendMenuDetached(menu);

    // Wait for backend to assign an id to the detached menu.
    this.receiver.awaitResponse({
      nonce,
      responseType: isMenuDetachedResponse,
      onResponse: (response: MenuDetachedResponse) => {
        this.addDetachedMenuWithId(menu, response.objectId);
      },
      onOffline: () => {
        this.addDetachedMenuWithId(menu, null);
      }
    });
  }

  /**
   * Adds a group for a detached menu to this container at the position and
   * with the same rotation and scale as the given menu.
   */
  addDetachedMenuWithId(menu: DetachableMenu, menuId: string | null) {
    // Put menu container at same position as menu.
    const group = new DetachedMenuGroup({
      menu, menuId, detachedMenuGroups: this
    });
    if (menuId) this.detachedMenuGroupsById.set(menuId, group);
    this.add(group);

    // Make detached menu closable.
    // Since the menu has been scaled already and is not scaled when it has its
    // normal size, the close icon does not have to correct for the menu's scale.
    const closeIcon = new CloseIcon({
      texture: this.closeButtonTexture,
      onClose: () => this.removeDetachedMenu(group),
      radius: 0.04
    });
    closeIcon.addToObject(group);

    // Apply same position, rotation and scale as detached menu.
    menu.getWorldPosition(group.position);
    menu.getWorldQuaternion(group.quaternion);
    this.scale.copy(menu.scale);

    // Reset position, rotation and scale of detached menu.
    menu.position.set(0, 0, 0);
    menu.rotation.set(0, 0, 0);
    menu.scale.set(1, 1, 1);
  }

  /**
   * Asks the backend to close the given detached menu. If the backend allows
   * the menu to be closed, the menu is removed.
   */
  removeDetachedMenu(detachedMenuGroup: DetachedMenuGroup): Promise<boolean> {
    // Remove the menu locally when it does not have an id (e.g., when we are
    // offline).
    const menuId = detachedMenuGroup.getGrabId();
    if (!menuId) {
      this.forceRemoveDetachedMenu(detachedMenuGroup);
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const nonce = this.sender.sendDetachedMenuClosed(menuId);
      this.receiver.awaitResponse({
        nonce,
        responseType: isObjectClosedResponse,
        onResponse: (response: ObjectClosedResponse) => {
          if (response.isSuccess) {
            this.forceRemoveDetachedMenu(detachedMenuGroup);
            resolve(true);
          }
        },
        onOffline: () => {
          this.forceRemoveDetachedMenu(detachedMenuGroup);
          resolve(true);
        }
      });
    });
  }

  /**
   * Removes the detached menu with the given id.
   */
  forceRemoveDetachedMenuWithId(menuId: string) {
    const detachedMenuGroup = this.detachedMenuGroupsById.get(menuId);
    if (detachedMenuGroup) this.forceRemoveDetachedMenu(detachedMenuGroup);
  }

  /**
   * Removes the given menu without asking the backend.
   */
  forceRemoveDetachedMenu(detachedMenuGroup: DetachedMenuGroup) {
    this.remove(detachedMenuGroup);

    // Remove association with the menu's id.
    const menuId = detachedMenuGroup.getGrabId();
    if (menuId) this.detachedMenuGroupsById.delete(menuId);
  }

  forceRemoveAllDetachedMenus() {
    this.remove(...this.children);
    this.detachedMenuGroupsById.clear();
  }
}
