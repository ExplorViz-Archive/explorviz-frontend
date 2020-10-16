import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';

export default class MainMenu extends BaseMenu {
  constructor(closeMenu: () => void, openCameraMenu: () => void, openLandscapeMenu: () => void,
    openSpectateMenu: () => void, openConnectionMenu: () => void, openAdvancedMenu: () => void) {
    super();

    this.back = closeMenu;
    this.opacity = 0.8;

    const title = new TextItem('Options', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const cameraButton = new TextbuttonItem('change_height', 'Change Camera', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    cameraButton.onTriggerDown = openCameraMenu;

    const landscapeButton = new TextbuttonItem('change_landscape_position', 'Move Landscape', {
      x: 100,
      y: 140,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    landscapeButton.onTriggerDown = openLandscapeMenu;

    const spectateButton = new TextbuttonItem('spectate', 'Spectate', {
      x: 100,
      y: 200,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    spectateButton.onTriggerDown = openSpectateMenu;

    const connectionButton = new TextbuttonItem('connection', 'Connection', {
      x: 100,
      y: 260,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    connectionButton.onTriggerDown = openConnectionMenu;

    const advancedButton = new TextbuttonItem('advanced', 'Advanced Options', {
      x: 100,
      y: 320,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    advancedButton.onTriggerDown = openAdvancedMenu;

    const exitButton = new TextbuttonItem('exit', 'Exit', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    exitButton.onTriggerDown = this.back;

    this.items.push(cameraButton, landscapeButton, spectateButton,
      connectionButton, advancedButton, exitButton);
    this.update();
  }
}
