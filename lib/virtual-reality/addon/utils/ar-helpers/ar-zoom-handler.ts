import THREE from 'three';
import ArSettings from 'virtual-reality/services/ar-settings';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ArZoomHandler {
  @service('ar-settings')
  arSettings!: ArSettings;

  private mainCamera: THREE.PerspectiveCamera;

  private zoomCamera: THREE.PerspectiveCamera;

  @tracked
  zoomEnabled: boolean;

  private outerDiv: HTMLElement;

  constructor(camera: THREE.PerspectiveCamera, outerDiv: HTMLElement, arSettings: ArSettings) {
    this.mainCamera = camera;
    this.zoomCamera = camera.clone();
    this.outerDiv = outerDiv;
    this.arSettings = arSettings;
    this.zoomEnabled = false;
  }

  enableZoom() {
    this.zoomEnabled = true;
    this.zoomCamera = this.mainCamera.clone();
  }

  disableZoom() {
    this.zoomEnabled = false;
  }

  renderZoomCamera(renderer: THREE.WebGLRenderer, scene: THREE.Scene,
    resize: (outerDiv: HTMLElement) => void) {
    if (!this.zoomEnabled) return;

    renderer.setScissorTest(true);
    const fullSize = renderer.getSize(new THREE.Vector2());

    const { zoomLevel } = this.arSettings;

    const sizeX = fullSize.x / 3; // size of magnifier
    const sizeY = fullSize.y / 3;
    const x = fullSize.x / 2 - sizeX / 2;
    const y = fullSize.y / 2 - sizeY / 2;

    const offsetX = sizeX + sizeX / 2 - (sizeX / zoomLevel) / 2;
    const offsetY = sizeY + sizeY / 2 - (sizeY / zoomLevel) / 2;

    this.zoomCamera.setViewOffset(
      fullSize.x,
      fullSize.y,
      offsetX,
      offsetY,
      sizeX / zoomLevel,
      sizeY / zoomLevel,
    );

    this.zoomCamera.aspect = 2;

    renderer.setViewport(x, y, sizeX, sizeY);
    renderer.setScissor(x, y, sizeX, sizeY);

    renderer.render(scene, this.zoomCamera);

    // Prepare renderer to render full scene again
    renderer.setScissorTest(false);

    renderer.setViewport(0, 0, this.outerDiv.clientWidth, this.outerDiv.clientHeight);

    resize(this.outerDiv);
  }
}
