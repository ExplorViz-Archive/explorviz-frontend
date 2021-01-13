import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import TextItem from './items/text-item';
import RemoteVrUser from '../vr-multi-user/remote-vr-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import SpectateUser from 'virtual-reality/services/spectate-user';
import VRControllerButtonBinding from '../vr-controller/vr-controller-button-binding';

export default class MultiUserMenu extends BaseMenu {

    toggleConnection: (() => void)

    users: RemoteVrUser[];

    localUser: LocalVrUser;

    spectateUser: SpectateUser;

    remoteUserButtons: Map<string, TextbuttonItem> = new Map<string, TextbuttonItem>();

    idToRemoteVrUsers: Map<string, RemoteVrUser>;

    disconnectButton: TextbuttonItem | undefined;

    state : string;

    getRemoteUsers: (() => Map<string, RemoteVrUser>);


  constructor(toggleConnection: (() => void), localUser: LocalVrUser, spectateUser: SpectateUser, idToRemoteVrUsers : Map<string, RemoteVrUser>, getRemoteUsers: (() => Map<string, RemoteVrUser>)) {
    super();
    this.localUser = localUser;
    this.spectateUser = spectateUser;
    this.idToRemoteVrUsers = idToRemoteVrUsers;
    this.users = Array.from(this.idToRemoteVrUsers.values());
    this.toggleConnection = toggleConnection;
    this.state = this.localUser.state;
    this.initMenu();
    this.getRemoteUsers = getRemoteUsers;

  }

  initMenu() {

    if(this.state == 'offline') {
        this.initOfflineMenu('Connect');
    } else if (this.state == 'connecting') {
        this.initOfflineMenu('Connecting...');
    } else if (this.state == 'online') {
        this.initOnlineMenu();
    }
    this.update();
  }

  initOfflineMenu(buttonState: string) {
    const title = new TextItem('Multi User', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const connectButton = new TextbuttonItem('connect', buttonState, { x: 100, y: 186 }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.items.push(connectButton);
    this.thumbpadTargets.push(connectButton);
    connectButton.onTriggerDown = this.toggleConnection;
  }

  initOnlineMenu() {
    const title = new TextItem('Users (' + (this.users.length + 1) + ')', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    this.disconnectButton = new TextbuttonItem('disconnect', 'Disconnect', {x: 370,y: 13,}, 115, 40, 22, '#aaaaaa', '#ffffff', '#dc3b00');
    this.items.push(this.disconnectButton);
    this.disconnectButton.onTriggerDown = this.toggleConnection;

    const yOffset = 60;
    let yPos = 50 + yOffset;

    const localUserButton = new TextbuttonItem('local-user', this.localUser.userName + ' (you)', { x: 100, y: yPos }, 316, 50, 28, '#555555', '#ffc338', '#929292');
          this.items.push(localUserButton);
          this.thumbpadTargets.push(localUserButton);
          localUserButton.onTriggerDown = this.deactivateSpectate.bind(this);
          yPos += yOffset;

    this.users.forEach((user) => {
        if (user.state === 'online' && user.userName) {
          let text = user.userName;
          if (this.spectateUser.spectatedUser?.ID == user.ID) {
            text += ' (spectated)';
          }
          const remoteUserButton = new TextbuttonItem(user.ID, text, { x: 100, y: yPos }, 316, 50, 28, '#555555', '#ffc338', '#929292');
          this.remoteUserButtons.set(user.ID, remoteUserButton)
          this.items.push(remoteUserButton);
          this.thumbpadTargets.push(remoteUserButton);
          remoteUserButton.onTriggerDown = () => this.spectate(user);
          yPos += yOffset;
        }
      });

  }


  updateMenu() {
    const state = this.localUser.state;
    const idToRemoteVrUsers = this.getRemoteUsers();
    const users = Array.from(idToRemoteVrUsers.values()); 

    if (this.state != state || !this.arrayEquals(users, this.users)) {
      this.state = state;
      this.users = users;
      this.idToRemoteVrUsers = idToRemoteVrUsers;
      this.items.clear();
      this.thumbpadTargets.clear();
      this.initMenu();
    }
    
    super.onUpdateMenu();
  }

  arrayEquals(a: RemoteVrUser[], b: RemoteVrUser[]) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  deactivateSpectate() {
    if (this.spectateUser.isActive) {
      const id = this.spectateUser.spectatedUser?.ID
      if (id) {
        const remoteUserButton = this.remoteUserButtons.get(id);
        if (remoteUserButton) {
            remoteUserButton.text = this.idToRemoteVrUsers.get(id)?.userName || 'unknown';
        }
      }
      this.spectateUser.deactivate();
    }
    this.update();
  }

  spectate(remoteUser: RemoteVrUser) {
    this.deactivateSpectate();
    this.spectateUser.activate(remoteUser);
    const remoteUserButton = this.remoteUserButtons.get(remoteUser.ID);
    if (remoteUserButton) {
        remoteUserButton.text += ' (spectated)';
    }
    this.update();
  }

  makeGripButtonBinding() {
    return new VRControllerButtonBinding('Disconnect', {
      onButtonDown: () => {
        if (this.state == 'online') {

          this.toggleConnection();
          this.disconnectButton?.enableHoverEffectByButton();
          this.update()
        }
      },
      onButtonUp: () => {
        if (this.state == 'online') {
          this.disconnectButton?.resetHoverEffectByButton();
          this.update()
        }
      }
    });
  }

  onCloseMenu() {
    super.onCloseMenu();
    this.spectateUser.deactivate();
  }
}
