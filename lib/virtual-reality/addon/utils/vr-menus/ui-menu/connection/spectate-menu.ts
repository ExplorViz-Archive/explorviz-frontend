import THREE from "three";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VRController from "virtual-reality/utils/vr-controller";
import RemoteVrUser from "virtual-reality/utils/vr-multi-user/remote-vr-user";
import TextItem from "../../items/text-item";
import DisableInputMenu from "../../ui-less-menu/disable-input-menu";
import UiMenu, { UiMenuArgs, DEFAULT_MENU_RESOLUTION, SIZE_RESOLUTION_FACTOR } from "../../ui-menu";

export type SpectateMenuArgs = UiMenuArgs & {
  remoteUser: RemoteVrUser,
  localUser: LocalVrUser
};

const HEIGHT = 60;

export default class SpectateMenu extends UiMenu {

  private localUser: LocalVrUser;
  private remoteUser: RemoteVrUser

  private disableInputMenu: DisableInputMenu;

  constructor({
    remoteUser, localUser,
    resolution = {
      width: DEFAULT_MENU_RESOLUTION,
      height: HEIGHT
    }, ...args
  }: SpectateMenuArgs) {
    super({resolution, ...args});

    this.localUser = localUser;
    this.remoteUser = remoteUser;

    this.disableInputMenu = this.menuFactory.buildDisableInputMenu();
  }

  /**
   * Creates the geometry of the background mesh.
   */
  makeBackgroundGeometry(): THREE.Geometry {
    const geometry = super.makeBackgroundGeometry();
    geometry.translate(0, (HEIGHT - DEFAULT_MENU_RESOLUTION) / 2 * SIZE_RESOLUTION_FACTOR, 0);
    return geometry;
  }

  onOpenMenu() {
    super.onOpenMenu();

    // Disable input for the other controller.
    const otherController = VRController.findController(this) === this.localUser.controller1 ? this.localUser.controller2 : this.localUser.controller1;
    otherController?.menuGroup?.openMenu(this.disableInputMenu);

    // Activate spectating.
    this.localUser.spectateUserService.activate(this.remoteUser);

    // Show spectating user.
    const text = new TextItem({
      text: 'Spectating ' + this.remoteUser.userName,
      color: '#ffffff',
      fontSize: 28,
      alignment: 'center',
      position: { x: 256, y: 20 },
    });
    this.items.push(text);

    this.redrawMenu();
  }

  onCloseMenu() {
    super.onCloseMenu();
    this.localUser.spectateUserService.deactivate();
    this.disableInputMenu?.closeMenu();
  }
}
