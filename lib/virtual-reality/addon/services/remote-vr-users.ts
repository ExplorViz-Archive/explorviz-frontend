import Service, { inject as service } from '@ember/service';
import THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import RemoteVrUser from "../utils/vr-multi-user/remote-vr-user";
import SpectateUserService from "./spectate-user";
import VrSceneService from "./vr-scene";
import { Pose } from "../utils/vr-message/sendable/user_positions";

export default class RemoteVrUserService extends Service {
  @service('spectate-user') private spectateUserService!: SpectateUserService;
  @service('vr-scene') private sceneService!: VrSceneService;

  private headsetModel!: Promise<THREE.Group>;
  private idToRemoteUser: Map<string, RemoteVrUser> = new Map();
  readonly remoteUserGroup: THREE.Group = new THREE.Group();

  init() {
    super.init();
    this.sceneService.scene.add(this.remoteUserGroup);

    // Load headset model.
    this.headsetModel = this.loadObjWithMtl({
      path: '/generic_hmd/',
      objFile: 'generic_hmd.obj',
      mtlFile: 'generic_hmd.mtl'
    });
  }

  private loadObjWithMtl({path, objFile, mtlFile}: {
    path: string,
    objFile: string,
    mtlFile: string
  }): Promise<THREE.Group> {
    return new Promise((resolve) => {
      const loadingManager = new THREE.LoadingManager();
      loadingManager.addHandler(/\.tga$/i, new TGALoader());

      const mtlLoader = new MTLLoader(loadingManager);
      mtlLoader.setPath(path);
      mtlLoader.load(mtlFile, (materials) => {
        materials.preload();

        const objLoader = new OBJLoader(loadingManager);
        objLoader.setPath(path);
        objLoader.setMaterials(materials);
        objLoader.load(objFile, resolve);
      });
    });
  }

  addRemoteUser(remoteUser: RemoteVrUser, initialPose: Pose) {
    // Make sure that the user does not already exist.
    if (this.idToRemoteUser.has(remoteUser.userId)) this.removeRemoteUser(remoteUser);

    this.idToRemoteUser.set(remoteUser.userId, remoteUser);
    this.headsetModel.then((hmd) => remoteUser.initCamera(hmd.clone(true), initialPose));
    this.remoteUserGroup.add(remoteUser);
  }

  getAllRemoteUserIds() {
    return this.idToRemoteUser.keys();
  }

  getAllRemoteUsers() {
    return this.idToRemoteUser.values();
  }

  lookupRemoteUserById(userId: string): RemoteVrUser | undefined {
    return this.idToRemoteUser.get(userId);
  }

  setRemoteUserSpectatingById(userId: string, isSpectating: boolean): RemoteVrUser | undefined {
    const remoteUser = this.idToRemoteUser.get(userId);
    if (remoteUser) this.setRemoteUserSpectating(remoteUser, isSpectating);
    return remoteUser;
  }

  setRemoteUserSpectating(remoteUser: RemoteVrUser, isSpectating: boolean) {
    remoteUser.state = isSpectating ? 'spectating' : 'online';
    remoteUser.setVisible(!isSpectating);

    // If we spectated the remote user before, stop spectating.
    if (isSpectating && this.spectateUserService.spectatedUser ?.userId === remoteUser.userId) {
      this.spectateUserService.deactivate();
    }
  }

  removeRemoteUserById(userId: string): RemoteVrUser | undefined {
    const remoteUser = this.idToRemoteUser.get(userId);
    if (remoteUser) this.removeRemoteUser(remoteUser);
    return remoteUser;
  }

  private removeRemoteUser(remoteUser: RemoteVrUser) {
    // Stop spectating removed user.
    if (this.spectateUserService.spectatedUser ?.userId === remoteUser.userId) {
      this.spectateUserService.deactivate();
    }

    // Remove user's 3d-objects.
    remoteUser.removeAllObjects3D();
    this.remoteUserGroup.remove(remoteUser);
    this.idToRemoteUser.delete(remoteUser.userId);
  }

  removeAllRemoteUsers() {
    this.idToRemoteUser.forEach((user) => {
      user.removeAllObjects3D();
    });
    this.idToRemoteUser.clear();
  }

  updateRemoteUsers(delta: number) {
    this.idToRemoteUser.forEach((remoteUser) => remoteUser.update(delta));
  }
}

declare module '@ember/service' {
  interface Registry {
    'remote-vr-users': RemoteVrUserService;
  }
}
