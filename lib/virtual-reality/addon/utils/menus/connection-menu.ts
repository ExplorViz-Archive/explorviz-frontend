import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import TextItem from './items/text-item';

export default class ConnectionMenu extends BaseMenu {
  constructor(openMainMenu: () => void) {
    super();

    const title = new TextItem('Connection', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = openMainMenu;

    this.items.push(backButton);
    this.update();
  }
}
