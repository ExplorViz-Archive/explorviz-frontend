import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';

export default class SettingsMenu extends BaseMenu {

  constructor(openCameraMenu: () => void) {
    super();

    const textItem = new TextItem('Settings', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(textItem);


    const cameraButton = new TextbuttonItem('change_height', 'Change Camera', {
      x: 100,
      y: 80,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(cameraButton);
    this.thumbpadTargets.push(cameraButton);
    cameraButton.onTriggerDown = openCameraMenu;

    this.update();
  }

}
