import TextItem from '../items/text-item';
import UiMenu from '../ui-menu';
import TextbuttonItem from '../items/textbutton-item';
import LocalVrUser from 'virtual-reality/services/local-vr-user';

export default class ResetMenu extends UiMenu {

  constructor({resetAll, localUser}: {
    resetAll: () => void, 
    localUser: LocalVrUser
  }) {
    super();

    const textItem = new TextItem('Reset', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(textItem);

    if (localUser.state != 'online') {

      const question = new TextItem('Reset state and position?', 'question', '#ffffff', { x: 100, y: 148 }, 28, 'left');
      this.items.push(question);

      const noButton = new TextbuttonItem('no', 'No', {
        x: 100 - 20,
        y: 266,
      }, 158, 50, 28, '#555555', '#ffc338', '#929292');

      const yesButton = new TextbuttonItem('yes', 'Yes', {
        x: 258 + 20,
        y: 266,
      }, 158, 50, 28, '#555555', '#ffc338', '#929292');

      yesButton.onTriggerDown = () => {
        resetAll();
        this.closeMenu()
      };

      noButton.onTriggerDown = () => this.closeMenu();

      this.items.push(yesButton, noButton);
      this.thumbpadTargets.push(noButton, yesButton);
      this.thumbpadAxis = 0;

    } else {

      const message = new TextItem('Not allowed when online.', 'message', '#ffffff', { x: 100, y: 148 }, 28, 'left');
      this.items.push(message);

    }

    this.redrawMenu();
  }
}
