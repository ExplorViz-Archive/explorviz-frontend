import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import CheckboxItem from './items/checkbox-item';
import TextbuttonItem from './items/textbutton-item';

export default class SettingsMenu extends BaseMenu {
  isLefty: boolean;

  constructor(openCameraMenu: () => void, toggleLeftyMode: () => void, userIsLefty: boolean) {
    super();

    this.isLefty = userIsLefty;

    const textItem = new TextItem('Settings', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(textItem);

    const leftyText = new TextItem('Lefty Mode', 'isLeftyText', '#ffffff', { x: 100, y: 148 }, 28, 'left');
    this.items.push(leftyText);

    const leftyCB = new CheckboxItem('isLefty', {
      x: 366,
      y: 126,
    }, 50, 50, '#ffc338', '#ffffff', '#00e5ff', 5, this.isLefty, true);
    this.items.push(leftyCB);
    this.thumbpadTargets.push(leftyCB);

    leftyCB.onTriggerDown = () => {
      toggleLeftyMode();
      this.isLefty = !this.isLefty;
      leftyCB.isChecked = this.isLefty;
      this.update();
    };

    const cameraButton = new TextbuttonItem('change_height', 'Change Camera', {
      x: 100,
      y: 220,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    this.items.push(cameraButton);
    this.thumbpadTargets.push(cameraButton);
    cameraButton.onTriggerDown = openCameraMenu;

    this.update();
  }

}
