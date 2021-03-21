import LocalVrUser, { ConnectionStatus } from "virtual-reality/services/local-vr-user";
import UiMenu, { UiMenuArgs } from "../../ui-menu";

export type ConnectionBaseMenuArgs = UiMenuArgs & {
  localUser: LocalVrUser,
};

export default abstract class ConnectionBaseMenu extends UiMenu {
  private initialConnectionStatus: ConnectionStatus;
  readonly localUser: LocalVrUser;

  constructor({ localUser, ...args }: ConnectionBaseMenuArgs) {
    super(args);
    this.localUser = localUser;
    this.initialConnectionStatus = this.localUser.connectionStatus;
  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);

    // When the connection status of the user changed, open the
    // corresponding connection menu.
    if (this.localUser.connectionStatus !== this.initialConnectionStatus) {
      this.menuGroup?.replaceMenu(this.menuFactory.buildConnectionMenu());
    }
  }
}
