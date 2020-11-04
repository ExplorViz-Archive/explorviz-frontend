import BaseMenu from './base-menu';
import THREE from 'three';

export default class ZoomMenu extends BaseMenu {

  target!: THREE.WebGLRenderTarget;

  lensCamera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  scene!: THREE.Scene;

  headsetCamera!: THREE.PerspectiveCamera;

  static readonly segments = 48;

  constructor(back: () => void, renderer: THREE.WebGLRenderer, scene: THREE.Scene, headsetCamera: THREE.PerspectiveCamera) {
    super();

    this.back = back;
    this.renderer = renderer;
    this.scene = scene;
    this.headsetCamera = headsetCamera;

    const radius = this.resolution.width/512 * 0.15;

    this.target = new THREE.WebGLRenderTarget(this.resolution.width, this.resolution.height);
    
    const geometry = new THREE.CircleBufferGeometry(radius, ZoomMenu.segments);
    const material = new THREE.MeshPhongMaterial({map: this.target.texture});
    const lens = new THREE.Mesh(geometry, material);
    lens.position.z = 0.001;
    this.add(lens);

    const fov = 75, near = 0.1, far = 1000;
    const aspect = this.resolution.width / this.resolution.height;
    this.lensCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.lensCamera.zoom = 2.0;
    this.lensCamera.updateProjectionMatrix();
    this.add(this.lensCamera);

    this.update();
  }

  initGeometry() {
    const radius = this.resolution.width/512 * 0.16;
    this.geometry = new THREE.CircleGeometry(radius, ZoomMenu.segments);
  }

  renderLens() {
      const oldTarget = this.renderer.getRenderTarget();
      const oldXREnabled = this.renderer.xr.enabled;
      this.renderer.setRenderTarget(this.target);
      this.renderer.xr.enabled = false;

      const headsetPosition = new THREE.Vector3();
      headsetPosition.setFromMatrixPosition(this.headsetCamera.matrixWorld);

      const lensPosition = new THREE.Vector3();
      lensPosition.setFromMatrixPosition(this.lensCamera.matrixWorld);

      const targetPosition = new THREE.Vector3();
      targetPosition.subVectors(lensPosition, headsetPosition).add(lensPosition);

      this.lensCamera.lookAt(this.lensCamera.worldToLocal(targetPosition));

      this.renderer.render(this.scene, this.lensCamera);
      this.renderer.setRenderTarget(oldTarget);
      this.renderer.xr.enabled = oldXREnabled;
    
  }

}