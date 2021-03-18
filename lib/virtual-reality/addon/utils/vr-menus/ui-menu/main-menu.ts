import TextItem from '../items/text-item';
import UiMenu from '../ui-menu';
import TextbuttonItem from '../items/textbutton-item';
import VrMenuFactoryService from 'virtual-reality/services/vr-menu-factory';

export default class MainMenu extends UiMenu {
  constructor({menuFactory}: {
    menuFactory: VrMenuFactoryService
  }) {
    super();

    const title = new TextItem('Main Menu', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const connectionButton = new TextbuttonItem('connect', 'Connection', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(connectionButton);
    connectionButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(menuFactory.buildConnectionMenu());
    };
    this.thumbpadTargets.push(connectionButton);

    const settingsButton = new TextbuttonItem('settings', 'Settings', {
      x: 100,
      y: 140,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(settingsButton);
    settingsButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(menuFactory.buildSettingsMenu());
    };
    this.thumbpadTargets.push(settingsButton);

    const resetButton = new TextbuttonItem('reset', 'Reset', {
      x: 100,
      y: 200,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(resetButton);
    resetButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(menuFactory.buildResetMenu());
    };
    this.thumbpadTargets.push(resetButton);

    this.redrawMenu();
  }
}
