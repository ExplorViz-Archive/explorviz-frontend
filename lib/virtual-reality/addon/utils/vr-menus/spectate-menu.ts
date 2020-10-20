import SpectateUser from 'virtual-reality/services/spectate-user';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import TextItem from './items/text-item';
import RectangleItem from './items/rectangle-item';
import ArrowbuttonItem from './items/arrowbutton-item';
import RemoteVrUser from '../vr-multi-user/remote-vr-user';

export default class SpectateMenu extends BaseMenu {
  idToRemoteVrUsers: Map<string, RemoteVrUser>;

  spectateUser: SpectateUser;

  spectateInfo: TextItem;

  constructor(openMainMenu: () => void, spectateUser: SpectateUser,
    idToRemoteVrUsers: Map<string, RemoteVrUser>) {
    super();

    this.idToRemoteVrUsers = idToRemoteVrUsers;
    this.spectateUser = spectateUser;

    this.back = () => { this.spectateUser.deactivate(); openMainMenu(); };

    const title = new TextItem('Spectate', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const rectangle = new RectangleItem('spectate_rectangle', { x: 106, y: 182 }, 304, 60, '#666666');
    this.items.push(rectangle);

    const leftArrow = new ArrowbuttonItem('previous_user', { x: 60, y: 182 }, 40, 60, '#ffc338', '#00e5ff', 'left');
    leftArrow.onTriggerDown = this.onPreviousUser.bind(this);
    this.items.push(leftArrow);

    const rightArrow = new ArrowbuttonItem('next_user', { x: 416, y: 182 }, 40, 60, '#ffc338', '#00e5ff', 'right');
    rightArrow.onTriggerDown = this.onNextUser.bind(this);
    this.items.push(rightArrow);

    const spectateInfo = new TextItem('Spectating off', 'spectating_user', '#ffffff', { x: 256, y: 202 }, 28, 'center');
    this.spectateInfo = spectateInfo;
    this.items.push(spectateInfo);

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = this.back;

    this.items.push(backButton);
    this.update();
  }

  getSortedUsers() {
    return Array.from(this.idToRemoteVrUsers.values()).sort((a, b) => ((a.ID > b.ID) ? 1 : -1));
  }

  onPreviousUser() {
    const users = this.getSortedUsers();

    if (users.length < 1) {
      this.spectateInfo.text = 'Spectating off';
      this.update();
      return;
    }

    // Active Spectating if previously inactive
    if (!this.spectateUser.spectatedUser) {
      this.spectateUser.activate(users[users.length - 1]);
      this.spectateInfo.text = users[users.length - 1].ID;
      this.update();
      return;
    }

    const spectatedUser = users.find((user) => user.ID === this.spectateUser.spectatedUser?.ID);

    if (spectatedUser && users.indexOf(spectatedUser) !== -1) {
      // Deactivate spectating if no further spectatable users are available
      if (users.indexOf(spectatedUser) === 0) {
        this.spectateUser.deactivate();
        this.spectateInfo.text = 'Spectating off';
      // Spectate previous user
      } else {
        this.spectateUser.activate(users[users.indexOf(spectatedUser) - 1]);
        this.spectateInfo.text = users[users.indexOf(spectatedUser) - 1].ID;
      }
    }

    this.update();
  }

  onNextUser() {
    const users = this.getSortedUsers();

    if (users.length < 1) { return; }

    // Active Spectating if previously inactive
    if (!this.spectateUser.spectatedUser) {
      this.spectateUser.activate(users[0]);
      this.spectateInfo.text = users[0].ID;
      this.update();
      return;
    }

    const spectatedUser = users.find((user) => user.ID === this.spectateUser.spectatedUser?.ID);

    if (spectatedUser && users.indexOf(spectatedUser) !== -1) {
      // Deactivate spectating if no further spectatable users are available
      if (users.indexOf(spectatedUser) === users.length - 1) {
        this.spectateUser.deactivate();
        this.spectateInfo.text = 'Spectating off';
      // Spectate previous user
      } else {
        this.spectateUser.activate(users[users.indexOf(spectatedUser) + 1]);
        this.spectateInfo.text = users[users.indexOf(spectatedUser) + 1].ID;
      }
    }

    this.update();
  }
}
