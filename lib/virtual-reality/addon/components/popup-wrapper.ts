import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Application, Class, Package } from 'explorviz-frontend/utils/landscape-schemes/structure-data';

interface PopupWrapperArgs {
  popupData: {
    id: number,
    isPinned: boolean,
    posX: number,
    posY: number,
    entity: Node | Application | Package | Class
  };
  keepPopupOpen(id: number): void
  setPopupPosition(id: number, posX: number, posY: number): void
  closePopup(id: number): void
}

export default class PopupWrapper extends Component<PopupWrapperArgs> {
  isPinned = false;

  divElement: HTMLElement | undefined;

  @action
  setupDragElement(element: HTMLElement) {
    this.divElement = element;
    this.dragElement(element);

    this.setupPosition(element);
  }

  @action
  keepPopupOpen() {
    if (!this.args.popupData.isPinned) {
      this.args.keepPopupOpen(this.args.popupData.id);
    }
  }

  @action
  closePopup() {
    this.args.closePopup(this.args.popupData.id);
  }

  setupPosition(popoverDiv: HTMLElement) {
    const { popupData } = this.args;

    // Set to previously stored position
    if (popupData.isPinned) {
      popoverDiv.style.left = `${popupData.posX}px`;
      popoverDiv.style.top = `${popupData.posY}px`;
      return;
    }

    // Sorrounding div for position calculations
    const containerDiv = popoverDiv.parentElement as HTMLElement;

    const popoverHeight = popoverDiv.clientHeight;
    const popoverWidth = popoverDiv.clientWidth;

    const containerWidth = containerDiv.clientWidth;

    if (popoverHeight === undefined || popoverWidth === undefined || containerWidth === undefined) {
      return;
    }

    const popupTopOffset = popoverHeight + 40;
    const popupLeftOffset = popoverWidth / 2;

    let popupTopPosition = containerDiv.clientHeight / 2 - popupTopOffset;
    let popupLeftPosition = containerDiv.clientWidth / 2 - popupLeftOffset;

    // Prevent popup positioning on top of rendering canvas =>
    // position under mouse cursor
    if (popupTopPosition < 0) {
      const approximateMouseHeight = 35;
      popupTopPosition = popupData.posY + approximateMouseHeight;
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

  dragElement(elmnt: HTMLElement) {
    let xOffset = 0; let yOffset = 0; let inputX = 0; let inputY = 0;

    const self = this;

    function xPositionInsideWindow(minX: number, maxX: number) {
      return minX >= 0 && maxX <= window.innerWidth;
    }

    function yPositionInsideWindow(minY: number, maxY: number) {
      return minY >= 0 && maxY <= window.innerHeight;
    }

    function moveElement(clientX: number, clientY: number) {
      // Calculate cursor position
      xOffset = inputX - clientX;
      yOffset = inputY - clientY;
      inputX = clientX;
      inputY = clientY;

      // Calculation of old and new coordinates
      const oldMinX = elmnt.offsetLeft;
      const oldMaxX = oldMinX + elmnt.clientWidth;
      const oldMinY = elmnt.offsetTop;
      const oldMaxY = oldMinY + elmnt.clientHeight;

      const newMinX = oldMinX - xOffset;
      const newMaxX = newMinX + elmnt.clientWidth;
      const newMinY = oldMinY - yOffset;
      const newMaxY = newMinY + elmnt.clientHeight;

      // Set the element's new position:
      if (!xPositionInsideWindow(oldMinX, oldMaxX) || xPositionInsideWindow(newMinX, newMaxX)) {
        elmnt.style.left = `${newMinX}px`;
      }

      if (!yPositionInsideWindow(oldMinY, oldMaxY) || yPositionInsideWindow(newMinY, newMaxY)) {
        elmnt.style.top = `${newMinY}px`;
      }

      self.args.setPopupPosition(self.args.popupData.id, newMinX, newMinY);
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchcancel = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }

    function elementMouseDrag(e: MouseEvent) {
      const event = e || window.event;
      event.preventDefault();

      // Calculate cursor position
      moveElement(e.clientX, e.clientY);
    }

    function elementTouchDrag(e: TouchEvent) {
      const event = e || window.event;
      event.preventDefault();

      if (event.targetTouches.length < 1) {
        closeDragElement();
      } else {
        const { clientX } = event.targetTouches[0];
        const { clientY } = event.targetTouches[0];

        moveElement(clientX, clientY);
      }
    }

    function dragMouseDown(e: MouseEvent) {
      const event = e || window.event;
      event.preventDefault();
      // Get the mouse cursor position at startup:
      inputX = e.clientX;
      inputY = e.clientY;
      document.onmouseup = closeDragElement;
      // Call a function whenever the cursor moves:
      document.onmousemove = elementMouseDrag;
    }

    function dragTouchDown(e: TouchEvent) {
      const event = e || window.event;
      event.preventDefault();

      if (event.targetTouches.length > 0) {
        inputX = event.targetTouches[0].clientX;
        inputY = event.targetTouches[0].clientY;

        document.ontouchcancel = closeDragElement;
        document.ontouchend = closeDragElement;

        document.ontouchmove = elementTouchDrag;
      }
    }

    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragTouchDown;
  }
}
