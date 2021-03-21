import TextItem from '../items/text-item';
import TextbuttonItem from '../items/textbutton-item';
import UiMenu, { UiMenuArgs } from '../ui-menu';

export default class MainMenu extends UiMenu {
  constructor(args: UiMenuArgs) {
    super(args);

    const title = new TextItem('Main Menu', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const connectionButton = new TextbuttonItem('connect', 'Connection', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(connectionButton);
    connectionButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(this.menuFactory.buildConnectionMenu());
    };
    this.thumbpadTargets.push(connectionButton);

    const settingsButton = new TextbuttonItem('settings', 'Settings', {
      x: 100,
      y: 140,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(settingsButton);
    settingsButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(this.menuFactory.buildSettingsMenu());
    };
    this.thumbpadTargets.push(settingsButton);

    const resetButton = new TextbuttonItem('reset', 'Reset', {
      x: 100,
      y: 200,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(resetButton);
    resetButton.onTriggerDown = () => {
      this.menuGroup?.openMenu(this.menuFactory.buildResetMenu());
    };
    this.thumbpadTargets.push(resetButton);

    this.redrawMenu();
  }
}
