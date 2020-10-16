import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import RectangleItem from './items/rectangle-item';
import ArrowbuttonItem from './items/arrowbutton-item';
import CurvedArrowbuttonItem from './items/curved-arrowbutton-item';
import TextItem from './items/text-item';

export default class LandscapeMenu extends BaseMenu {
  constructor(openMainMenu: () => void,
    moveLandscape: (deltaX: number, deltaY: number, deltaZ: number) => void,
    rotateLandscape: (deltaX: number) => void, resetLandscape: () => void) {
    super();

    this.back = openMainMenu;

    const mvDist = 0.05;

    this.opacity = 0.8;

    const title = new TextItem('Landscape', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    const moveRectangle = new RectangleItem('move_rect', { x: 226, y: 246 }, 60, 60, '#eeeeee');
    this.items.push(moveRectangle);

    const moveLeftButton = new ArrowbuttonItem('move_left', {
      x: 160,
      y: 246,
    }, 40, 60, '#ffc338', '#00e5ff', 'left');

    moveLeftButton.onTriggerPressed = (value) => {
      moveLandscape(-mvDist * value, 0, 0);
    };

    const moveRightButton = new ArrowbuttonItem('move_right', {
      x: 312,
      y: 246,
    }, 40, 60, '#ffc338', '#00e5ff', 'right');

    moveRightButton.onTriggerPressed = (value) => {
      moveLandscape(mvDist * value, 0, 0);
    };

    const moveForwardButton = new ArrowbuttonItem('move_forward', {
      x: 226,
      y: 180,
    }, 60, 40, '#ffc338', '#00e5ff', 'up');

    moveForwardButton.onTriggerPressed = (value) => {
      moveLandscape(0, 0, -mvDist * value);
    };

    const moveBackwardButton = new ArrowbuttonItem('move_backward', {
      x: 226,
      y: 332,
    }, 60, 40, '#ffc338', '#00e5ff', 'down');

    moveBackwardButton.onTriggerPressed = (value) => {
      moveLandscape(0, 0, mvDist * value);
    };

    this.items.push(moveLeftButton, moveRightButton, moveForwardButton, moveBackwardButton);

    const moveRectangle2 = new RectangleItem('move_rect', { x: 70, y: 178 }, 60, 4, '#eeeeee');
    this.items.push(moveRectangle2);

    const moveUpwardButton = new ArrowbuttonItem('move_upward', {
      x: 80,
      y: 120,
    }, 40, 40, '#ffc338', '#00e5ff', 'up');

    moveUpwardButton.onTriggerPressed = (value: number) => {
      moveLandscape(0, mvDist * value, 0);
    };

    const moveDownwardButton = new ArrowbuttonItem('move_downward', {
      x: 80,
      y: 200,
    }, 40, 40, '#ffc338', '#00e5ff', 'down');

    moveDownwardButton.onTriggerPressed = (value) => {
      moveLandscape(0, -mvDist * value, 0);
    };

    this.items.push(moveUpwardButton, moveDownwardButton);

    const rotateRightButton = new CurvedArrowbuttonItem('rotate_right', {
      x: 390,
      y: 120,
    }, 60, '#ffc338', '#00e5ff', 'right');

    rotateRightButton.onTriggerPressed = (value) => {
      rotateLandscape(mvDist * value);
    };

    const rotateLeftButton = new CurvedArrowbuttonItem('rotate_left', {
      x: 390,
      y: 200,
    }, 60, '#ffc338', '#00e5ff', 'left');

    rotateLeftButton.onTriggerPressed = (value) => {
      rotateLandscape(-mvDist * value);
    };

    this.items.push(rotateRightButton, rotateLeftButton);

    const resetButton = new TextbuttonItem('reset', 'Reset', {
      x: 420,
      y: 13,
    }, 65, 40, 22, '#aaaaaa', '#ffffff', '#dc3b00');

    resetButton.onTriggerDown = resetLandscape;

    this.items.push(resetButton);

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');

    backButton.onTriggerDown = this.back;

    this.items.push(backButton);
    this.update();
  }
}
