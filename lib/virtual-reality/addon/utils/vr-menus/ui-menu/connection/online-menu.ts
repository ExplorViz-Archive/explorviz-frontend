import TextItem from "../../items/text-item";
import TextbuttonItem from "../../items/textbutton-item";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import RemoteVrUser from "virtual-reality/utils/vr-multi-user/remote-vr-user";
import ConnectionBaseMenu, { ConnectionBaseMenuArgs } from "./base";

type OnlineMenuArgs = ConnectionBaseMenuArgs & {
  idToRemoteVrUser: Map<string, RemoteVrUser>
};

export default class OnlineMenu extends ConnectionBaseMenu {
    private idToRemoteVrUser: Map<string, RemoteVrUser>;
    private remoteUserButtons: Map<string, TextbuttonItem>;

    constructor({idToRemoteVrUser, ...args}: OnlineMenuArgs) {
        super(args);

        this.idToRemoteVrUser = idToRemoteVrUser;
        this.remoteUserButtons = new Map<string, TextbuttonItem>();

        this.initMenu();
    }

    private initMenu() {
        const users = Array.from(this.idToRemoteVrUser.values());
        const title = new TextItem(`Room ${this.localUser.currentRoomId}`, 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
        this.items.push(title);

        const disconnectButton = new TextbuttonItem('disconnect', 'Disconnect', { x: 370, y: 13, }, 115, 40, 22, '#aaaaaa', '#ffffff', '#dc3b00');
        this.items.push(disconnectButton);
        disconnectButton.onTriggerDown = () => this.localUser.disconnect();

        const yOffset = 60;
        let yPos = 50 + yOffset;

        const localUserButton = new TextbuttonItem('local-user', this.localUser.userName + ' (you)', { x: 100, y: yPos }, 316, 50, 28, '#555555', '#ffc338', '#929292');
        this.items.push(localUserButton);
        this.thumbpadTargets.push(localUserButton);
        localUserButton.onTriggerDown = () => this.deactivateSpectate();
        yPos += yOffset;

        users.forEach((user) => {
            if (user.state === 'online' && user.userName) {
                let text = user.userName;
                if (this.localUser.spectateUserService.spectatedUser?.userId == user.userId) {
                    text += ' (spectated)';
                }
                const remoteUserButton = new TextbuttonItem(user.userId, text, { x: 100, y: yPos }, 316, 50, 28, '#555555', '#ffc338', '#929292');
                this.remoteUserButtons.set(user.userId, remoteUserButton)
                this.items.push(remoteUserButton);
                this.thumbpadTargets.push(remoteUserButton);
                remoteUserButton.onTriggerDown = () => this.spectate(user);
                yPos += yOffset;
            }
        });
        this.items.push(title);

        this.redrawMenu();
    }

    onUpdateMenu(delta: number) {
        super.onUpdateMenu(delta);

        if (!this.arrayEquals(Array.from(this.idToRemoteVrUser.keys()), Array.from(this.remoteUserButtons.keys()))) {
            this.items.clear();
            this.thumbpadTargets.clear();
            this.initMenu();
        }

    }

    private arrayEquals(a: string[], b: string[]) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
    }

    private deactivateSpectate() {
        if (this.localUser.spectateUserService.isActive) {
            const id = this.localUser.spectateUserService.spectatedUser?.userId
            if (id) {
                const remoteUserButton = this.remoteUserButtons.get(id);
                if (remoteUserButton) {
                    remoteUserButton.text = this.idToRemoteVrUser.get(id)?.userName || 'unknown';
                }
            }
            this.localUser.spectateUserService.deactivate();
        }
        this.redrawMenu();
    }

    private spectate(remoteUser: RemoteVrUser) {
        this.deactivateSpectate();
        this.localUser.spectateUserService.activate(remoteUser);
        const remoteUserButton = this.remoteUserButtons.get(remoteUser.userId);
        if (remoteUserButton) {
            remoteUserButton.text += ' (spectated)';
        }
        this.redrawMenu();
    }

    makeGripButtonBinding() {
        return new VRControllerButtonBinding('Disconnect', {
            onButtonDown: () => {
                this.localUser.disconnect();
                this.menuGroup?.replaceMenu(this.menuFactory.buildConnectionMenu());
            }
        });
    }

    onCloseMenu() {
        super.onCloseMenu();
        this.localUser.spectateUserService.deactivate();
    }
}
