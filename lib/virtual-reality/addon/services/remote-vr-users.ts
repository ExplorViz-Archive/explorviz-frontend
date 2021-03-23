import Service, { inject as service } from '@ember/service';
import THREE from "three";
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import { OBJLoader } from "../utils/lib/loader/OBJLoader";
import NameTagMesh from "../utils/view-objects/vr/name-tag-mesh";
import RemoteVrUser from "../utils/vr-multi-user/remote-vr-user";
import SpectateUserService from "./spectate-user";

export default class RemoteVrUserService extends Service {
  @service('spectate-user')
  private spectateUserService!: SpectateUserService;

  private headsetModel!: Promise<THREE.Group>;
  private idToRemoteUser: Map<string, RemoteVrUser> = new Map();
  readonly remoteUserGroup: THREE.Group = new THREE.Group();

  init() {
    super.init();

    // Load headset model.
    this.headsetModel = new Promise((resolve) => {
      const objLoader = new OBJLoader(THREE.DefaultLoadingManager);
      objLoader.load('/generic_hmd/generic_hmd.obj', (headsetModel: THREE.Group) => {
        // Load headset texture.
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath('/generic_hmd/');
        const headsetMesh = headsetModel.children[0] as THREE.Mesh;
        const headsetMaterial = headsetMesh.material as THREE.MeshBasicMaterial;
        headsetMaterial.map = textureLoader.load('generic_hmd.tga');

        headsetModel.name = 'hmdTexture';
        resolve(headsetModel);
      });
    });
  }

  addRemoteUser(remoteUser: RemoteVrUser) {
    // Make sure that the user does not already exist.
    if (this.idToRemoteUser.has(remoteUser.userId)) this.removeRemoteUser(remoteUser);

    this.idToRemoteUser.set(remoteUser.userId, remoteUser);
    this.headsetModel.then((hmd) => remoteUser.initCamera(hmd));
    this.remoteUserGroup.add(remoteUser);

    // Add name tag
    Helper.addDummyNamePlane(remoteUser);
    const nameTag = new NameTagMesh(remoteUser.userName, remoteUser.color);
    remoteUser.nameTag = nameTag;
    remoteUser.add(nameTag);
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
