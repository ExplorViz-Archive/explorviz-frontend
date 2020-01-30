import { action } from '@ember/object';
import Component from '@glimmer/component';

interface IArgs {
  popupData: {
    mouseX: number,
    mouseY: number,
  };
}

export default class PopupCoordinator extends Component<IArgs> {
  @action
  setPopupPosition(popoverDiv: HTMLDivElement) {
    const { popupData } = this.args;

    // Sorrounding div for position calculations
    const containerDiv = popoverDiv.parentElement as HTMLElement;

    const popoverHeight = popoverDiv.clientHeight;
    const popoverWidth = popoverDiv.clientWidth;

    const containerWidth = containerDiv.clientWidth;

    if (popoverHeight === undefined || popoverWidth === undefined || containerWidth === undefined) {
      return;
    }

    const popupTopOffset = popoverHeight + 10;
    const popupLeftOffset = popoverWidth / 2;

    let popupTopPosition = popupData.mouseY - popupTopOffset;
    let popupLeftPosition = popupData.mouseX - popupLeftOffset;

    // Prevent popup positioning on top of rendering canvas =>
    // position under mouse cursor
    if (popupTopPosition < 0) {
      const approximateMouseHeight = 35;
      popupTopPosition = popupData.mouseY + approximateMouseHeight;
    }

    // Prevent popup positioning right(outside) of rendering canvas =>
    // position at right edge of canvas
    if (popupLeftPosition + popoverWidth > containerWidth) {
      const extraPopupMarginFromAtBottom = 5;
      popupLeftPosition = containerWidth - popoverWidth - extraPopupMarginFromAtBottom;
    }

    // Prevent popup positioning left(outside) of rendering canvas =>
    // position at left edge of canvas
    if (popupLeftPosition < 0) {
      popupLeftPosition = 0;
    }

    // Set popup position
    /* eslint-disable no-param-reassign */
    popoverDiv.style.top = `${popupTopPosition}px`;
    popoverDiv.style.left = `${popupLeftPosition}px`;
  }
}
