import { inject as service } from '@ember/service';
import WebSocket from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import ConnectionMenu from 'virtual-reality/utils/menus/connection-menu';
import $ from 'jquery';
import { bind } from '@ember/runloop';
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

  initRendering() {
    super.initRendering();

    this.initWebSocketCallbacks();

    this.sender = new Sender(this.webSocket);

    this.localUser.state = 'offline';

    $.getJSON('config/config_multiuser.json').then(bind(this, this.applyConfiguration));
  }

  initWebSocketCallbacks() {
    this.webSocket.socketCloseCallback = this.onDisconnect.bind(this);
  }

  applyConfiguration(config: any) {
    this.webSocket.host = config.host;
    this.webSocket.port = config.port;
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
    // this.sendPoses();
    // this.webSocket.sendUpdates();
  }

  sendPoses() {
    const poses = Helper.getPoses(this.camera, this.localUser.controller1,
      this.localUser.controller2);

    this.sender.sendPoseUpdate(poses.camera, poses.controller1, poses.controller2);
  }

  openConnectionMenu() {
    this.closeControllerMenu();

    const menu = new ConnectionMenu(
      this.openMainMenu.bind(this),
      this.localUser.state,
      this.localUser.connect.bind(this.localUser),
    );

    this.mainMenu = menu;
    this.localUser.connectionMenu = menu;
    this.controllerMainMenus.add(menu);
  }

  onDisconnect() {
    if (this.localUser.state === 'connecting') {
      // this.get('menus.hintMenu').showHint('Could not establish connection', 3);
    }
    this.localUser.disconnect();
  }
}
