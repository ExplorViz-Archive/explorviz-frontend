import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import VRControllerButtonBinding from '../vr-controller/vr-controller-button-binding';

export type MainMenuEvents = {
  openCameraMenu: () => void,
  openAdvancedMenu: () => void,
  openMultiUserMenu?: () => void
};
export default class MainMenu extends BaseMenu {
  constructor(callbacks: MainMenuEvents) {
    super();

    this.opacity = 0.8;

    const title = new TextItem('Options', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const cameraButton = new TextbuttonItem('change_height', 'Change Camera', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(cameraButton);
    cameraButton.onTriggerDown = callbacks.openCameraMenu;


    const advancedButton = new TextbuttonItem('advanced', 'Advanced Options', {
      x: 100,
      y: 140,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(advancedButton);
    advancedButton.onTriggerDown = callbacks.openAdvancedMenu;

    const multiUserButton = new TextbuttonItem('multi-user', 'Multi User', {
      x: 100,
      y: 200,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(multiUserButton);
    multiUserButton.onTriggerDown = callbacks.openMultiUserMenu;

    const exitButton = new TextbuttonItem('exit', 'Exit', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(exitButton);
    exitButton.onTriggerDown = this.closeMenu.bind(this);

    this.update();
  }

  makeTriggerButtonBinding() {
    return new VRControllerButtonBinding('test', {
      onButtonDown: () => console.log("Pressed Trigger Down"),
      onButtonPress: () => console.log("Pressing Trigger"),
      onButtonUp: () => console.log("Released Trigger"),
    });
  }
}
