import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Metric } from 'heatmap/services/heatmap-configuration';

interface HeatmapInfoArgs {
  metrics: Metric[];
  updateMetric(metric: Metric): void;
  selectedMetric: Metric | null;
}

export default class HeatmapInfo extends Component<HeatmapInfoArgs> {
  divElement: HTMLElement | undefined;

  @action
  setupDragElement(element: HTMLElement) {
    this.divElement = element;

    this.dragElement();
    this.setupPosition();
  }

  setupPosition() {
    if (!this.divElement) return;

    const containerDiv = this.divElement.parentElement as HTMLElement;

    this.divElement.style.top = '100px';
    this.divElement.style.left = `${containerDiv.clientWidth - this.divElement.clientWidth - 15}px`;
  }

  dragElement() {
    if (!this.divElement) return;

    const elmnt = this.divElement;

    let xOffset = 0; let yOffset = 0; let inputX = 0; let inputY = 0;

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
