import Service, { inject as service } from '@ember/service';

import THREE from 'three';
import VRController from 'virtual-reality/utils/vr-controller';
import WebSocketService from './web-socket';
import SpectateUserService from './spectate-user';

export type ConnectionStatus = 'offline'|'connecting'|'online';

export default class LocalVrUser extends Service {
  @service('web-socket')
  webSocket!: WebSocketService;

  @service('spectate-user')
  spectateUserService!: SpectateUserService;

  userID!: string;

  userName?: string;

  color: THREE.Color|undefined;

  renderer!: THREE.WebGLRenderer;

  scene!: THREE.Scene;

  defaultCamera!: THREE.PerspectiveCamera;

  controller1: VRController|undefined;

  controller2: VRController|undefined;

  userGroup!: THREE.Group;

  connectionStatus: ConnectionStatus = 'offline';

  currentRoomId: string|null = null;

  get camera() {
    if (this.renderer.xr.isPresenting) {
      return this.renderer.xr.getCamera(this.defaultCamera);
    }
    return this.defaultCamera;
  }

  get isOnline() { return this.state === 'online'; }

  get isConnecting() { return this.state === 'connecting'; }

  get isSpectating() { return this.spectateUserService.isActive; }

  get position() { return this.userGroup.position; }

  get state() { return this.connectionStatus; }

  set state(state: ConnectionStatus) {
    this.connectionStatus = state;
  }

  init() {
    super.init();

    this.userID = 'unknown';
    this.state = 'offline';
    this.userGroup = new THREE.Group();
  }

  addCamera(camera: THREE.PerspectiveCamera) {
    this.defaultCamera = camera;
    this.userGroup.add(camera);
  }

  updateControllers(delta: number) {
    if (this.controller1) { this.controller1.update(delta); }
    if (this.controller2) { this.controller2.update(delta); }
  }

  /*
   *  This method is used to adapt the users view to
   *  the new position
   */
  teleportToPosition(position: THREE.Vector3, adaptCameraHeight = false) {
    if (!this.camera) return;

    const cameraWorldPos = new THREE.Vector3();
    this.camera.getWorldPosition(cameraWorldPos);

    this.userGroup.position.x += position.x - cameraWorldPos.x;
    if (adaptCameraHeight) {
      this.userGroup.position.y += position.y - cameraWorldPos.y;
    }
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

    // remove controller rays and models
    // since raySpace and gripSpace will else persist
    this.controller1?.raySpace?.children.forEach((child) => {
      this.controller1?.raySpace?.remove(child);
    });
    this.controller2?.gripSpace?.children.forEach((child) => {
      this.controller2?.gripSpace?.remove(child);
    });
    this.controller1?.children.forEach((child) => { this.controller1?.remove(child); });
    this.controller2?.children.forEach((child) => { this.controller2?.remove(child); });

    this.controller1 = undefined;
    this.controller2 = undefined;
    this.userGroup.children.forEach((child) => { this.userGroup.remove(child); });
  }

  connect(roomId: string) {
    if (!this.isConnecting) {
      this.state = 'connecting';
      this.currentRoomId = roomId;
      this.webSocket.initSocket(this.currentRoomId);
    }
  }

  /**
   * Switch to offline mode, close socket connection
   */
  disconnect() {
    this.state = 'offline';

    // Close socket
    if (this.currentRoomId) {
      this.webSocket.closeSocket(this.currentRoomId);
      this.currentRoomId = null;
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'local-vr-user': LocalVrUser;
  }
}
