import LocalVrUser, { ConnectionStatus } from "virtual-reality/services/local-vr-user";
import VrMenuFactoryService from "virtual-reality/services/vr-menu-factory";
import UiMenu from "../../ui-menu";

export default abstract class ConnectionBaseMenu extends UiMenu {
    private initialConnectionStatus: ConnectionStatus;
    
    readonly localUser: LocalVrUser;
    readonly menuFactory: VrMenuFactoryService;

    constructor({localUser, menuFactory}: {
        localUser: LocalVrUser,
        menuFactory: VrMenuFactoryService,
    }) {
        super();
        this.localUser = localUser;
        this.menuFactory = menuFactory;
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