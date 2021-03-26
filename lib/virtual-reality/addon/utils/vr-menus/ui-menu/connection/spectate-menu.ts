import THREE from "three";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VRController from "virtual-reality/utils/vr-controller";
import RemoteVrUser from "virtual-reality/utils/vr-multi-user/remote-vr-user";
import TextItem from "../../items/text-item";
import DisableInputMenu from "../../ui-less-menu/disable-input-menu";
import UiMenu, { UiMenuArgs } from "../../ui-menu";

export type SpectateMenuArgs = UiMenuArgs & {
  remoteUser: RemoteVrUser,
  localUser: LocalVrUser
};

const DEFAULT_MENU_RESOLUTION = 512;

const SIZE_RESOLUTION_FACTOR = 1 / 512 * 0.3

const HEIGHT = 60;

export default class SpectateMenu extends UiMenu {

  private localUser: LocalVrUser;

  private disableInputMenu: DisableInputMenu | undefined;

  private remoteUser: RemoteVrUser

  constructor({ remoteUser, localUser, ...args }: SpectateMenuArgs) {
    super({
      menuFactory: args.menuFactory,
      resolution: {
        width: DEFAULT_MENU_RESOLUTION,
        height: HEIGHT
      }
    });

    this.localUser = localUser;
    this.remoteUser = remoteUser;
  }

  onCloseMenu() {
    super.onCloseMenu();
    this.localUser.spectateUserService.deactivate();
    this.disableInputMenu?.closeMenu();
  }

  /**
   * Creates the geometry of the background mesh.
   */
  makeBackgroundGeometry(): THREE.Geometry {
    const geometry = super.makeBackgroundGeometry();
    geometry.translate(0,  (HEIGHT - DEFAULT_MENU_RESOLUTION) / 2 * SIZE_RESOLUTION_FACTOR, 0);
    return geometry;
  }

  onOpenMenu() {
    super.onOpenMenu();
    
        // disable input for the other controller
        const otherController = VRController.findController(this) === this.localUser.controller1 ? this.localUser.controller2 : this.localUser.controller1;
        if (otherController) {
          console.log('other controller found', otherController)
          this.disableInputMenu = this.menuFactory.buildDisableInputMenu();
          otherController.menuGroup?.openMenu(this.disableInputMenu);
        }
        
        // activate spectate
        this.localUser.spectateUserService.activate(this.remoteUser);
    
        // show spectating user
        const text = new TextItem('Spectating ' + this.remoteUser.userName, 'spectating', '#ffffff', { x: 256, y: 20 }, 28, 'center');
        this.items.push(text);
    
        this.redrawMenu();
  }

}
