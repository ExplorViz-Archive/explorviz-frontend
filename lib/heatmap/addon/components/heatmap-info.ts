import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Metric } from 'heatmap/services/heatmap-configuration';

interface HeatmapInfoArgs {
  metrics: Metric[];
  updateMetric(metric: Metric): void;
  selectedMetric: Metric|null;
}

export default class HeatmapInfo extends Component<HeatmapInfoArgs> {
  divElement: HTMLElement | undefined;

  @action
  setupDragElement(element: HTMLElement) {
    this.divElement = element;
    this.dragElement(element);

    this.setupPosition(element);
  }

  setupPosition(heatmapInfoDiv: HTMLElement) {
    const containerDiv = heatmapInfoDiv.parentElement as HTMLElement;

    heatmapInfoDiv.style.top = '100px';
    heatmapInfoDiv.style.left = `${containerDiv.clientWidth - heatmapInfoDiv.clientWidth - 15}px`;
  }

  dragElement(elmnt: HTMLElement) {
    let xOffset = 0; let yOffset = 0; let inputX = 0; let inputY = 0;

    function moveElement(clientX: number, clientY: number) {
      // Calculate cursor position
      xOffset = inputX - clientX;
      yOffset = inputY - clientY;
      inputX = clientX;
      inputY = clientY;

      // Calculate heatmap info position
      const minX = elmnt.offsetLeft - xOffset;
      const maxX = minX + elmnt.clientWidth;
      const minY = elmnt.offsetTop - yOffset;
      const maxY = minY + elmnt.clientHeight;

      // Set the element's new position:
      if (minX >= 0 && maxX <= window.innerWidth) {
        elmnt.style.left = `${minX}px`;
      }

      if (minY >= 0 && maxY <= window.innerHeight) {
        elmnt.style.top = `${minY}px`;
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
