import { inject as service } from '@ember/service';
import WebSocket from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import ConnectionMenu from 'virtual-reality/utils/menus/connection-menu';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import THREE, { Quaternion } from 'three';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import DS from 'ember-data';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import HardwareModels from 'virtual-reality/utils/hardware-models';
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

  @service()
  store!: DS.Store;

  sender!: Sender;

  remoteUserGroup: THREE.Group;

  hardwareModels: HardwareModels;

  constructor(owner: any, args: any) {
    super(owner, args);

    this.remoteUserGroup = new THREE.Group();
    this.hardwareModels = new HardwareModels();
  }

  initRendering() {
    super.initRendering();

    this.scene.add(this.remoteUserGroup);

    this.initCallbacks();

    this.sender = new Sender(this.webSocket);

    this.localUser.state = 'offline';

    $.getJSON('config/config_multiuser.json').then(bind(this, this.applyConfiguration));
  }

  initCallbacks() {
    this.webSocket.socketCloseCallback = this.onDisconnect.bind(this);
    this.webSocket.eventCallback = this.onEvent.bind(this);
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
    this.sendPoses();
    this.webSocket.sendUpdates();
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
      this.showHint('Could not establish connection');
    }
    this.localUser.disconnect();
  }

  onEvent(event: string, data: any) {
    if (event !== 'user_positions') {
      console.log('Event: ', event);
      console.log('Data: ', data);
    }
    switch (event) {
      case 'connection_closed':
        this.onDisconnect();
        break;
      case 'self_connecting':
        this.onSelfConnecting(data);
        break;
      case 'self_connected':
        this.onSelfConnected(data);
        break;
      case 'user_connected':
        this.onUserConnected(data);
        break;
      case 'user_positions':
        this.onUserPositions(data);
        break;
      case 'user_controllers':
        this.onUserControllers(data);
        break;
      case 'user_disconnect':
        this.onUserDisconnect(data);
        break;
      case 'landscape':
        this.onInitialLandscape(data);
        break;
      case 'landscape_position':
        this.onLandscapePosition(data);
        break;
      case 'app_position':
        this.onAppPosition(data);
        break;
      case 'system_update':
        this.onLandscapeUpdate(data);
        break;
      case 'nodegroup_update':
        this.onLandscapeUpdate(data);
        break;
      case 'app_opened':
        break;
      case 'app_closed':
        break;
      case 'app_binded':
        break;
      case 'app_released':
        break;
      case 'component_update':
        break;
      case 'hightlight_update':
        break;
      case 'spectating_update':
        break;
      default:
        break;
    }
  }

  async openSystemAndRedraw(systemMesh: SystemMesh) {
    super.openSystemAndRedraw(systemMesh);

    this.sender.sendSystemUpdate(systemMesh.dataModel.id, true);
  }

  async closeSystemAndRedraw(systemMesh: SystemMesh) {
    super.closeSystemAndRedraw(systemMesh);

    if (this.localUser.isOnline) { this.sender.sendSystemUpdate(systemMesh.dataModel.id, false); }
  }

  /**
   * After socket has opened to backend client is told his/her userID.
   * Respond by asking for "connected" status.
   *
   * @param {JSON} data Message containing own userID
   */
  onSelfConnecting(data: any) {
    // Use ID as default
    // TODO: Access name, given by session
    const name = `ID: ${data.id}`;
    this.localUser.userID = data.id;
    this.localUser.color = data.color;

    const JSONObj = {
      event: 'connect_request',
      name,
    };

    this.webSocket.enqueueIfOpen(JSONObj);
  }

  /**
   * After succesfully connecting to the backend, create and spawn other users.
   *
   * @param {JSON} data Message containing data on other users.
   */
  onSelfConnected(data: any) {
    // Create User model for all users and add them to the users map
    for (let i = 0; i < data.users.length; i++) {
      const userData = data.users[i];
      this.onUserConnected(userData);

      // load controllers
      // if (userData.controllers.controller1)
      // { this.loadController1(userData.controllers.controller1, userData.id); }
      // if (userData.controllers.controller2)
      // { this.loadController2(userData.controllers.controller2, userData.id); }

      // user.initCamera(Models.getHMDModel());

      // Set name for user on top of his hmd
      // this.addUsername(userData.id);
    }
    this.localUser.state = 'online';
    this.localUser.controllersConnected = { controller1: false, controller2: false };

    // Remove apps and reset landscape
    this.resetAll();
  }

  onUserConnected(data: any) {
    const user = this.store.createRecord('remote-vr-user', {
      name: data.name,
      id: data.id,
      color: data.color,
      state: 'connected',
    });

    if (this.hardwareModels.hmd) { user.initCamera(this.hardwareModels.hmd); }

    // Add 3d-models for new user
    this.remoteUserGroup.add(user.get('camera.model'));

    // this.addUsername(data.user.id);

    // Show connect notification
    // this.get('menus.messageBox').enqueueMessage({ title: 'User connected',
    // text: user.get('name'), color: Helper.rgbToHex(user.get('color')) }, 3000);
  }

  setLandscapeState(openSystems: {id: string, opened: boolean}[],
    openNodeGroups: {id: string, opened: boolean}[]) {
    const openEntityIds: Set<string> = new Set(
      openSystems.concat(openNodeGroups)
        .filter((element) => element.opened)
        .map((element) => element.id),
    );

    this.populateScene.perform(openEntityIds);
  }

  /**
   * Updates the specified user's camera and controller positions.
   *
   * @param {JSON} data - Data needed to update positions.
   */
  onUserPositions(data: any) {
    const {
      camera, id, controller1, controller2,
    } = data;

    const user = this.store.peekRecord('remote-vr-user', id);
    if (user) {
      if (controller1) { user.updateController1(controller1); }
      if (controller2) { user.updateController2(controller2); }
      if (camera) { user.updateCamera(camera); }
    }
  }

  /**
   * Handles the (dis-)connect of the specified user's controller(s).
   *
   * @param {JSON} data - Contains id and controller information.
   */
  onUserControllers(data: any) {
    const { id, disconnect, connect } = data;

    const user = this.store.peekRecord('remote-vr-user', id);
    if (!user) { return; }

    // Load newly connected controller(s)
    if (connect) {
      // if (connect.controller1) { this.loadController1(connect.controller1, user.get('id')); }
      // if (connect.controller2) { this.loadController2(connect.controller2, user.get('id')); }
    }

    // Remove controller model(s) due to controller disconnect
    if (disconnect) {
      for (let i = 0; i < disconnect.length; i++) {
        const controller = disconnect[i];
        if (controller === 'controller1') {
          this.scene.remove(user.get('controller1.model'));
          user.removeController1();
        } else if (controller === 'controller2') {
          this.scene.remove(user.get('controller2.model'));
          user.removeController2();
        }
      }
    }
  }

  /**
   * Removes the user that disconnected and informs our user about it.
   *
   * @param {JSON} data - Contains the id of the user that disconnected.
   */
  onUserDisconnect(data: any) {
    const { id } = data;

    // Do not spectate a disconnected user
    if (this.localUser.isSpectating && this.spectateUser.spectatedUserId === id) {
      this.spectateUser.deactivate();
    }
    // Removes user and their models.
    // Informs our user about their disconnect.
    const user = this.store.peekRecord('remote-vr-user', id);
    if (user) {
      // Unhighlight possible objects of disconnected user
      /*
      this.onHighlightingUpdate({
        userID: id,
        isHighlighted: false,
        appID: user.highlightedEntity.appID,
        entityID: user.highlightedEntity.entityID,
        originalColor: user.highlightedEntity.originalColor,
      });
      */
      // Remove user's models
      this.remoteUserGroup.remove(user.get('controller1.model'));
      user.removeController1();
      this.remoteUserGroup.remove(user.get('controller2.model'));
      user.removeController2();
      this.remoteUserGroup.remove(user.get('camera.model'));
      user.removeCamera();

      // Remove user's name tag
      this.remoteUserGroup.remove(user.get('namePlane'));
      user.removeNamePlane();

      // Show disconnect notification
      // this.get('menus.messageBox').enqueueMessage({ title: 'User disconnected',
      // text: user.get('name'), color: Helper.rgbToHex(user.get('color')) }, 3000);
      this.store.unloadRecord(user);
    }
  }

  onInitialLandscape(data: any) {
    const { systems, nodeGroups, openApps } = data;

    this.setLandscapeState(systems, nodeGroups);

    openApps.forEach((app: any) => {
      this.addApplication.perform(app.id);
      const applicationObject3D = this.applicationGroup.getApplication(app.id);
      if (applicationObject3D) {
        applicationObject3D.position.copy(new THREE.Vector3().fromArray(app.position));
        applicationObject3D.quaternion.copy(new THREE.Quaternion().fromArray(app.quaternion));

        EntityManipulation.restoreComponentState(applicationObject3D, new Set(app.openComponents));
      }
    });

    if (data.landscape) {
      this.landscapeOffset = new THREE.Vector3(0, 0, 0);
      const { position } = data.landscape;
      const { quaternion } = data.landscape;
      this.onLandscapePosition({ deltaPosition: position, quaternion });
    }
  }

  onLandscapePosition(pose: { deltaPosition: number[], quaternion: number[] }) {
    super.moveLandscape(pose.deltaPosition[0], pose.deltaPosition[1], pose.deltaPosition[2]);

    super.updateLandscapeRotation(new Quaternion().fromArray(pose.quaternion));
  }

  onAppPosition(appData: { appId: string, direction: number[], length: number }) {
    if (!this.applicationGroup.hasApplication(appData.appId)) {
      return;
    }
    const applicationMesh = this.applicationGroup.getApplication(appData.appId);

    if (applicationMesh) {
      const direction = new THREE.Vector3().fromArray(appData.direction);
      applicationMesh.translateOnAxis(direction, appData.length);
    }
  }

  onLandscapeUpdate(updatedElement: { id: string, isOpen: boolean }) {
    const updatedOpenEntityIds = new Set(this.landscapeObject3D.openEntityIds);

    if (updatedElement.isOpen) {
      updatedOpenEntityIds.add(updatedElement.id);
    } else {
      updatedOpenEntityIds.delete(updatedElement.id);
    }

    this.populateScene.perform(updatedOpenEntityIds);
  }

  moveLandscape(deltaX: number, deltaY: number, deltaZ: number) {
    super.moveLandscape(deltaX, deltaY, deltaZ);

    const delta = new THREE.Vector3(deltaX, deltaY, deltaZ);
    this.sender.sendLandscapeUpdate(delta, this.landscapeObject3D.quaternion, this.landscapeOffset);
  }

  updateLandscapeRotation(quaternion: THREE.Quaternion) {
    super.updateLandscapeRotation(quaternion);

    this.sender.sendLandscapeUpdate(new THREE.Vector3(0, 0, 0), this.landscapeObject3D.quaternion,
      this.landscapeOffset);
  }
}
