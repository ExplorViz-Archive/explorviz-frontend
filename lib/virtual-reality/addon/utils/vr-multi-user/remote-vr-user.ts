import THREE from 'three';
import XRControllerModelFactory from '../lib/controller/XRControllerModelFactory';
import NameTagMesh from '../view-objects/vr/name-tag-mesh';
import { getPingMesh, PING_ANIMATION_CLIP } from '../vr-menus/ui-less-menu/ping-menu';

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
  userName!: string;

  ID: string = 'unknown';

  state!: string;

  controller1: Controller | undefined;

  controller2: Controller | undefined;

  ping1: THREE.Mesh | undefined;

  ping2: THREE.Mesh | undefined;

  actionPing1: THREE.AnimationAction | undefined;

  actionPing2: THREE.AnimationAction | undefined;

  camera: Camera | undefined;

  color!: THREE.Color; // [r,g,b], r,g,b = 0,...,255

  nameTag: NameTagMesh|undefined;

  animationMixer: THREE.AnimationMixer;

  constructor() {
    super();
    this.animationMixer = new THREE.AnimationMixer(this);
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
    this.stopPing1();
  }

  removeController2() {
    if (this.controller2 && this.controller2.model) {
      this.remove(this.controller2.model);
      this.controller2 = undefined;
    }
    this.stopPing2();
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

  removeAllObjects3D() {
    this.removeController1();
    this.removeController2();
    this.removeCamera();
    this.removeNameTag();
  }

  startPing1() {
    this.ping1 = getPingMesh(this.color);
    this.actionPing1 = this.animationMixer.clipAction(PING_ANIMATION_CLIP, this.ping1);
    this.add(this.ping1);
  }

  updatePing1() {
    if (this.controller1 && this.ping1 && this.actionPing1) {
      let position = this.controller1.intersection;
      if (position) {
          this.ping1.position.set(position.x, position.y, position.z);
          this.ping1.visible = true;
          this.actionPing1.play();
      } else {
        this.ping1.visible = false;
        this.actionPing2?.stop();
      }
    }
  }

  stopPing1() {
    if (this.ping1) {
      this.remove(this.ping1);
      this.ping1 = undefined;
      this.actionPing1?.stop();
      this.actionPing1 = undefined;
    }
  }

  startPing2() {
    this.ping2 = getPingMesh(this.color);
    this.actionPing2 = this.animationMixer.clipAction(PING_ANIMATION_CLIP, this.ping2);
    this.add(this.ping2);
  }

  updatePing2() {
    if (this.controller2 && this.ping2 && this.actionPing2) {
      let position = this.controller2.intersection;
      if (position) {
          this.ping2.position.set(position.x, position.y, position.z);
          this.ping2.visible = true;
          this.actionPing2.play();
      } else {
        this.ping2.visible = false;
        this.actionPing2?.stop();
      }
    }
  }

  stopPing2() {
    if (this.ping2) {
      this.remove(this.ping2);
      this.ping2 = undefined;
      this.actionPing2?.stop();
      this.actionPing2 = undefined;
    }
  }

  /**
   * Updates the the animations.
   * 
   * @param delta The time since the last update.
   */
  update(delta: number) {
    this.animationMixer.update(delta);
  }

  /**
   * Updates the camera model's position and rotation.
   *
   * @param Object containing the new camera position and quaterion.
   */
  updateCamera(camera: {position: number[], quaternion: number[]}) {
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
  updateController1(controller: {position: number[], quaternion: number[], intersection: number[] | null}) {
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
  updateController2(controller: {position: number[], quaternion: number[], intersection: number[] | null}) {
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
