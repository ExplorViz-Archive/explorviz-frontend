import LocalVrUser from 'virtual-reality/services/local-vr-user';
import THREE from 'three';
import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import RectangleItem from './items/rectangle-item';
import RemoteVrUser from '../vr-multi-user/remote-vr-user';

export default class UserListMenu extends BaseMenu {
  constructor(localUser: LocalVrUser, users: RemoteVrUser[], userName: string) {
    super({ width: 256, height: 256 });

    const titleBackground = new RectangleItem('delimeter', { x: 0, y: 0 }, 256, 33, '#777777');
    this.items.push(titleBackground);

    const title = new TextItem('Users', 'title', '#ffffff', { x: 128, y: 10 }, 20, 'center');
    this.items.push(title);

    const connectText = new TextItem('Connected', 'connected', '#ffffff', { x: 40, y: 50 }, 14, 'left');
    this.items.push(connectText);

    const yOffset = 20;
    let yPos = 50 + yOffset;

    if (localUser.isOnline && !localUser.isSpectating) {
      const color = localUser.color ? localUser.color : new THREE.Color();
      const localUserText = new TextItem(userName, 'localUser', `#${color.getHexString()}`, { x: 50, y: yPos }, 12, 'left');
      this.items.push(localUserText);
      yPos += yOffset;
    }

    users.forEach((user) => {
      if (user.state === 'online' && user.userName) {
        const remoteUserText = new TextItem(user.userName, user.userName, `#${user.color.getHexString()}`, { x: 50, y: yPos }, 12, 'left');
        this.items.push(remoteUserText);
        yPos += yOffset;
      }
    });

    yPos += yOffset;

    const spectateText = new TextItem('Spectating', 'spectating', '#ffffff', { x: 40, y: yPos }, 14, 'left');
    this.items.push(spectateText);

    yPos += yOffset;

    users.forEach((user) => {
      if (user.state === 'spectating' && user.userName) {
        const remoteUserText = new TextItem(user.userName, user.userName, '#adadad', { x: 50, y: yPos }, 12, 'left');
        this.items.push(remoteUserText);
        yPos += yOffset;
      }
    });

    this.position.z = -0.5;

    this.update();
  }
}
