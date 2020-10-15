import TextItem from './items/text-item';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import CheckboxItem from './items/checkbox-item';

export default class AdvancedMenu extends BaseMenu {
  constructor(openMainMenu: () => void, isLefty: () => boolean, swapControls: () => void,
    resetAll: () => void) {
    super();

    this.opacity = 0.8;

    const textItem = new TextItem('Advanced Options', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(textItem);

    const leftyText = new TextItem('Lefty Mode', 'isLeftyText', '#ffffff', { x: 100, y: 148 }, 28, 'left');
    this.items.push(leftyText);

    const leftyCB = new CheckboxItem('isLefty', {
      x: 366,
      y: 126,
    }, 50, 50, '#ffc338', '#ffffff', '#00e5ff', 5, isLefty(), true);
    this.items.push(leftyCB);

    leftyCB.onTriggerDown = () => {
      swapControls();
      leftyCB.isChecked = isLefty();
    };

    const controlsButton = new TextbuttonItem('controls', 'Controls', {
      x: 100,
      y: 208,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    const resetAllButton = new TextbuttonItem('resetAll', 'Reset all', {
      x: 100,
      y: 266,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    resetAllButton.onTriggerDown = () => {
      resetAll();
    };

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = openMainMenu;

    this.items.push(controlsButton, resetAllButton, backButton);
    this.update();
  }
}
