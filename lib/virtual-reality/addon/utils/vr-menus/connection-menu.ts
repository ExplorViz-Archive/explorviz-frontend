import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import TextItem from './items/text-item';

export default class ConnectionMenu extends BaseMenu {
  statusText: TextItem;

  connectionButton: TextbuttonItem;

  constructor(openMainMenu: () => void, state: string, toggleConnection: (() => void)) {
    super();
    this.back = openMainMenu;

    const title = new TextItem('Connection', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const statusText = new TextItem('Status: ', 'status', '#ffffff', { x: 256, y: 140 }, 28, 'center');
    this.statusText = statusText;
    this.items.push(statusText);

    const connectionButton = new TextbuttonItem('connect', 'Connect', { x: 100, y: 186 }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.connectionButton = connectionButton;
    this.items.push(connectionButton);

    connectionButton.onTriggerDown = toggleConnection;

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = this.back;

    this.items.push(backButton);

    this.updateStatus(state);
    this.update();
  }

  updateStatus(state: string) {
    if (state === 'offline') {
      this.statusText.text = 'Status: offline';
      this.statusText.color = '#ff3a3a';
      this.connectionButton.text = 'Connect';
      // menu.setClickable('connect', true);
    } else if (state === 'connecting') {
      this.statusText.text = 'Status: connecting';
      this.statusText.color = '#ff9719';
      this.connectionButton.text = '...';
      // menu.setClickable('connect', false);
    } else if (state === 'online') {
      this.statusText.text = 'Status: online';
      this.statusText.color = '#3bba2a';
      this.connectionButton.text = 'Disconnect';
      // menu.setClickable('connect', true);
    }

    this.update();
  }
}
