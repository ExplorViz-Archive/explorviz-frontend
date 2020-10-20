import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import Sender from 'virtual-reality/utils/vr-multi-user/sender';
import LocalVrUser from './local-vr-user';
import WebSocket from './web-socket';

export default class SpectateUser extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('local-vr-user')
  user!: LocalVrUser;

  @service('web-socket')
  webSocket!: WebSocket;

  spectatedUser: RemoteVrUser|null = null; // Tells which userID (if any) is being spectated

  startPosition: THREE.Vector3 = new THREE.Vector3(); // Position before this user starts spectating

  sender = new Sender(this.webSocket);

  get isActive() { return this.spectatedUser !== null; }

  /**
  * Used in spectating mode to set user's camera position to the spectated user's position
  */
  update() {
    if (this.spectatedUser && this.spectatedUser.camera) {
      this.user.teleportToPosition(this.spectatedUser.camera.position, true);
    }
  }

  /**
 * Switches our user into spectator mode
 * @param {number} userID The id of the user to be spectated
 */
  activate(remoteUser: RemoteVrUser|null) {
    if (!remoteUser) return;

    this.startPosition.copy(this.user.userGroup.position);
    this.spectatedUser = remoteUser;

    // Other user's hmd should be invisible
    remoteUser.setVisible(false);

    this.sender.sendSpectatingUpdate(this.user.userID, this.isActive, remoteUser.ID);
  }

  /**
   * Deactives spectator mode for our user
   */
  deactivate() {
    if (!this.spectatedUser || !this.spectatedUser.camera) {
      return;
    }

    this.spectatedUser.setVisible(false);
    this.spectatedUser = null;

    this.user.state = 'online';

    this.user.userGroup.position.copy(this.startPosition);

    this.sender.sendSpectatingUpdate(this.user.userID, this.isActive, null);
  }

  reset() {
    this.spectatedUserId = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'spectate-user': SpectateUser;
  }
}
