import THREE from 'three';
import VrMessageReceiver from 'virtual-reality/services/vr-message-receiver';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import CloseIcon, { CloseIconTextures } from 'virtual-reality/utils/view-objects/vr/close-icon';
import { isMenuDetachedResponse, MenuDetachedResponse } from 'virtual-reality/utils/vr-message/receivable/response/menu-detached';
import { isObjectClosedResponse, ObjectClosedResponse } from 'virtual-reality/utils/vr-message/receivable/response/object-closed';
import { DetachableMenu } from './detachable-menu';
import DetachedMenuGroup from './detached-menu-group';

export type DetachedMenuGroupContainerArgs = {
  closeIconTextures: CloseIconTextures,
  sender: VrMessageSender,
  receiver: VrMessageReceiver
};

/**
 * A group of detached menu groups. Each detached menu group contains a single
 * detached menu and its sub-menus.
 */
export default class DetachedMenuGroupContainer extends THREE.Group {
  private closeIconTextures: CloseIconTextures;
  private sender: VrMessageSender;
  private receiver: VrMessageReceiver;

  private detachedMenuGroups: Set<DetachedMenuGroup>;
  private detachedMenuGroupsById: Map<string, DetachedMenuGroup>;

  constructor({closeIconTextures, sender, receiver}: DetachedMenuGroupContainerArgs) {
    super();
    this.closeIconTextures = closeIconTextures;
    this.sender = sender;
    this.receiver = receiver;

    this.detachedMenuGroups = new Set();
    this.detachedMenuGroupsById = new Map();
  }

  /**
   * Gets the menu groups of all detached menus.
   */
  getDetachedMenus(): DetachedMenuGroup[] {
    return Array.from(this.detachedMenuGroups);
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
   * Updates all detached menus.
   */
  updateDetachedMenus(delta: number) {
    for (let detachedMenuGroup of this.detachedMenuGroups) {
      detachedMenuGroup.updateMenu(delta);
    }
  }

  /**
   * Adds a group for a detached menu to this container at the position and
   * with the same rotation and scale as the given menu.
   */
  addDetachedMenuWithId(menu: DetachableMenu, menuId: string | null) {
    // Remember the position, rotation and scale of the detached menu.
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    menu.getWorldPosition(position);
    menu.getWorldQuaternion(quaternion);
    scale.copy(menu.scale);

    // Reset position, rotation and scale of detached menu.
    menu.position.set(0, 0, 0);
    menu.rotation.set(0, 0, 0);
    menu.scale.set(1, 1, 1);

    // Create menu group for the detached menu.
    const detachedMenuGroup = new DetachedMenuGroup({
      menu, menuId, detachedMenuGroups: this
    });
    this.detachedMenuGroups.add(detachedMenuGroup);
    if (menuId) this.detachedMenuGroupsById.set(menuId, detachedMenuGroup);
    this.add(detachedMenuGroup);

    // Make detached menu closable.
    // Since the menu has been scaled already and is not scaled when it has its
    // normal size, the close icon does not have to correct for the menu's scale.
    const closeIcon = new CloseIcon({
      textures: this.closeIconTextures,
      onClose: () => this.removeDetachedMenu(detachedMenuGroup),
      radius: 0.04
    });
    closeIcon.addToObject(detachedMenuGroup);

    // Apply same position, rotation and scale as detached menu.
    detachedMenuGroup.position.copy(position);
    detachedMenuGroup.quaternion.copy(quaternion);
    detachedMenuGroup.scale.copy(scale);
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
          if (response.isSuccess) this.forceRemoveDetachedMenu(detachedMenuGroup);
          resolve(response.isSuccess);
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
    // Notify the detached menu that it has been closed.
    detachedMenuGroup.closeAllMenus();

    // Remove the 3D object of the menu.
    this.remove(detachedMenuGroup);

    // Stop updating the menu.
    this.detachedMenuGroups.delete(detachedMenuGroup);

    // Remove association with the menu's id.
    const menuId = detachedMenuGroup.getGrabId();
    if (menuId) this.detachedMenuGroupsById.delete(menuId);
  }

  forceRemoveAllDetachedMenus() {
    // Notify all detached menus that they have been closed.
    for (let detachedMenuGroup of this.detachedMenuGroups) {
      detachedMenuGroup.closeAllMenus();
    }

    this.remove(...this.children);
    this.detachedMenuGroups.clear();
    this.detachedMenuGroupsById.clear();
  }
}
