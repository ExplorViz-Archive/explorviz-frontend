import Component from '@glimmer/component';

interface Args {
  disableBackToLandscape: Boolean
}

export default class DataSelection extends Component<Args> {
  constructor(owner: any, args: Args) {
    super(owner, args);

    if (this.args.disableBackToLandscape) {
      this.setBackButtonVisible(false);
    }
  }

  willDestroy() {
    this.setBackButtonVisible(true);
  }

  /**
   * Disables the 'Back to Landscape' button. Can be useful for small screen if the
   * data selection can interfere with the Back to Landscape' button.
   *
   * @param visible Determines visibility of the 'Back to Landscape' button
   */
  setBackButtonVisible(visible: boolean) {
    const button = document.getElementById('backToLandscapeButton');
    if (button instanceof HTMLButtonElement) {
      if (visible) {
        button.disabled = false;
        button.style.display = 'inline-block';
      } else {
        button.disabled = true;
        button.style.display = 'none';
      }
    }
  }
}
