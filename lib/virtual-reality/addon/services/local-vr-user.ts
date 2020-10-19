import Service, { inject as service } from '@ember/service';

import THREE from 'three';
import VRController, { controlMode } from 'virtual-reality/utils/vr-rendering/VRController';
import DS from 'ember-data';
import ConnectionMenu from 'virtual-reality/utils/vr-menus/connection-menu';
import WebSocket from './web-socket';

export type ConnectionStatus = 'offline'|'connecting'|'online'|'spectating';

export default class LocalVrUser extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('web-socket')
  webSocket!: WebSocket;

  @service()
  store!: DS.Store;

  userID!: string;

  name: string = 'unknown';

  color: THREE.Color|undefined;

  renderer!: THREE.WebGLRenderer;

  camera!: THREE.Camera;

  controller1: VRController|undefined;

  controller2: VRController|undefined;

  controllerMainMenus: THREE.Group|undefined;

  controllerInfoMenus: THREE.Group|undefined;

  userGroup!: THREE.Group;

  connectionMenu: ConnectionMenu | null = null;

  connectionStatus: ConnectionStatus = 'offline';

  get isOnline() { return this.state === 'online' || this.state === 'spectating'; }

  get isOffline() { return this.state === 'offline'; }

  get isSpectating() { return this.state === 'spectating'; }

  get position() { return this.userGroup.position; }

  get state() { return this.connectionStatus; }

  set state(state: ConnectionStatus) {
    if (this.connectionMenu) {
      this.connectionMenu.updateStatus(state);
    }
    this.connectionStatus = state;
  }

  init() {
    super.init();

    this.userID = 'unknown';
    this.state = 'offline';
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

        if (this.controllerMainMenus) controller.raySpace.add(this.controllerMainMenus);
        controller.initTeleportArea();
      } else {
        controller.control = controlMode.INTERACTION;
        controller.addRay(new THREE.Color('red'));
        if (this.controllerInfoMenus) controller.raySpace.add(this.controllerInfoMenus);
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
    this.state = 'offline';
    this.color = undefined;
    this.color = undefined;
    this.controller1 = undefined;
    this.controller2 = undefined;
    this.userGroup.children.forEach((child) => { this.userGroup.remove(child); });
  }

  connect() {
    this.state = 'connecting';
    this.webSocket.initSocket();
  }

  /**
   * Switch to offline mode, close socket connection
   */
  disconnect() {
    this.state = 'offline';

    // Close socket
    this.get('webSocket').closeSocket();
  }
}

declare module '@ember/service' {
  interface Registry {
    'local-vr-user': LocalVrUser;
  }
}
