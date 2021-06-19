import Component from '@glimmer/component';
import { action } from '@ember/object';

interface PrimaryInteractionButtonArgs {
  handlePrimaryCrosshairInteraction(): void
  openAllComponents(): void
}

export default class PrimaryInteractionButton extends Component<PrimaryInteractionButtonArgs> {
  @action
  addLongPressListener(button: HTMLButtonElement) {
    function checkForLongPress(start: number) {
      const end = Date.now();
      const diff = (end - start) + 1;
      const minLongPressTime = 500;

      if (diff > minLongPressTime) {
        const longPress = new CustomEvent('longPress');
        document.body.dispatchEvent(longPress);
      }
    }

    let start: number;

    document.body.addEventListener('longPress', () => {
      this.args.openAllComponents();
    });

    // Touch listener
    button.ontouchstart = () => {
      start = Date.now();

      button.ontouchend = () => {
        checkForLongPress(start);
      };
    };

    // Mouse listener
    button.onmousedown = () => {
      start = Date.now();

      button.onmouseup = () => {
        checkForLongPress(start);
      };
    };
  }
}
