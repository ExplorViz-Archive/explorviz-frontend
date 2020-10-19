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

  startPosition: THREE.Vector3|null = null; // Position before this user starts spectating

  sender = new Sender(this.webSocket);

  /**
  * Used in spectating mode to set user's camera position to the spectated user's position
  */
  update() {
    if (!this.spectatedUser || !this.spectatedUser.camera) return;

    const { position } = this.spectatedUser.camera;

    const cameraOffset = new THREE.Vector3().copy(this.user.camera.position);
    this.user.getPosition().subVectors(position, cameraOffset);
  }

  /**
 * Switches our user into spectator mode
 * @param {number} userID The id of the user to be spectated
 */
  activate(user: RemoteVrUser|null) {
    if (!user) return;

    if (this.user.isSpectating) {
      this.deactivate();
    }

    this.startPosition = this.user.position.clone();
    this.spectatedUser = user;

    // Other user's hmd should be invisible
    if (user.camera) { user.camera.model.visible = false; }
    user.namePlane.visible = false;
    this.user.state = 'spectating';

    this.sender.sendSpectatingUpdate(this.user.userID, this.user.state, user.ID);
  }

  /**
   * Deactives spectator mode for our user
   */
  deactivate() {
    if (!this.spectatedUser || !this.spectatedUser.camera) {
      return;
    }

    this.spectatedUser.camera.model.visible = true;
    this.spectatedUser.namePlane.visible = true;
    this.user.state = 'online';
    this.spectatedUser = null;

    if (this.startPosition) {
      this.user.position.fromArray(this.startPosition.toArray());
    }

    this.sender.sendSpectatingUpdate(this.user.userID, this.user.state, null);
  }

  reset() {
    this.spectatedUserId = null;
    this.startPosition = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'spectate-user': SpectateUser;
  }
}
