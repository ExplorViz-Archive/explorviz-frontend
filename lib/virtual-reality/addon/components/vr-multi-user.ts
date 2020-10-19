import { inject as service } from '@ember/service';
import WebSocket from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import ConnectionMenu from 'virtual-reality/utils/vr-menus/connection-menu';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import THREE, { Quaternion } from 'three';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import SystemMesh from 'explorviz-frontend/view-objects/3d/landscape/system-mesh';
import HardwareModels from 'virtual-reality/utils/vr-multi-user/hardware-models';
import VrRendering from 'virtual-reality/components/vr-rendering';
import Sender from 'virtual-reality/utils/vr-multi-user/sender';
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import MessageBoxMenu from 'virtual-reality/utils/vr-menus/message-box-menu';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import Application from 'explorviz-frontend/models/application';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import DS from 'ember-data';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';

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

  idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  hardwareModels: HardwareModels;

  messageBox!: MessageBoxMenu;

  constructor(owner: any, args: any) {
    super(owner, args);

    this.remoteUserGroup = new THREE.Group();
    this.hardwareModels = new HardwareModels();
  }

  initRendering() {
    super.initRendering();

    this.scene.add(this.remoteUserGroup);

    this.messageBox = new MessageBoxMenu(this.camera);

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

  addApplication(applicationModel: Application, origin: THREE.Vector3) {
    super.addApplicationTask.perform(applicationModel, origin,
      ((applicationObject3D: ApplicationObject3D) => {
        this.sender.sendAppOpened(applicationObject3D);
      }));
  }

  highlightAppEntity(object: THREE.Object3D, application: ApplicationObject3D) {
    if (this.localUser.color) {
      application.setHighlightingColor(this.localUser.color);
    }

    super.highlightAppEntity(object, application);

    if (object instanceof ComponentMesh || object instanceof ClazzMesh
      || object instanceof ClazzCommunicationMesh) {
      this.sender.sendHighlightingUpdate(application.dataModel.id, object.constructor.name,
        object.dataModel.id, object.highlighted);
    }
  }

  removeApplication(application: ApplicationObject3D) {
    super.removeApplication(application);

    this.sender.sendAppClosed(application.dataModel.id);
  }

  toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
    super.toggleComponentAndUpdate(componentMesh, applicationObject3D);

    this.sender.sendComponentUpdate(applicationObject3D.dataModel.id, componentMesh.dataModel.id,
      componentMesh.opened, false);
  }

  closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D) {
    super.closeAllComponentsAndUpdate(applicationObject3D);

    this.sender.sendComponentUpdate(applicationObject3D.dataModel.id, '', false, true);
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

    this.idToRemoteUser.forEach((user) => {
      user.removeAllObjects3D();
    });

    this.applicationGroup.children.forEach((child) => {
      if (child instanceof ApplicationObject3D) {
        child.setHighlightingColor(this.configuration.applicationColors.highlightedEntity);
      }
    });

    this.idToRemoteUser.clear();

    this.localUser.disconnect();
  }

  onEvent(event: string, data: any) {
    if (event !== 'user_positions') {
      // console.log('Event: ', event);
      // console.log('Data: ', data);
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
        this.onAppOpened(data.id, data.position, data.quaternion);
        break;
      case 'app_closed':
        this.onAppClosed(data.id);
        break;
      case 'app_binded':
        break;
      case 'app_released':
        break;
      case 'component_update':
        this.onComponentUpdate(data.isFoundation, data.appID, data.componentID);
        break;
      case 'hightlighting_update':
        this.onHighlightingUpdate(data);
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
    this.localUser.color = new THREE.Color().fromArray(data.color);

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

  /**
   * Loads specified controller 1 model for given user and add it to scene.
   *
   * @param {string} controllerName
   * @param {number} userID
   */
  loadController1(controllerName: string, userID: string) {
    const user = this.idToRemoteUser.get(userID);

    if (!user || !user.controller1) { return; }

    // user.initController1(controllerName, this.getControllerModelByName(controllerName));

    this.remoteUserGroup.add(user.controller1.model);
    // this.addLineToControllerModel(user.get('controller1'), user.get('color'));
  }

  onUserConnected(data: any) {
    const user = new RemoteVrUser();
    user.userName = data.name;
    user.ID = data.id;
    user.color = data.color;
    user.state = 'connected';

    this.idToRemoteUser.set(data.id, user);

    if (this.hardwareModels.hmd) { user.initCamera(this.hardwareModels.hmd); }

    // Add 3d-models for new user
    this.remoteUserGroup.add(user);

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

    const remoteUser = this.idToRemoteUser.get(id);
    if (remoteUser) {
      if (controller1) { remoteUser.updateController1(controller1); }
      if (controller2) { remoteUser.updateController2(controller2); }
      if (camera) { remoteUser.updateCamera(camera); }
    }
  }

  /**
   * Handles the (dis-)connect of the specified user's controller(s).
   *
   * @param {JSON} data - Contains id and controller information.
   */
  onUserControllers(data: any) {
    const { id, disconnect, connect } = data;

    const user = this.idToRemoteUser.get(id);
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
          user.removeController1();
        } else if (controller === 'controller2') {
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

    const user = this.idToRemoteUser.get(id);

    if (user) {
      // Remove user's 3d-objects
      user.removeAllObjects3D();
      this.remoteUserGroup.remove(user);
      this.idToRemoteUser.delete(id);

      // Show disconnect notification
      // this.get('menus.messageBox').enqueueMessage({ title: 'User disconnected',
      // text: user.get('name'), color: Helper.rgbToHex(user.get('color')) }, 3000);
    }
  }

  onInitialLandscape(data: any) {
    const { systems, nodeGroups, openApps } = data;

    this.setLandscapeState(systems, nodeGroups);

    openApps.forEach((app: any) => {
      this.addApplicationTask.perform(app.id);
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

  onAppPosition(appData: { appId: string, position: number[], quaternion: number[] }) {
    if (!this.applicationGroup.hasApplication(appData.appId)) {
      return;
    }
    const applicationMesh = this.applicationGroup.getApplication(appData.appId);

    if (applicationMesh) {
      applicationMesh.position.copy(new THREE.Vector3().fromArray(appData.position));
      applicationMesh.quaternion.copy(new THREE.Quaternion().fromArray(appData.quaternion));
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

  onAppOpened(id: string, position: number[], quaternion: number[]) {
    const application = this.store.peekRecord('application', id);
    if (application) {
      super.addApplication(application, new THREE.Vector3().fromArray(position));

      this.onAppPosition({ appId: id, position, quaternion });
    }
  }

  onAppClosed(id: string) {
    this.applicationGroup.removeApplicationById(id);
  }

  onComponentUpdate(isFoundation: boolean, appID: string, componentID: string) {
    const applicationObject3D = this.applicationGroup.getApplication(appID);
    if (!applicationObject3D) return;

    const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentID);

    if (isFoundation) {
      EntityManipulation.closeAllComponents(applicationObject3D);
    } else if (componentMesh instanceof ComponentMesh) {
      super.toggleComponentAndUpdate(componentMesh, applicationObject3D);
    }
  }

  onHighlightingUpdate(update: {
    userID: string, isHighlighted: boolean, appID: string, entityType: string, entityID: string,
  }) {
    const user = this.idToRemoteUser.get(update.userID);
    const applicationObject3D = this.applicationGroup.getApplication(update.appID);

    if (!applicationObject3D || !user || !user.color) return;

    if (!update.isHighlighted) {
      Highlighting.removeHighlighting(applicationObject3D);
      return;
    }

    // Highlight entities in the respective user color
    applicationObject3D.setHighlightingColor(new THREE.Color().fromArray(user.color));

    // Apply highlighting
    if (update.entityType === 'ComponentMesh' || update.entityType === 'ClazzMesh') {
      const boxMesh = applicationObject3D.getBoxMeshbyModelId(update.entityID);
      if (boxMesh instanceof ComponentMesh || boxMesh instanceof ClazzMesh) {
        Highlighting.highlight(boxMesh, applicationObject3D);
      }
    } else {
      const commMesh = applicationObject3D.getCommMeshByModelId(update.entityID);
      if (commMesh instanceof ClazzCommunicationMesh) {
        Highlighting.highlight(commMesh, applicationObject3D);
      }
    }
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
