import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import THREE from 'three';
import VRController from 'virtual-reality/utils/vr-controller';
import SpectateUserService from './spectate-user';
import VrRoomService from './vr-room';
import VrSceneService from './vr-scene';
import WebSocketService from './web-socket';

export type ConnectionStatus = 'offline' | 'connecting' | 'online';

export default class LocalVrUser extends Service {
  @service('spectate-user')
  private spectateUserService!: SpectateUserService;

  @service('vr-room')
  private roomService!: VrRoomService;

  @service('vr-scene')
  private sceneService!: VrSceneService;

  @service('web-socket')
  private webSocket!: WebSocketService;

  userId!: string;

  userName?: string;

  color: THREE.Color | undefined;

  @tracked
  renderer!: THREE.WebGLRenderer;

  private userGroup!: THREE.Group;

  defaultCamera!: THREE.PerspectiveCamera;

  controller1: VRController | undefined;

  controller2: VRController | undefined;

  panoramaSphere: THREE.Object3D | undefined;

  connectionStatus: ConnectionStatus = 'offline';

  currentRoomId: string | null = null;

  get camera() {
    if (this.renderer.xr.isPresenting) {
      return this.renderer.xr.getCamera(this.defaultCamera);
    }
    return this.defaultCamera;
  }

  get isOnline() {
    return this.connectionStatus === 'online';
  }

  get isConnecting() {
    return this.connectionStatus === 'connecting';
  }

  get isSpectating() {
    return this.spectateUserService.isActive;
  }

  init() {
    super.init();

    this.userId = 'unknown';
    this.connectionStatus = 'offline';

    this.userGroup = new THREE.Group();
    this.sceneService.scene.add(this.userGroup);

    // Initialize camera. The default aspect ratio is not known at this point
    // and must be updated when the canvas is inserted.
    this.defaultCamera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000);
    this.defaultCamera.position.set(0, 1, 2);
    this.userGroup.add(this.defaultCamera);
  }

  setController1(controller1: VRController) {
    this.controller1 = controller1;
    this.userGroup.add(controller1);
  }

  setController2(controller2: VRController) {
    this.controller2 = controller2;
    this.userGroup.add(controller2);
  }

  setPanoramaShere(panoramaSphere: THREE.Object3D) {
    this.removePanoramaShere();
    this.panoramaSphere = panoramaSphere;
    this.userGroup.add(panoramaSphere);
  }

  private removePanoramaShere() {
    if (this.panoramaSphere) this.userGroup.remove(this.panoramaSphere);
  }

  updateControllers(delta: number) {
    if (this.controller1) this.controller1.update(delta);
    if (this.controller2) this.controller2.update(delta);
  }

  updateCameraAspectRatio(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.defaultCamera.aspect = width / height;
    this.defaultCamera.updateProjectionMatrix();
  }

  /*
   *  This method is used to adapt the users view to
   *  the new position
   */
  teleportToPosition(
    position: THREE.Vector3,
    {
      adaptCameraHeight = false,
    }: {
      adaptCameraHeight?: boolean;
    } = {},
  ) {
    if (!this.camera) return;

    const cameraWorldPos = this.getCameraWorldPosition();
    this.userGroup.position.x += position.x - cameraWorldPos.x;
    if (adaptCameraHeight) {
      this.userGroup.position.y += position.y - cameraWorldPos.y;
    }
    this.userGroup.position.z += position.z - cameraWorldPos.z;
  }

  getCameraWorldPosition() {
    return this.camera.getWorldPosition(new THREE.Vector3());
  }

  get cameraHeight(): number {
    return this.userGroup.position.y;
  }

  set cameraHeight(cameraHeight: number) {
    this.userGroup.position.y = cameraHeight;
  }

  /**
   * Moves the user group in the given direction relative to the default camera.
   */
  moveInCameraDirection(
    direction: THREE.Vector3,
    {
      enableX = true,
      enableY = true,
      enableZ = true,
    }: { enableX?: boolean; enableY?: boolean; enableZ?: boolean },
  ) {
    // Convert direction from the camera's object space to world coordinates.
    const distance = direction.length();
    const worldDirection = direction
      .clone()
      .normalize()
      .transformDirection(this.defaultCamera.matrix);

    // Remove disabled components.
    if (!enableX) worldDirection.x = 0;
    if (!enableY) worldDirection.y = 0;
    if (!enableZ) worldDirection.z = 0;

    // Convert the direction back to object space before applying the translation.
    const localDirection = worldDirection
      .normalize()
      .transformDirection(
        this.userGroup.matrix.clone().invert(),
      );
    this.userGroup.translateOnAxis(localDirection, distance);
  }

  /**
   * Rotates the camera around the local x and world y axis.
   */
  rotateCamera(x: number, y: number) {
    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    this.camera.rotateOnAxis(xAxis, x);
    this.camera.rotateOnWorldAxis(yAxis, y);
  }

  /*
   * This method is used to adapt the users view to the initial position
   */
  resetPositionAndRotation() {
    this.userGroup.position.set(0, 0, 0);
    this.defaultCamera.rotation.set(0, 0, 0);
  }

  reset() {
    this.resetPositionAndRotation();
    this.disconnect();
    this.userId = 'unknown';
    this.color = undefined;

    this.resetController(this.controller1);
    this.controller1 = undefined;

    this.resetController(this.controller2);
    this.controller2 = undefined;
  }

  private resetController(controller: VRController | undefined) {
    if (!controller) return;

    this.userGroup.remove(controller);
    controller.children.forEach((child) => controller.remove(child));
    controller.gripSpace?.children.forEach((child) => {
      controller.gripSpace?.remove(child);
    });
    controller.removeTeleportArea();
  }

  async hostRoom() {
    if (!this.isConnecting) {
      this.connectionStatus = 'connecting';
      const response = await this.roomService.createRoom();
      this.joinRoom(response.roomId, { checkConnectionStatus: false });
    }
  }

  async joinRoom(roomId: string, {
    checkConnectionStatus = true,
  }: { checkConnectionStatus?: boolean } = {}) {
    if (!checkConnectionStatus || !this.isConnecting) {
      this.connectionStatus = 'connecting';
      this.currentRoomId = roomId;
      const response = await this.roomService.joinLobby(this.currentRoomId);
      this.webSocket.initSocket(response.ticketId);
    }
  }

  connected({
    id,
    name,
    color,
  }: {
    id: string;
    name: string;
    color: THREE.Color;
  }) {
    this.connectionStatus = 'online';
    this.userId = id;
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
