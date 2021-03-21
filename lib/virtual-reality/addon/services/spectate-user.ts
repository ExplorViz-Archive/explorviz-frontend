import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import LocalVrUser from './local-vr-user';

export default class SpectateUserService extends Service {
  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('vr-message-sender')
  sender!: VrMessageSender;

  spectatedUser: RemoteVrUser|null = null; // Tells which userID (if any) is being spectated

  startPosition: THREE.Vector3 = new THREE.Vector3(); // Position before this user starts spectating

  get isActive() { return this.spectatedUser !== null; }

  /**
  * Used in spectating mode to set user's camera position to the spectated user's position
  */
  update() {
    if (this.spectatedUser && this.spectatedUser.camera) {
      this.localUser.teleportToPosition(this.spectatedUser.camera.position, true);
    }
  }

  /**
 * Switches our user into spectator mode
 * @param {number} userID The id of the user to be spectated
 */
  activate(remoteUser: RemoteVrUser|null) {
    if (!remoteUser) return;

    this.startPosition.copy(this.localUser.userGroup.position);
    this.spectatedUser = remoteUser;

    if (this.localUser.controller1) {
      this.localUser.controller1.setToSpectatingAppearance();
    }
    if (this.localUser.controller2) {
      this.localUser.controller2.setToSpectatingAppearance();
    }

    remoteUser.setHmdVisible(false);
    this.sender.sendSpectatingUpdate(this.isActive, remoteUser.userId);
  }

  /**
   * Deactives spectator mode for our user
   */
  deactivate() {
    if (!this.spectatedUser) return;

    if (this.localUser.controller1) {
      this.localUser.controller1.setToDefaultAppearance();
    }
    if (this.localUser.controller2) {
      this.localUser.controller2.setToDefaultAppearance();
    }

    this.localUser.userGroup.position.copy(this.startPosition);
    this.spectatedUser.setHmdVisible(true);
    this.spectatedUser = null;

    this.sender.sendSpectatingUpdate(this.isActive, null);
  }

  reset() {
    this.spectatedUser = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'spectate-user': SpectateUserService;
  }
}
