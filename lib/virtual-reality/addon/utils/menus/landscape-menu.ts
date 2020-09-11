import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import BaseMenu from './base-menu';
import TextbuttonItem from './items/textbutton-item';
import RectangleItem from './items/rectangle-item';

export default class LandscapeMenu extends BaseMenu {
  constructor(openMainMenu: () => void, landscapeObject3D: LandscapeObject3D) {
    super();

    this.opacity = 0.8;

    const moveRectangle = new RectangleItem('move_rect', { x: 226, y: 246 }, 60, 60, '#eeeeee');
    this.items.push(moveRectangle);

    const moveLeftButton = new TextbuttonItem('move_left', '<', {
      x: 160,
      y: 246,
    }, 40, 60, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.x -= 0.05;
      },
    });

    const moveRightButton = new TextbuttonItem('move_right', '>', {
      x: 312,
      y: 246,
    }, 40, 60, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.x += 0.05;
      },
    });

    const moveForwardButton = new TextbuttonItem('move_forward', '>', {
      x: 226,
      y: 180,
    }, 60, 40, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.z -= 0.05;
      },
    });

    const moveBackwardButton = new TextbuttonItem('move_backward', '>', {
      x: 226,
      y: 332,
    }, 60, 40, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.z += 0.05;
      },
    });

    this.items.push(moveLeftButton, moveRightButton, moveForwardButton, moveBackwardButton);

    const moveRectangle2 = new RectangleItem('move_rect', { x: 70, y: 178 }, 60, 4, '#eeeeee');
    this.items.push(moveRectangle2);

    const moveUpwardButton = new TextbuttonItem('move_upward', '>', {
      x: 80,
      y: 120,
    }, 40, 40, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.y += 0.05;
      },
    });

    const moveDownwardButton = new TextbuttonItem('move_downward', '>', {
      x: 80,
      y: 200,
    }, 40, 40, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.position.y -= 0.05;
      },
    });

    this.items.push(moveUpwardButton, moveDownwardButton);

    const rotateRightButton = new TextbuttonItem('rotate_right', '>', {
      x: 390,
      y: 120,
    }, 60, 60, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.rotation.x += 0.05;
      },
    });

    const rotateLeftButton = new TextbuttonItem('rotate_left', '>', {
      x: 390,
      y: 200,
    }, 60, 60, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: () => {
        landscapeObject3D.rotation.x -= 0.05;
      },
    });

    this.items.push(rotateRightButton, rotateLeftButton);

    const resetButton = new TextbuttonItem('reset', 'Reset', {
      x: 420,
      y: 13,
    }, 65, 40, 22, '#aaaaaa', '#ffffff', '#dc3b00', {
      onTriggerPressed: () => {
      },
    });

    this.items.push(resetButton);

    const backButton = new TextbuttonItem('back', 'Back', {
      x: 100,
      y: 402,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292', {
      onTriggerPressed: openMainMenu,
    });

    this.items.push(backButton);
    this.update();
  }
}
