import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import { Pose } from '../utils/vr-message/sendable/user_positions';
import RemoteVrUser from '../utils/vr-multi-user/remote-vr-user';
import SpectateUserService from './spectate-user';
import VrSceneService from './vr-scene';

export default class RemoteVrUserService extends Service {
  @service('spectate-user')
  private spectateUserService!: SpectateUserService;

  @service('vr-scene')
  private sceneService!: VrSceneService;

  private headsetModel!: Promise<THREE.Group>;

  private idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  readonly remoteUserGroup: THREE.Group = new THREE.Group();

  displayHmd = true;

  init() {
    super.init();
    this.sceneService.scene.add(this.remoteUserGroup);
  }

  addRemoteUser(remoteUser: RemoteVrUser, initialPose: Pose) {
    // Make sure that the user does not already exist.
    if (this.idToRemoteUser.has(remoteUser.userId)) this.removeRemoteUser(remoteUser);

    this.idToRemoteUser.set(remoteUser.userId, remoteUser);
    this.notifyPropertyChange('idToRemoteUser');
    if (this.displayHmd) {
      this.headsetModel.then((hmd) => remoteUser.initCamera(hmd.clone(true), initialPose));
    }
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

  setRemoteUserSpectatingById(
    userId: string,
    isSpectating: boolean,
  ): RemoteVrUser | undefined {
    const remoteUser = this.idToRemoteUser.get(userId);
    if (remoteUser) this.setRemoteUserSpectating(remoteUser, isSpectating);
    return remoteUser;
  }

  setRemoteUserSpectating(remoteUser: RemoteVrUser, isSpectating: boolean) {
    remoteUser.state = isSpectating ? 'spectating' : 'online';
    remoteUser.setVisible(!isSpectating);

    // If we spectated the remote user before, stop spectating.
    if (
      isSpectating
      && this.spectateUserService.spectatedUser?.userId === remoteUser.userId
    ) {
      this.spectateUserService.deactivate();
    }
  }

  removeRemoteUserById(userId: string): RemoteVrUser | undefined {
    const remoteUser = this.idToRemoteUser.get(userId);
    if (remoteUser) this.removeRemoteUser(remoteUser);
    this.notifyPropertyChange('idToRemoteUser');
    return remoteUser;
  }

  private removeRemoteUser(remoteUser: RemoteVrUser) {
    // Stop spectating removed user.
    if (this.spectateUserService.spectatedUser?.userId === remoteUser.userId) {
      this.spectateUserService.deactivate();
    }

    // Remove user's 3d-objects.
    remoteUser.removeAllObjects3D();
    this.remoteUserGroup.remove(remoteUser);
    this.idToRemoteUser.delete(remoteUser.userId);
    this.notifyPropertyChange('idToRemoteUser');
  }

  removeAllRemoteUsers() {
    this.idToRemoteUser.forEach((user) => {
      user.removeAllObjects3D();
    });
    this.idToRemoteUser.clear();
    this.notifyPropertyChange('idToRemoteUser');
  }

  updateRemoteUsers(delta: number) {
    this.idToRemoteUser.forEach((remoteUser) => remoteUser.update(delta));
    this.notifyPropertyChange('idToRemoteUser');
  }
}

declare module '@ember/service' {
  interface Registry {
    'remote-vr-users': RemoteVrUserService;
  }
}
