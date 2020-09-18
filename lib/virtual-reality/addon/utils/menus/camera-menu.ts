import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import ArrowbuttonItem from './items/arrowbutton-item';

export default class CameraMenu extends BaseMenu {
  constructor(openMainMenu: () => void, userPosition: THREE.Vector3) {
    super();

    this.opacity = 0.8;

    const textItem = new TextItem(userPosition.y.toFixed(2), 'camera_height', '#ffffff', { x: 256, y: 202 }, 28, 'center');
    this.items.push(textItem);

    const heightDownButton = new ArrowbuttonItem('height_down', {
      x: 100,
      y: 182,
    }, 50, 60, '#ffc338', '#00e5ff', 'down', {
      onTriggerPressed: () => {
        userPosition.y -= 0.05;
        textItem.text = userPosition.y.toFixed(2);
        this.update();
      },
    });

    const heightUpButton = new ArrowbuttonItem('height_up', {
      x: 366,
      y: 182,
    }, 50, 60, '#ffc338', '#00e5ff', 'up', {
      onTriggerPressed: () => {
        userPosition.y += 0.05;
        textItem.text = userPosition.y.toFixed(2);
        this.update();
      },
    });

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: openMainMenu,
    });

    this.items.push(heightDownButton, heightUpButton, backButton);
    this.update();
  }
}
