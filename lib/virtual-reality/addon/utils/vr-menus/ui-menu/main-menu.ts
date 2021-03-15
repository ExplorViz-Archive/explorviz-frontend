import TextItem from '../items/text-item';
import UiMenu from '../ui-menu';
import TextbuttonItem from '../items/textbutton-item';

export type MainMenuEvents = {
  openMultiUserMenu?: () => void,
  openSettingsMenu: () => void,
  openResetMenu: () => void
};

export default class MainMenu extends UiMenu {
  constructor(callbacks: MainMenuEvents) {
    super();

    const title = new TextItem('Main Menu', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const multiUserButton = new TextbuttonItem('multi-user', 'Multi User', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(multiUserButton);
    multiUserButton.onTriggerDown = callbacks.openMultiUserMenu;
    this.thumbpadTargets.push(multiUserButton);

    const settingsButton = new TextbuttonItem('settings', 'Settings', {
      x: 100,
      y: 140,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(settingsButton);
    settingsButton.onTriggerDown = callbacks.openSettingsMenu;
    this.thumbpadTargets.push(settingsButton);

    const resetButton = new TextbuttonItem('reset', 'Reset', {
      x: 100,
      y: 200,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(resetButton);
    resetButton.onTriggerDown = callbacks.openResetMenu;
    this.thumbpadTargets.push(resetButton);

    this.redrawMenu();
  }
}
