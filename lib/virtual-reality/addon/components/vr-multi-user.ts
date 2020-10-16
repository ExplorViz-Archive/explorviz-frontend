import { inject as service } from '@ember/service';
import WebSocket from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import VrRendering from './vr-rendering';
import Sender from '../utils/sender';
import * as Helper from '../utils/multi-user-helper';

export default class VrMultiUser extends VrRendering {
  debug = debugLogger('VrMultiUser');

  @service('web-socket')
  webSocket!: WebSocket;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  time!: DeltaTime;

  @service('spectate-user')
  spectateUser!: SpectateUser;

  sender!: Sender;

  initThreeJs() {
    super.initThreeJs();

    this.sender = new Sender(this.webSocket);

    this.localUser.state = 'offline';

    let host; let
      port;
    $.getJSON('config/config_multiuser.json').then((json) => {
      host = json.host;
      port = json.port;

      if (!host || !port) {
        this.debug('Config not found!');
      }

      this.webSocket.host = host;
      this.webSocket.port = port;
    });
  }

  /**
  * Main loop contains all methods which need to be called
  * for every rendering iteration
  */
  render() {
    super.render();

    if (this.localUser.isOffline) return;

    this.time.update();

    if (this.localUser.isSpecating) {
      this.spectateUser.update(); // Follow view of spectated user
    }

    // Handle own controller updates and ray intersections
    // this.updateControllers();

    // this.updateUserNameTags();
    this.sendPoses();
    this.webSocket.sendUpdates();
  }

  sendPoses() {
    const poses = Helper.getPoses(this.camera, this.localUser.controller1,
      this.localUser.controller2);

    this.sender.sendPoseUpdate(poses.camera, poses.controller1, poses.controller2);
  }
}
