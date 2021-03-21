import THREE from 'three';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import XRControllerModelFactory from '../lib/controller/XRControllerModelFactory';
import NameTagMesh from '../view-objects/vr/name-tag-mesh';
import PingMesh from '../view-objects/vr/ping-mesh';
import WaypointIndicator from '../view-objects/vr/waypoint-indicator';

type Controller = {
  assetUrl: string,
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  intersection: THREE.Vector3 | null,
  model: THREE.Object3D,
  ray: THREE.Object3D,
};

type Camera = {
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  model: THREE.Object3D,
};

export default class RemoteVrUser extends THREE.Object3D {
  userName: string;

  userId: string;

  state: string;

  controller1: Controller | undefined;

  controller2: Controller | undefined;

  pingMesh1: PingMesh;

  pingWaypoint1: WaypointIndicator;

  pingMesh2: PingMesh;

  pingWaypoint2: WaypointIndicator;

  camera: Camera | undefined;

  color: THREE.Color; // [r,g,b], r,g,b = 0,...,255

  nameTag: NameTagMesh | undefined;

  localUser: LocalVrUser;

  animationMixer: THREE.AnimationMixer;

  constructor({ userName, userId, color, state, localUser }: {
    userName: string,
    userId: string,
    color: THREE.Color,
    state: string,
    localUser: LocalVrUser
  }) {
    super();
    this.userName = userName;
    this.userId = userId;
    this.color = color;
    this.state = state;
    this.localUser = localUser;
    this.animationMixer = new THREE.AnimationMixer(this);

    this.pingMesh1 = new PingMesh({ animationMixer: this.animationMixer, color: this.color });
    this.pingMesh2 = new PingMesh({ animationMixer: this.animationMixer, color: this.color });
    this.add(this.pingMesh1);
    this.add(this.pingMesh2);
    this.pingWaypoint1 = new WaypointIndicator({ target: this.pingMesh1, color: this.color });
    this.pingWaypoint2 = new WaypointIndicator({ target: this.pingMesh2, color: this.color });
    this.localUser.defaultCamera.add(this.pingWaypoint1);
    this.localUser.defaultCamera.add(this.pingWaypoint2);
  }

  initCamera(obj: THREE.Object3D) {
    this.camera = {
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      model: obj,
    };

    this.add(this.camera.model);
  }

  async initController1(assetUrl: string) {
    this.removeController1();
    this.controller1 = await this.initController(assetUrl);
  }

  async initController2(assetUrl: string) {
    this.removeController2();
    this.controller2 = await this.initController(assetUrl);
  }

  async initController(assetUrl: string): Promise<Controller> {
    const controllerModel = await XRControllerModelFactory.INSTANCE.loadAssetScene(assetUrl);
    const ray = RemoteVrUser.addRayToControllerModel(controllerModel, this.color);

    let controller = {
      assetUrl: assetUrl,
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      intersection: null,
      model: controllerModel,
      ray,
    };
    this.add(controller.model);
    return controller;
  }

