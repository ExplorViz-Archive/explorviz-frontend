import Service, { inject as service } from '@ember/service';
import SettingsMenu from 'explorviz-frontend/utils/vr-menus/advanced-menu';
import MainMenu from 'explorviz-frontend/utils/vr-menus/main-menu';
import LocalVrUser from "virtual-reality/services/local-vr-user";
import ConnectionBaseMenu from 'virtual-reality/utils/vr-menus/ui-menu/connection/base';
import JoinMenu from "virtual-reality/utils/vr-menus/ui-menu/connection/join-menu";
import ResetMenu from 'virtual-reality/utils/vr-menus/ui-menu/reset-menu';
import ConnectingMenu from "../utils/vr-menus/ui-menu/connection/connecting-menu";
import OfflineMenu from "../utils/vr-menus/ui-menu/connection/offline-menu";
import OnlineMenu from "../utils/vr-menus/ui-menu/connection/online-menu";

export default class VrMenuFactoryService extends Service {
    @service('local-vr-user')
    private localUser!: LocalVrUser;

    buildMainMenu(): MainMenu {
        return new MainMenu({menuFactory: this});
    }

    buildSettingsMenu(): SettingsMenu {
        // @ts-ignore
        return new SettingsMenu(/* TODO */);
    }

    buildResetMenu(): ResetMenu {
        // @ts-ignore
        return new ResetMenu(/* TODO */);
    }

    buildConnectionMenu(): ConnectionBaseMenu {
        switch (this.localUser.connectionStatus) {
            case 'offline': return this.buildOfflineMenu();
            case 'connecting': return this.buildConnectingMenu();
            case 'online': return this.buildOnlineMenu();
        }
    }

    buildOfflineMenu(): OfflineMenu {
        return new OfflineMenu({
            localUser: this.localUser,
            menuFactory: this,
        });
    }

    buildConnectingMenu(): ConnectingMenu {
        return new ConnectingMenu({
            localUser: this.localUser,
            menuFactory: this,
        });
    }

    buildOnlineMenu(): OnlineMenu {
        return new OnlineMenu({
            localUser: this.localUser,
            menuFactory: this,
        });
    }

    buildJoinMenu(): JoinMenu {
        return new JoinMenu({
            localUser: this.localUser,
            menuFactory: this,
        });
    }
}

declare module '@ember/service' {
  interface Registry {
    'vr-menu-factory': VrMenuFactoryService;
  }
}
