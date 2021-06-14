import THREE from 'three';

export default class ArZoomHandler {
  private mainCamera: THREE.PerspectiveCamera;

  private zoomCamera: THREE.PerspectiveCamera;

  zoomEnabled: boolean;

  private zoomIndicatorMesh: THREE.Mesh | undefined;

  private outerDiv: HTMLElement;

  private renderer: THREE.WebGLRenderer;

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer,
    outerDiv: HTMLElement) {
    this.mainCamera = camera;
    this.renderer = renderer;
    this.zoomCamera = camera.clone();
    this.outerDiv = outerDiv;
    this.zoomEnabled = false;
  }

  enableZoom() {
    this.zoomEnabled = true;
    this.zoomCamera = this.mainCamera.clone();
    this.addZoomIndicator();
  }

  disableZoom() {
    this.zoomEnabled = false;
    this.removeZoomIndicator();
  }

  renderZoomCamera(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
    if (!this.zoomEnabled) return;

    renderer.setScissorTest(true);
    const fullSize = renderer.getSize(new THREE.Vector2());

    const sizeX = fullSize.x / 3; // size of magnifier
    const sizeY = fullSize.y / 3;
    const x = this.outerDiv.clientWidth / 2 - sizeX / 2;
    const y = this.outerDiv.clientHeight / 2 - sizeY / 2;

    const zoomScale = 3;

    const offsetX = (this.outerDiv.clientWidth / 3) + sizeX / 3;
    const offsetY = (this.outerDiv.clientHeight / 3) + sizeY / 3;

    this.zoomCamera.setViewOffset(
      fullSize.x,
      fullSize.y,
      offsetX,
      offsetY,
      (fullSize.x / 3) / zoomScale,
      (fullSize.y / 3) / zoomScale,
    );

    renderer.setViewport(x, y, sizeX, sizeY);
    renderer.setScissor(x, y, sizeX, sizeY);

    renderer.render(scene, this.zoomCamera);

    // Prepare renderer to render full scene again
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, this.outerDiv.clientWidth, this.outerDiv.clientHeight);
  }

  addZoomIndicator() {
    if (this.zoomIndicatorMesh) return;

    const fullSize = this.renderer.getSize(new THREE.Vector2());

    const sizeX = fullSize.x / 3; // size of magnifier
    const sizeY = fullSize.y / 3;

    const geometry = new THREE.PlaneGeometry(sizeX / 15000,
      sizeY / 15000, 30, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0xcad3eb });
    material.transparent = true;
    material.opacity = 0.15;
    const zoomBorderMesh = new THREE.Mesh(geometry, material);
    this.zoomIndicatorMesh = zoomBorderMesh;

    this.mainCamera.add(zoomBorderMesh);

    // Position just in front of camera
    zoomBorderMesh.position.z = -0.1;
  }

  removeZoomIndicator() {
    if (this.zoomIndicatorMesh) {
      this.mainCamera.remove(this.zoomIndicatorMesh);

      if (this.zoomIndicatorMesh.material instanceof THREE.Material) {
        this.zoomIndicatorMesh.material.dispose();
      }
      if (this.zoomIndicatorMesh.geometry instanceof THREE.Geometry) {
        this.zoomIndicatorMesh.geometry.dispose();
      }

      this.zoomIndicatorMesh = undefined;
    }
  }
}
