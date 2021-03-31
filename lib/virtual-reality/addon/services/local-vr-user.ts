import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import VRController from 'virtual-reality/utils/vr-controller';
import SpectateUserService from './spectate-user';
import WebSocketService from './web-socket';

export type ConnectionStatus = 'offline' | 'connecting' | 'online';

export default class LocalVrUser extends Service {
  @service('web-socket')
  webSocket!: WebSocketService;

  @service('spectate-user')
  spectateUserService!: SpectateUserService;

  userID!: string;

  userName?: string;

  color: THREE.Color | undefined;

  renderer!: THREE.WebGLRenderer;

  scene!: THREE.Scene;

  defaultCamera!: THREE.PerspectiveCamera;

  controller1: VRController | undefined;

  controller2: VRController | undefined;

  userGroup!: THREE.Group;

  connectionStatus: ConnectionStatus = 'offline';

  currentRoomId: string | null = null;

  get camera() {
    if (this.renderer.xr.isPresenting) {
      return this.renderer.xr.getCamera(this.defaultCamera);
    }
    return this.defaultCamera;
  }

  get isOnline() { return this.connectionStatus === 'online'; }

  get isConnecting() { return this.connectionStatus === 'connecting'; }

  get isSpectating() { return this.spectateUserService.isActive; }

  get position() { return this.userGroup.position; }

  init() {
    super.init();

    this.userID = 'unknown';
    this.connectionStatus = 'offline';
    this.userGroup = new THREE.Group();
  }

  addCamera(camera: THREE.PerspectiveCamera) {
    this.defaultCamera = camera;
    this.userGroup.add(camera);
  }

  updateControllers(delta: number) {
    if (this.controller1) this.controller1.update(delta);
    if (this.controller2) this.controller2.update(delta);
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

  /**
   * Moves the user group in the given direction relative to the default camera.
   */
  moveInCameraDirection(direction: THREE.Vector3, {
    enableX = true, enableY = true, enableZ = true
  }: {enableX?: boolean, enableY?: boolean, enableZ?: boolean}) {
    // Convert direction from the camera's object space to world coordinates.
    const distance = direction.length();
    direction = direction.clone().normalize().transformDirection(this.defaultCamera.matrix);

    // Remove disabled components.
    if (!enableX) direction.x = 0;
    if (!enableY) direction.y = 0;
    if (!enableZ) direction.z = 0;

    // Convert the direction back to object space before applying the translation.
    direction.normalize().transformDirection(this.userGroup.matrix.getInverse(new THREE.Matrix4()));
    this.userGroup.translateOnAxis(direction, distance);
  }

  /*
   * This method is used to adapt the users view to the initial position
   */
  resetPosition() {
    this.userGroup.position.set(0, 0, 0);
  }

  reset() {
    this.disconnect();
    this.userID = 'unknown';
    this.color = undefined;

    // remove controller rays and models
    // since raySpace and gripSpace will else persist
    this.controller1?.raySpace?.children.forEach((child) => {
      this.controller1?.raySpace?.remove(child);
    });
    this.controller2?.gripSpace?.children.forEach((child) => {
      this.controller2?.gripSpace?.remove(child);
    });
    this.controller1?.children.forEach((child) => this.controller1?.remove(child));
    this.controller2?.children.forEach((child) => this.controller2?.remove(child));

    this.controller1 = undefined;
    this.controller2 = undefined;
    this.userGroup.children.forEach((child) => this.userGroup.remove(child));
  }

  async connect(roomId: Promise<string>) {
    if (!this.isConnecting) {
      this.connectionStatus = 'connecting';
      this.currentRoomId = await roomId;
      this.webSocket.initSocket(this.currentRoomId);
    }
  }

  connected({ id, name, color }: {
    id: string,
    name: string,
    color: THREE.Color;
  }) {
    this.connectionStatus = 'online';
    this.userID = id;
    this.userName = name;

    this.color = color;
    if (this.controller1) this.controller1.updateControllerColor(color);
    if (this.controller2) this.controller2.updateControllerColor(color);
  }

  /**
   * Switch to offline mode, close socket connection
   */
  disconnect() {
    this.connectionStatus = 'offline';
    this.currentRoomId = null;
    this.webSocket.closeSocket();
  }
}

declare module '@ember/service' {
  interface Registry {
    'local-vr-user': LocalVrUser;
  }
}
