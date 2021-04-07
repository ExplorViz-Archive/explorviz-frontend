import SpectateUserService from "virtual-reality/services/spectate-user";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import RemoteVrUserService from "../../../../services/remote-vr-users";
import TextbuttonItem from "../../items/textbutton-item";
import TitleItem from "../../items/title-item";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

type OnlineMenuArgs = ConnectionBaseMenuArgs & {
  remoteUsers: RemoteVrUserService,
  spectateUserService: SpectateUserService
};

export default class OnlineMenu extends ConnectionBaseMenu {
  private remoteUsers: RemoteVrUserService;
  private remoteUserButtons: Map<string, TextbuttonItem>;
  private spectateUserService: SpectateUserService;
  private disconnectButton?: TextbuttonItem;

  constructor({ remoteUsers, spectateUserService, ...args }: OnlineMenuArgs) {
    super(args);

    this.remoteUsers = remoteUsers;
    this.remoteUserButtons = new Map<string, TextbuttonItem>();
    this.spectateUserService = spectateUserService;

    this.initMenu();
  }

  /**
   * It is possible to interact with this menu while spectating another user
   * such that spectator mode can be disabled.
   */
  get enableTriggerInSpectorMode() {
    return true;
  }

  private initMenu() {
    const users = Array.from(this.remoteUsers.getAllRemoteUsers());
    const title = new TitleItem({
      text: `Room ${this.localUser.currentRoomId}`,
      position: { x: 256, y: 20 },
    });
    this.items.push(title);

    this.disconnectButton = new TextbuttonItem({
      text: 'Disconnect',
      position: { x: 370, y: 13, },
      width: 115,
      height: 40,
      fontSize: 22,
      buttonColor: '#aaaaaa',
      textColor: '#ffffff',
      hoverColor: '#dc3b00',
      onTriggerDown: () => this.localUser.disconnect()
    });
    this.items.push(this.disconnectButton);

    const yOffset = 60;
    let yPos = 50 + yOffset;

    const localUserButton = new TextbuttonItem({
      text: this.localUser.userName + ' (you)',
      position: { x: 100, y: yPos },
      width: 316,
      height: 50,
      fontSize: 28,
    });
    this.items.push(localUserButton);
    this.thumbpadTargets.push(localUserButton);
    yPos += yOffset;

    users.forEach((user) => {
      const remoteUserButton = new TextbuttonItem({
        text: user.userName,
        position: { x: 100, y: yPos },
        width: 316,
        height: 50,
        fontSize: 28,
        onTriggerDown: () => this.menuGroup?.openMenu(this.menuFactory.buildSpectateMenu(user))
      });
      this.remoteUserButtons.set(user.userId, remoteUserButton)
      this.items.push(remoteUserButton);
      this.thumbpadTargets.push(remoteUserButton);
      yPos += yOffset;
    });
    this.items.push(title);

    this.redrawMenu();
  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);

    if (!this.arrayEquals(Array.from(this.remoteUsers.getAllRemoteUserIds()), Array.from(this.remoteUserButtons.keys()))) {
      this.items.clear();
      this.thumbpadTargets.clear();
      this.initMenu();
    }

  }

  private arrayEquals(a: string[], b: string[]) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  makeGripButtonBinding() {
    return new VRControllerButtonBinding('Disconnect', {
      onButtonDown: () => {
        this.disconnectButton?.enableHoverEffectByButton();
        this.redrawMenu();
      },
      onButtonUp: () => {
        this.localUser.disconnect();
        this.menuGroup?.replaceMenu(this.menuFactory.buildConnectionMenu());
      }
    });
  }

  onCloseMenu() {
    super.onCloseMenu();
    this.spectateUserService.deactivate();
  }
}
