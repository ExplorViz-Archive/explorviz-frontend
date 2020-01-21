import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  popupData: {
    mouseX: number,
    mouseY: number
  };
}

export default class PopupCoordinator extends Component<Args> {

  @action
  setPopupPosition(popoverDiv: HTMLDivElement) {
    let popupData = this.args.popupData;

    // Sorrounding div for position calculations
    const containerDiv = popoverDiv.parentElement as HTMLElement;

    let popoverHeight = popoverDiv.clientHeight;
    let popoverWidth = popoverDiv.clientWidth;

    let containerWidth = containerDiv.clientWidth;

    if(popoverHeight === undefined || popoverWidth === undefined || containerWidth === undefined)
      return;

    const popupTopOffset = popoverHeight + 10;
    const popupLeftOffset = popoverWidth / 2;

    let popupTopPosition = popupData.mouseY - popupTopOffset;
    let popupLeftPosition = popupData.mouseX - popupLeftOffset;

    // Prevent popup positioning on top of rendering canvas => 
    // position under mouse cursor
    if (popupTopPosition < 0) {
      popupTopPosition = popupData.mouseY + 35;
    }

    // Prevent popup positioning right(outside) of rendering canvas => 
    // position at right edge of canvas
    if (popupLeftPosition + popoverWidth > containerWidth) {
      popupLeftPosition = containerWidth - popoverWidth - 5;
    }

    // Prevent popup positioning left(outside) of rendering canvas => 
    // position at left edge of canvas
    if (popupLeftPosition < 0) {
      popupLeftPosition = 0;
    }

    // Set popup position
    popoverDiv.style.top = popupTopPosition + 'px';
    popoverDiv.style.left = popupLeftPosition + 'px';
  }
}