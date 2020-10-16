import DS from 'ember-data';
import THREE from 'three';

type HighlightedEntity = {
  appID: null|string;
  entityID: null|string;
  sourceClazzID: null|string;
  targetClazzID: null|string;
  originalColor: any;
};
export default class RemoteVrUser extends DS.Model.extend({

}) {
  name: string|undefined;

  state: string|undefined;

  highlightedEntity: HighlightedEntity = {
    appID: null,
    entityID: null,
    sourceClazzID: null,
    targetClazzID: null,
    originalColor: null,
  };

  controller1: any;

  controller2: any;

  camera: any;

  color: number[]|undefined; // [r,g,b], r,g,b = 0,...,255

  namePlane: any; // PlaneGeometry containing username

  initCamera(obj: THREE.Object3D) {
    this.set('camera', {
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      model: new THREE.Object3D(),
    });
    this.camera.model.add(obj);
  }

  initController1(name: string, obj: THREE.Object3D) {
    this.set('controller1', {
      id: name,
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      model: new THREE.Object3D(),
    });

    this.controller1.model.add(obj);
  }

  initController2(name: string, obj: THREE.Object3D) {
    this.set('controller2', {
      id: name,
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
      model: new THREE.Object3D(),
    });

    this.controller2.model.add(obj);
  }

  removeController1() {
    const { parent } = this.controller1.model;
    parent.remove(this.controller.model);
    this.controller1 = null;
  }

  removeController2() {
    const { parent } = this.controller2.model;
    parent.remove(this.controller.model);
    this.controller2 = null;
  }

  removeCamera() {
    const { parent } = this.camera.model;
    parent.remove(this.camera.model);
    this.camera = null;
  }

  removeNamePlane() {
    const { parent } = this.namePlane;
    parent.remove(this.namePlane);
    this.namePlane = null;
  }

  removeAllObjects3D() {
    this.removeController1();
    this.removeController2();
    this.removeCamera();
    this.removeNamePlane();
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
  updateController1(controller: {position: number[], quaternion: number[]}) {
    if (this.controller1) {
      this.controller1.position.fromArray(controller.position);
      this.controller1.quaternion.fromArray(controller.quaternion);
      this.controller1.model.position.copy(this.controller1.position);
      this.controller1.model.quaternion.copy(this.controller1.quaternion);
    }
  }

  /**
   * Updates the controller2 model's position and rotation.
   *
   * @param Object containing the new controller2 position and quaterion.
   */
  updateController2(controller: {position: number[], quaternion: number[]}) {
    if (this.controller2) {
      this.controller2.position.fromArray(controller.position);
      this.controller2.quaternion.fromArray(controller.quaternion);
      this.controller2.model.position.copy(this.controller2.position);
      this.controller2.model.quaternion.copy(this.controller2.quaternion);
    }
  }

  setHighlightedEntity(appID: string, entityID: string, sourceClazzID: string,
    targetClazzID: string, originalColor: any) {
    this.highlightedEntity.appID = appID;
    this.highlightedEntity.entityID = entityID;
    this.highlightedEntity.sourceClazzID = sourceClazzID;
    this.highlightedEntity.targetClazzID = targetClazzID;
    this.highlightedEntity.originalColor = originalColor;
  }

  /**
   * Hides user or unhides them.
   *
   * @param {boolean} bool - If false, hides user's controllers, camera and name tag.
   *                         Shows them if true.
   */
  setVisible(bool: boolean) {
    if (this.camera) {
      this.camera.model.visible = bool;
    }
    if (this.controller1) {
      this.controller1.model.visible = bool;
    }
    if (this.controller2) {
      this.controller2.model.visible = bool;
    }
    if (this.namePlane) {
      this.namePlane.visible = bool;
    }
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'remote-vr-user': RemoteVrUser;
  }
}
