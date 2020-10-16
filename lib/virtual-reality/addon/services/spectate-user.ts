import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';
import THREE from 'three';
import Sender from 'virtual-reality/utils/sender';
import LocalVrUser from './local-vr-user';
import WebSocket from './web-socket';

export default class SpectateUser extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('local-vr-user')
  user!: LocalVrUser;

  @service('web-socket')
  webSocket!: WebSocket;

  @service()
  store!: DS.Store;

  spectatedUserId: string|null = null; // Tells which userID (if any) is being spectated

  startPosition: THREE.Vector3|null = null; // Position before this user starts spectating

  sender = new Sender(this.webSocket);

  /**
  * Used in spectating mode to set user's camera position to the spectated user's position
  */
  update() {
    if (!this.spectatedUserId) return;
    const spectatedUser = this.store.peekRecord('remote-vr-user', this.spectatedUserId);

    if (!spectatedUser) {
      this.deactivate();
      return;
    }

    const { position } = spectatedUser.camera;

    const cameraOffset = new THREE.Vector3();

    cameraOffset.copy(this.user.camera.position);
    this.user.getPosition().subVectors(new THREE.Vector3(position), cameraOffset);
  }

  /**
 * Switches our user into spectator mode
 * @param {number} userID The id of the user to be spectated
 */
  activate(userID: string) {
    if (!userID) {
      return;
    }

    if (this.user.state === 'spectating') {
      this.deactivate();
    }

    const spectatedUser = this.store.peekRecord('remote-vr-user', userID);

    if (!spectatedUser) {
      return;
    }
    this.startPosition = this.user.position.clone();
    this.spectatedUser = userID;

    // Other user's hmd should be invisible
    spectatedUser.camera.model.visible = false;
    spectatedUser.namePlane.visible = false;
    this.user.state = 'spectating';
    this.sender.sendSpectatingUpdate(this.user.userID, this.user.state, this.spectatedUserId);
  }

  /**
   * Deactives spectator mode for our user
   */
  deactivate() {
    if (!this.spectatedUserId) {
      return;
    }

    const spectatedUser = this.get('store').peekRecord('remote-vr-user', this.get('spectatedUser'));

    if (!this.spectatedUserId) { return; }

    spectatedUser.camera.model.visible = true;
    spectatedUser.namePlane.visible = true;
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
