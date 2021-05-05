import THREE from 'three';

export default class ArZoomHandler {
  private mainCamera: THREE.PerspectiveCamera;

  private zoomCamera: THREE.PerspectiveCamera;

  private zoomEnabled: boolean;

  private zoomIndicatorMesh: THREE.Mesh | undefined;

  private outerDiv: HTMLElement;

  constructor(camera: THREE.PerspectiveCamera, outerDiv: HTMLElement) {
    this.mainCamera = camera;
    this.zoomCamera = camera.clone();
    this.outerDiv = outerDiv;
    this.zoomEnabled = false;
  }

  enableZoom() {
    this.zoomEnabled = true;
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

    const times = 3; // scale of magnifier

    const offsetX = (this.outerDiv.clientWidth / 3) + sizeX / 3;
    const offsetY = (this.outerDiv.clientHeight / 3) + sizeY / 3;

    this.zoomCamera.setViewOffset(
      this.outerDiv.clientWidth,
      this.outerDiv.clientHeight,
      offsetX,
      offsetY,
      (this.outerDiv.clientWidth / 3) / times,
      (this.outerDiv.clientHeight / 3) / times,
    );

    renderer.setViewport(x, y, sizeX, sizeY);
    renderer.setScissor(x, y, sizeX, sizeY);
    renderer.render(scene, this.zoomCamera);
    renderer.setScissorTest(false);
  }

  addZoomIndicator() {
    if (this.zoomIndicatorMesh) return;

    const geometry = new THREE.PlaneGeometry(this.outerDiv.clientWidth / 50000,
      this.outerDiv.clientHeight / 30000, 30, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0xcad3eb });
    material.transparent = true;
    material.opacity = 0.15;
    const zoomBorderMesh = new THREE.Mesh(geometry, material);
    this.zoomIndicatorMesh = zoomBorderMesh;

    this.mainCamera.add(zoomBorderMesh);

    // Position just in front of camera
    zoomBorderMesh.position.z = -0.2;
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
