import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import TextItem from './items/text-item';
import ImageItem from './items/image-item';

export default class ControlsMenu extends BaseMenu {
  constructor(openAdvancedMenu: () => void, gamepadId: string, isLefty: () => boolean) {
    super({ width: 2 * 512, height: 542 });

    const title = new TextItem('Controls', 'title', '#ffffff', { x: 512, y: 20 }, 50, 'center');
    this.items.push(title);

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 33,
      y: 20,
    }, 150, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = openAdvancedMenu;
    this.items.push(backButton);

    const image = new Image();
    image.src = ControlsMenu.getControlsImageUrl(gamepadId, isLefty());

    image.onload = () => {
      const imageItem = new ImageItem('controlsImg', image, { x: 33, y: 99 }, 1024 - 2 * 33, 512 - 99);
      this.items.push(imageItem);
      this.update();
    };

    this.update();
  }

  /*
   * This method is used to get url for the image corresponding to the connected controller
   */
  static getControlsImageUrl(gamepadId: string, isLefty: boolean) {
    if (gamepadId.startsWith('Oculus')) {
      if (isLefty) {
        return 'images/oculus_controls_lefty.png';
      }
      return 'images/oculus_controls_righty.png';
    }

    // Display HTC Vive controls by default
    if (isLefty) {
      return 'images/vive_controls_lefty.png';
    }
    return 'images/vive_controls_righty.png';
  }
}
