import LocalVrUser from "virtual-reality/services/local-vr-user";
import VRController from "virtual-reality/utils/vr-controller";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import RemoteVrUser from "virtual-reality/utils/vr-multi-user/remote-vr-user";
import TextItem from "../../items/text-item";
import DisableInputMenu from "../../ui-less-menu/disable-input-menu";
import UiMenu, { UiMenuArgs } from "../../ui-menu";

export type SpectateMenuArgs = UiMenuArgs & {
  remoteUser: RemoteVrUser,
  localUser: LocalVrUser
};

export default class SpectateMenu extends UiMenu {

  private localUser: LocalVrUser;

  private disableInputMenu: DisableInputMenu | undefined

  constructor({ remoteUser, localUser, ...args }: SpectateMenuArgs) {
    super({
      menuFactory: args.menuFactory,
      resolution: {
        width: 512,
        height: 30
      }
    });

    this.localUser = localUser;

    // disable input for the other controller
    const otherController = VRController.findController(this) == this.localUser.controller1 ? this.localUser.controller2 : this.localUser.controller1;
    if (otherController) {
      this.disableInputMenu = this.menuFactory.buildDisableInputMenu();
      otherController.menuGroup?.openMenu(this.disableInputMenu);
    }
    
    // activate spectate
    this.localUser.spectateUserService.activate(remoteUser);

    // show spectating user
    const text = new TextItem('Spectating ' + remoteUser.userName, 'spectating', '#ffffff', { x: 256, y: 15 }, 28, 'center');
    this.items.push(text);


    this.redrawMenu();
  }

  makeMenuButtonBinding(): VRControllerButtonBinding<undefined> | undefined {
    return new VRControllerButtonBinding('Back', {
      onButtonDown: () => {
        this.localUser.spectateUserService.deactivate();
        this.disableInputMenu?.closeMenu();
        this.closeMenu();
      }
    });
  }



}
