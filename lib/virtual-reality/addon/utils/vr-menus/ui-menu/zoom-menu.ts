import UiMenu, { UiMenuArgs } from '../ui-menu';
import THREE from 'three';

const CIRCLE_SEGMENTS = 48;

export type ZoomMenuArgs = UiMenuArgs & {
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  headsetCamera: THREE.PerspectiveCamera
};

export default class ZoomMenu extends UiMenu {

  target!: THREE.WebGLRenderTarget;

  lensCamera!: THREE.PerspectiveCamera;

  renderer!: THREE.WebGLRenderer;

  scene!: THREE.Scene;

  headsetCamera!: THREE.PerspectiveCamera;

  constructor({renderer, scene, headsetCamera, ...args}: ZoomMenuArgs) {
    super(args);
    this.renderer = renderer;
    this.scene = scene;
    this.headsetCamera = headsetCamera;

    const radius = this.resolution.width/512 * 0.15;

    this.target = new THREE.WebGLRenderTarget(this.resolution.width, this.resolution.height);

    const geometry = new THREE.CircleBufferGeometry(radius, CIRCLE_SEGMENTS);
    const material = new THREE.MeshBasicMaterial({map: this.target.texture});
    const lens = new THREE.Mesh(geometry, material);
    lens.position.z = 0.001;
    this.add(lens);

    const fov = 75, near = 0.1, far = 1000;
    const aspect = this.resolution.width / this.resolution.height;
    this.lensCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.add(this.lensCamera);

    this.redrawMenu();
  }

  makeBackgroundGeometry() {
    const radius = this.resolution.width/512 * 0.16;
    const geometry = new THREE.CircleGeometry(radius, CIRCLE_SEGMENTS);
    return geometry;
  }

  onUpdateMenu(delta: number) {
    this.renderLens();
    super.onUpdateMenu(delta);
  }

  private renderLens() {
      const oldTarget = this.renderer.getRenderTarget();
      const oldXREnabled = this.renderer.xr.enabled;
      this.renderer.setRenderTarget(this.target);
      this.renderer.xr.enabled = false;

      const headsetMatrix = this.headsetCamera.matrixWorld.clone();
      const headsetPosition = new THREE.Vector3();
      headsetPosition.setFromMatrixPosition(headsetMatrix);

      const lensPosition = new THREE.Vector3();
      lensPosition.setFromMatrixPosition(this.matrixWorld);

      const direction = new THREE.Vector3();
      direction.subVectors(this.worldToLocal(lensPosition), this.worldToLocal(headsetPosition));

      const rotationX = Math.atan2(direction.z, direction.y) + Math.PI/2;
      const rotationY = - Math.atan2(direction.z, direction.x) - Math.PI/2;
      this.lensCamera.rotation.set(rotationX, rotationY, 0);

      const zoomMax = 4;
      const zoomMin = 2;
      const maxZoomDistance = 1;
      const slope = (zoomMax - zoomMin) / maxZoomDistance;
      this.lensCamera.zoom = Math.max(zoomMax - slope * direction.length(), zoomMin);
      this.lensCamera.updateProjectionMatrix();

      this.renderer.render(this.scene, this.lensCamera);
      this.headsetCamera.matrixWorld.copy(headsetMatrix);

      this.renderer.setRenderTarget(oldTarget);
      this.renderer.xr.enabled = oldXREnabled;
  }
}
