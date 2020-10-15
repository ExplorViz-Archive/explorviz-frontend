import Service from '@ember/service';
import THREE from 'three';
import VRController, { controlMode } from 'virtual-reality/utils/VRController';

export type ConnectionStatus = 'disconnected'|'connecting'|'connected'|'spectating';

export default class LocalVrUser extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  userID!: string;

  state!: ConnectionStatus;

  color: THREE.Color|undefined;

  renderer: THREE.WebGLRenderer|undefined;

  camera: THREE.Camera|undefined;

  controller1: VRController|undefined;

  controller2: VRController|undefined;

  controllerMenus: THREE.Group|undefined;

  userGroup!: THREE.Group;

  get position() { return this.userGroup.position; }

  init() {
    super.init();

    this.userID = 'unknown';
    this.state = 'disconnected';
    this.userGroup = new THREE.Group();
  }

  addCamera(camera: THREE.Camera) {
    this.camera = camera;
    this.userGroup.add(camera);
  }

  updateControllers() {
    if (this.controller1) { this.controller1.update(); }
    if (this.controller2) { this.controller2.update(); }
  }

  swapControls() {
    if (!this.controller1 || !this.controller2) return;

    const controllers = [this.controller1, this.controller2];

    controllers.forEach((controller) => {
      // Remove attached visual indicators
      controller.removeRay();
      controller.removeTeleportArea();

      // Swap visual control indicators
      if (controller.control === controlMode.INTERACTION) {
        controller.control = controlMode.UTILITY;
        controller.addRay(new THREE.Color('blue'));

        if (this.controllerMenus) controller.raySpace.add(this.controllerMenus);
        controller.initTeleportArea();
      } else {
        controller.control = controlMode.INTERACTION;
        controller.addRay(new THREE.Color('red'));
      }
    });

    // Swap controls (callback functions)
    [this.controller1.eventCallbacks, this.controller2.eventCallbacks] = [this.controller2
      .eventCallbacks, this.controller1.eventCallbacks];
  }

  isLefty() {
    if (!this.controller1) return false;
    return this.controller1.isUtilityController;
  }

  getCameraDelta() {
    return this.userGroup.position;
  }

  changeCameraHeight(deltaY: number) {
    this.userGroup.position.add(new THREE.Vector3(0, deltaY, 0));
  }

  /*
   *  This method is used to adapt the users view to
   *  the new position
   */
  teleportToPosition(position: THREE.Vector3) {
    if (!this.renderer || !this.camera) return;

    const cameraWorldPos = new THREE.Vector3();
    const xrCamera = this.renderer.xr.getCamera(this.camera);
    xrCamera.getWorldPosition(cameraWorldPos);

    this.userGroup.position.x += position.x - cameraWorldPos.x;
    this.userGroup.position.z += position.z - cameraWorldPos.z;
  }

  /*
   * This method is used to adapt the users view to the initial position
   */
  resetPosition() {
    this.userGroup.position.set(0, 0, 0);
  }

  reset() {
    this.userID = 'unknown';
    this.state = 'disconnected';
    this.color = undefined;
    this.color = undefined;
    this.controller1 = undefined;
    this.controller2 = undefined;
    this.userGroup.children.forEach((child) => { this.userGroup.remove(child); });
  }
}

declare module '@ember/service' {
  interface Registry {
    'local-vr-user': LocalVrUser;
  }
}