  static addRayToControllerModel(controller: THREE.Object3D, color: THREE.Color) {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)],
    );

    const material = new THREE.LineBasicMaterial({
      color,
    });

    const line = new THREE.Line(geometry, material);
    line.scale.z = 5;

    line.position.y -= 0.005;
    line.position.z -= 0.02;
    controller.add(line);

    return line;
  }

  removeController1() {
    if (this.controller1 && this.controller1.model) {
      this.remove(this.controller1.model);
      this.controller1 = undefined;
    }
    this.togglePing1(false);
  }

  removeController2() {
    if (this.controller2 && this.controller2.model) {
      this.remove(this.controller2.model);
      this.controller2 = undefined;
    }
    this.togglePing2(false);
  }

  removeCamera() {
    if (this.camera && this.camera.model) {
      this.remove(this.camera.model);
      this.camera = undefined;
    }
  }

  removeNameTag() {
    if (this.nameTag) {
      this.remove(this.nameTag);
      this.nameTag.disposeRecursively();
      this.nameTag = undefined;
    }
  }

  removePingObjects() {
    this.remove(this.pingMesh1);
    this.remove(this.pingMesh2);
    this.remove(this.pingWaypoint1);
    this.remove(this.pingWaypoint2);
  }

  removeAllObjects3D() {
    this.removeController1();
    this.removeController2();
    this.removeCamera();
    this.removeNameTag();
    this.removePingObjects();
  }

  togglePing1(isPinging: boolean) {
    if (isPinging) {
      this.pingMesh1.startPinging();
    } else {
      this.pingMesh1.stopPinging();
    }
  }

  updatePing1() {
    if (this.controller1) {
      this.pingMesh1.updateIntersection(this.controller1.intersection);
    }
  }

  togglePing2(isPinging: boolean) {
    if (isPinging) {
      this.pingMesh2.startPinging();
    } else {
      this.pingMesh2.stopPinging();
    }
  }

  updatePing2() {
    if (this.controller2) {
      this.pingMesh2.updateIntersection(this.controller2.intersection);
    }
  }

  /**
   * Updates the the animations and sets the position and rotation of the
   * name tag.
   *
   * @param delta The time since the last update.
   */
  update(delta: number) {
    this.animationMixer.update(delta);

    // Update name tag.
    const dummyPlane = this.getObjectByName('dummyNameTag');
    if (this.state === 'online' && this.nameTag && this.camera && dummyPlane && this.localUser.camera) {
      this.nameTag.position.setFromMatrixPosition(dummyPlane.matrixWorld);
      this.nameTag.lookAt(this.localUser.camera.getWorldPosition(new THREE.Vector3()));
    }
  }

  /**
   * Updates the camera model's position and rotation.
   *
   * @param Object containing the new camera position and quaterion.
   */
  updateCamera(camera: { position: number[], quaternion: number[] }) {
    if (this.camera) {
      camera.position[1] -= 0.01;

      this.camera.position.fromArray(camera.position);
      this.camera.quaternion.fromArray(camera.quaternion);
      this.camera.model.position.copy(this.camera.position);
      this.camera.model.quaternion.copy(this.camera.quaternion);
    }
  }

  /**
   * Updates the controller1 model's position and rotation.
   *
   * @param Object containing the new controller1 position and quaterion.
   */
  updateController1(controller: { position: number[], quaternion: number[], intersection: number[] | null }) {
    if (this.controller1) {
      this.controller1.position.fromArray(controller.position);
      this.controller1.quaternion.fromArray(controller.quaternion);
      this.controller1.model.position.copy(this.controller1.position);
      this.controller1.model.quaternion.copy(this.controller1.quaternion);
      if (controller.intersection) {
        this.controller1.intersection = new THREE.Vector3().fromArray(controller.intersection);
      } else {
        this.controller1.intersection = null;
      }
      this.updatePing1();
    }
  }

  /**
   * Updates the controller2 model's position and rotation.
   *
   * @param Object containing the new controller2 position and quaterion.
   */
  updateController2(controller: { position: number[], quaternion: number[], intersection: number[] | null }) {
    if (this.controller2) {
      this.controller2.position.fromArray(controller.position);
      this.controller2.quaternion.fromArray(controller.quaternion);
      this.controller2.model.position.copy(this.controller2.position);
      this.controller2.model.quaternion.copy(this.controller2.quaternion);
      if (controller.intersection) {
        this.controller2.intersection = new THREE.Vector3().fromArray(controller.intersection);
      } else {
        this.controller2.intersection = null;
      }
      this.updatePing2();
    }
  }

  /**
   * Hides user or unhides them.
   *
   * @param {boolean} visible - If false, hides user's controllers, camera and name tag.
   *                         Shows them if true.
   */
  setVisible(visible: boolean) {
    if (this.controller1) {
      this.controller1.model.visible = visible;
    }
    if (this.controller2) {
      this.controller2.model.visible = visible;
    }
    this.setHmdVisible(visible);
  }

  /**
   * Hide or display user's HMD and name tag
   *
   * @param visible Determines visibility of HMD and name tag
   */
  setHmdVisible(visible: boolean) {
    if (this.camera) {
      this.camera.model.visible = visible;
    }
    if (this.nameTag) {
      this.nameTag.visible = visible;
    }
  }
}
