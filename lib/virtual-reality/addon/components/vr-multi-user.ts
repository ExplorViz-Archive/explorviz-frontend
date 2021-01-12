import { inject as service } from '@ember/service';
import WebSocket from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import THREE, { Quaternion } from 'three';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import HardwareModels from 'virtual-reality/utils/vr-multi-user/hardware-models';
import VrRendering from 'virtual-reality/components/vr-rendering';
import Sender from 'virtual-reality/utils/vr-multi-user/sender';
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import MessageBoxMenu from 'virtual-reality/utils/vr-menus/message-box-menu';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import NameTagMesh from 'virtual-reality/utils/view-objects/vr/name-tag-mesh';
import MainMenu from 'virtual-reality/utils/vr-menus/main-menu';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { perform } from 'ember-concurrency-ts';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import MultiUserMenu from 'virtual-reality/utils/vr-menus/multi-user-menu';

export default class VrMultiUser extends VrRendering {
  // #region CLASS FIELDS AND GETTERS

  debug = debugLogger('VrMultiUser');

  @service('web-socket')
  webSocket!: WebSocket;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  time!: DeltaTime;

  @service('spectate-user')
  spectateUser!: SpectateUser;

  // Used to format and send messages to the backend
  sender!: Sender;

  remoteUserGroup: THREE.Group;

  idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  // Contains clonable objects of HMD, camera and controllers for other users
  hardwareModels: HardwareModels;

  messageBox!: MessageBoxMenu;

  getRemoteUsers() {
    return this.idToRemoteUser;
  }

  // #endregion CLASS FIELDS AND GETTERS

  // #region INIT

  constructor(owner: any, args: any) {
    super(owner, args);

    this.remoteUserGroup = new THREE.Group();
    this.hardwareModels = new HardwareModels();
  }

  initRendering() {
    super.initRendering();

    this.scene.add(this.remoteUserGroup);

    this.messageBox = new MessageBoxMenu(this.camera);

    this.initWebSocketCallbacks();

    this.sender = new Sender(this.webSocket);

    this.localUser.state = 'offline';

    $.getJSON('config/config_multiuser.json').then(bind(this.webSocket, this.webSocket.applyConfiguration));
  }

  initWebSocketCallbacks() {
    this.webSocket.socketCloseCallback = this.onDisconnect.bind(this);
    this.webSocket.eventCallback = this.onEvent.bind(this);
  }

  initControllers() {
    super.initControllers();

    if (this.localUser.controller1) {
      this.localUser.controller1.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller1.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
    }

    if (this.localUser.controller2) {
      this.localUser.controller2.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller2.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
    }
  }

  // #endregion INIT

  /**
  * Main loop contains all methods which need to be called
  * for every rendering iteration
  */
  render() {
    super.render();

    if (!this.localUser.isOnline && !this.localUser.isConnecting) return;

    if (this.spectateUser.isActive) {
      this.spectateUser.update();
    }

    this.updateUserNameTags();
    this.sendPoses();
    this.sendLandscapePosition();
    this.webSocket.sendUpdates();
  }

  // #region MENUS

  openMainMenu(controller: VRController) {
    if (!this.localUser.controller1) return;

    controller.menuGroup.openMenu(new MainMenu({
      openSettingsMenu: this.openSettingsMenu.bind(this, controller),
      openMultiUserMenu: this.openMultiUserMenu.bind(this, controller),
      openResetMenu: this.openResetMenu.bind(this, controller)
    }));
  }

  openMultiUserMenu(controller: VRController) {
    const menu = new MultiUserMenu(
      this.localUser.toggleConnection.bind(this.localUser),
      this.localUser,
      this.spectateUser,
      this.idToRemoteUser,
      this.getRemoteUsers.bind(this)
    );

    controller.menuGroup.openMenu(menu);
  }


  // #endregion MENUS

  // #region INPUT EVENTS

  async onControllerConnected(controller: VRController /* , event: THREE.Event */) {
    // Set visibilty and rays accordingly
    if (this.spectateUser.isActive) controller.setToSpectatingAppearance();
    else controller.setToDefaultAppearance();

    // Prepare update message for other users
    let connect: { controller1?: string, controller2?: string };
    const motionController = await controller.controllerModel.motionControllerPromise;
    if (controller === this.localUser.controller1) {
      connect = { controller1: motionController.assetUrl };
    } else {
      connect = { controller2: motionController.assetUrl };
    }
    const disconnect = {};

    if (this.localUser.isOnline) {
      this.sender.sendControllerUpdate(connect, disconnect);
    }
  }

  onControllerDisconnected(controller: VRController) {
    // Avoid that user could get stuck in spectate view
    this.spectateUser.deactivate();

    let disconnect: { controller1?: string, controller2?: string };

    if (controller === this.localUser.controller1) {
      disconnect = { controller1: controller.gamepadId };
    } else {
      disconnect = { controller2: controller.gamepadId };
    }

    if (this.localUser.isOnline) {
      this.sender.sendControllerUpdate({}, disconnect);
    }
  }

  isObjectGrabable(object: THREE.Object3D): boolean {
    if (object instanceof ApplicationObject3D) {
      if (this.applicationGroup.isApplicationGrabbed(object.dataModel.pid)) {
        this.showHint('Application already grabbed');
        return false;
      }
    }
    return super.isObjectGrabable(object);
  }

  onGrabObject(object: THREE.Object3D, controller: VRController): void {
    super.onGrabObject(object, controller);
    if (object instanceof ApplicationObject3D) {
      this.sender.sendAppGrabbed(object, controller);
    }
  }

  onReleaseObject(object: THREE.Object3D, controller: VRController) {
    super.onReleaseObject(object, controller);
    if (object instanceof ApplicationObject3D && this.localUser.isOnline) {
      this.sender.sendAppReleased(object);
    }
  }

  handlePrimaryInputOn(intersection: THREE.Intersection) {
    if (this.spectateUser.spectatedUser) {
      const { object, uv } = intersection;
      if (object instanceof MultiUserMenu && uv) {
        object.triggerDown(uv);
      }
      return;
    }

    super.handlePrimaryInputOn(intersection);
  }

  handleSecondaryInputOn(intersection: THREE.Intersection) {
    if (this.spectateUser.spectatedUser) {
      return;
    }

    super.handleSecondaryInputOn(intersection);
  }

  translateApplication(application: THREE.Object3D, direction: THREE.Vector3, length: number) {
    super.translateApplication(application, direction, length);

    if (application instanceof ApplicationObject3D && this.localUser.isOnline) {
      this.sender.sendAppTranslationUpdate(application.dataModel.pid, direction, length);
    }
  }

  // #endregion INPUT EVENTS

  // #region REMOTE EVENT HANDLER

  onEvent(event: string, data: any) {
    switch (event) {
      case 'forward':
        this.onForwardEvent(data);
        break;
      case 'self_connected':
        this.onSelfConnected(data.self, data.users);
        break;
      case 'user_connected':
        this.onUserConnected(data.id, data.name, data.color);
        break;
      case 'user_disconnect':
        this.onUserDisconnect(data.id);
        break;
      case 'landscape':
        this.onInitialLandscape(data.openApps, data.landscape);
        break;
      default:
        break;
    }
  }

  onForwardEvent(data: any) {
    var message = data.originalMessage;
    var userID = data.userID;
    switch (message.event) {
      case 'user_positions':
        this.onUserPositions(userID, message.camera, message.controller1, message.controller2);
        break;
      case 'user_controllers':
        this.onUserControllers(userID, message.connect, message.disconnect);
        break;
      case 'landscape_position':
        this.onLandscapePosition(message.position, message.quaternion);
        break;
      case 'app_translated':
        this.onAppTranslation(message.appId, message.direction, message.length);
        break;
      case 'app_opened':
        this.onAppOpened(message.id, message.position, message.quaternion);
        break;
      case 'app_closed':
        this.onAppClosed(message.appID);
        break;
      case 'app_grabbed':
        this.onAppGrabbed(userID, message.appID, message.appPosition, message.appQuaternion, message.isGrabbedByController1);
        break;
      case 'app_released':
        this.onAppReleased(message.id, message.position, message.quaternion);
        break;
      case 'component_update':
        this.onComponentUpdate(message.isFoundation, message.appID, message.componentID);
        break;
      case 'hightlighting_update':
        this.onHighlightingUpdate(userID, message.isHighlighted, message.appID, message.entityType, message.entityID);
        break;
      case 'spectating_update':
        this.onSpectatingUpdate(userID, message.isSpectating);
        break;

    }
  }

  onDisconnect(event?: any) {
    if (this.localUser.state === 'connecting') {
      super.showHint('Backend extension not responding');
    } else if (event) {
      switch (event.code) {
        case 1000: // Normal Closure
          super.showHint('Successfully disconnected');
          break;
        case 1006: // Abnormal closure
          super.showHint('Backend extension not responding');
          break;
        default:
          super.showHint('Unexpected disconnect');
      }
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

  /**
   * After succesfully connecting to the backend, create and spawn other users.
   *
   * @param {JSON} data Message containing data on other users.
   */
  onSelfConnected(self: {id: string, name: string, color: number[]}, users: {id:string, name: string, color: number[], 
    controllers: {controller1: string, controller2: string}}[]) {
    // Create User model for all users and add them to the users map
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      this.onUserConnected(userData.id, userData.name, userData.color, false);
    }
    this.localUser.state = 'online';
    this.localUser.userID = self.id;
    this.localUser.color = new THREE.Color().fromArray(self.color);
    this.localUser.userName = self.name;

    this.sendInitialControllerConnectState();
  }

  /**
   * Loads specified controller 1 model for given user and add it to scene.
   *
   * @param {string} assetUrl
   * @param {number} userID
   */
  loadController1(assetUrl: string, userID: string) {
    const user = this.idToRemoteUser.get(userID);
    user?.initController1(assetUrl);
  }

  /**
   * Loads specified controller 2 model for given user and add it to scene.
   *
   * @param {string} assetUrl
   * @param {number} userID
   */
  loadController2(assetUrl: string, userID: string) {
    const user = this.idToRemoteUser.get(userID);
    user?.initController2(assetUrl);
  }

  onUserConnected(id: string, name: string, color: number[], showConnectMessage = true) {
    // If a user triggers multiple connects, simulate a disconnect first
    if (this.idToRemoteUser.has(id)) {
      this.onUserDisconnect(id);
    }

    const user = new RemoteVrUser();
    user.userName = name;
    user.ID = id;
    user.color = new THREE.Color().fromArray(color);
    user.state = 'online';

    this.idToRemoteUser.set(id, user);

    if (this.hardwareModels.hmd) { user.initCamera(this.hardwareModels.hmd); }

    // Add 3d-models for new user
    this.remoteUserGroup.add(user);

    // Add name tag
    Helper.addDummyNamePlane(user);
    const nameTag = new NameTagMesh(user.userName, user.color);
    user.nameTag = nameTag;
    user.add(nameTag);

    if (showConnectMessage) {
      this.messageBox.enqueueMessage({
        title: 'User connected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
      }, 3000);
    }
  }

  /**
   * Updates the specified user's camera and controller positions.
   *
   * @param {JSON} data - Data needed to update positions.
   */
  onUserPositions(userID: string, camera: { position: number[], quaternion: number[] },
    controller1: { position: number[], quaternion: number[] },
    controller2: { position: number[], quaternion: number[] }) {

    const remoteUser = this.idToRemoteUser.get(userID);
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
  onUserControllers(userID: string, connect: { controller1: string, controller2: string }, disconnect: { controller1: string, controller2: string }) {

    // Load newly connected controller(s)
    if (connect) {
      if (connect.controller1) { this.loadController1(connect.controller1, userID); }
      if (connect.controller2) { this.loadController2(connect.controller2, userID); }
    }

    const user = this.idToRemoteUser.get(userID);
    if (!user) { return; }

    // Remove controller model(s) due to controller disconnect
    if (disconnect) {
      if (disconnect.controller1) { user.removeController1(); }
      if (disconnect.controller2) { user.removeController2(); }
    }
  }

  /**
   * Removes the user that disconnected and informs our user about it.
   *
   * @param {JSON} data - Contains the id of the user that disconnected.
   */
  onUserDisconnect(id: string) {

    // Do not spectate a disconnected user
    if (this.spectateUser.spectatedUser?.ID === id) {
      this.spectateUser.deactivate();
    }

    const user = this.idToRemoteUser.get(id);

    if (user) {
      // Remove user's 3d-objects
      user.removeAllObjects3D();
      this.remoteUserGroup.remove(user);
      this.idToRemoteUser.delete(id);

      // Show disconnect notification
      this.messageBox.enqueueMessage({
        title: 'User disconnected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
      }, 3000);
    }
  }

  async onInitialLandscape(openApps: {id: string, position: number[], quaternion: number[], openComponents: string[], 
    highlightedComponents: {userID: string, appID: string, entityType: string, entityID: string, isHighlighted: boolean}[]}[],
    landscape: {position: number[], quaternion: number[]}) {

    this.removeAllApplications();

    const { structureLandscapeData } = this.args.landscapeData;

    openApps.forEach((app: any) => {
      const application = getApplicationInLandscapeById(structureLandscapeData, app.id);
      if (application) {
        perform(this.addApplicationTask, application, new THREE.Vector3(),
          (applicationObject3D: ApplicationObject3D) => {
            const position = new THREE.Vector3().fromArray(app.position);
            const quaternion = new THREE.Quaternion().fromArray(app.quaternion);

            applicationObject3D.worldToLocal(position);

            applicationObject3D.position.copy(position);
            applicationObject3D.quaternion.copy(quaternion);

            EntityManipulation.restoreComponentState(applicationObject3D,
              new Set(app.openComponents));

            this.addLabels(applicationObject3D);

            const drawableComm = this.drawableClassCommunications
              .get(applicationObject3D.dataModel.pid);

            if (drawableComm) {
              this.appCommRendering.addCommunication(applicationObject3D, drawableComm);
              Highlighting.updateHighlighting(applicationObject3D, drawableComm);
            }

            app.highlightedComponents.forEach((highlightingUpdate: any) => {
              this.onHighlightingUpdate(highlightingUpdate.userID, highlightingUpdate.isHighlighted, highlightingUpdate.appID, 
                highlightingUpdate.entityType, highlightingUpdate.entityID);
            });
          });
      }
    });

    this.onLandscapePosition(landscape.position, landscape.quaternion);
  }

  onLandscapePosition(position: number[], quaternion: number[]) {
    if (quaternion) {
      super.updateLandscapeRotation(new Quaternion().fromArray(quaternion));
    }
    if (position) {
      this.landscapeObject3D.position.set(position[0], position[1], position[2]);
    }
  }

  onAppTranslation(id: string, direction: number[], length: number) {
    const applicationMesh = this.applicationGroup.getApplication(id);

    if (applicationMesh) {
      super.translateApplication(applicationMesh, new THREE.Vector3().fromArray(direction), length);
    }
  }

  onAppOpened(id: string, position: number[], quaternion: number[]) {
    const { structureLandscapeData } = this.args.landscapeData;
    const application = getApplicationInLandscapeById(structureLandscapeData, id);

    if (application) {
      super.addApplication(application, new THREE.Vector3().fromArray(position));

      this.setAppPose(id, new THREE.Vector3().fromArray(position),
        new THREE.Quaternion().fromArray(quaternion));
    }
  }

  onAppClosed(id: string) {
    const application = this.applicationGroup.getApplication(id);

    if (application !== undefined) {
      super.removeApplication(application);
    }
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

  onAppGrabbed(userID: string, appID: string, appPosition: number[],appQuaternion: number[], 
    isGrabbedByController1: boolean) {

  super.setAppPose(appID, new THREE.Vector3().fromArray(appPosition),
    new THREE.Quaternion().fromArray(appQuaternion), true);

  const remoteUser = this.idToRemoteUser.get(userID);

  if (!remoteUser) {
    return;
  }

  let controller: THREE.Object3D | null = null;
  let ray: THREE.Object3D | null = null;

  if (isGrabbedByController1 && remoteUser.controller1) {
    controller = remoteUser.controller1.model;
    ray = remoteUser.controller1.ray;
  } else if (remoteUser.controller2) {
    controller = remoteUser.controller2.model;
    ray = remoteUser.controller2.ray;
  }

  const application = this.applicationGroup.getApplication(appID);

  if (controller && ray && application) {
    const controllerMatrix = new THREE.Matrix4();
    controllerMatrix.identity().extractRotation(ray.matrixWorld);
    // Get inverse of controller transformation
    controllerMatrix.getInverse(controller.matrixWorld);

    // Set transforamtion relative to controller transformation
    application.matrix.premultiply(controllerMatrix);
    // Split up matrix into position, quaternion and scale
    application.matrix.decompose(application.position, application.quaternion, application.scale);

    this.applicationGroup.attachApplicationTo(appID, controller);
  }
}

onAppReleased(id: string, position: number[], quaternion: number[]) {
  const application = this.applicationGroup.getApplication(id);
  if (application) {
    // Transform object back into transformation relative to local space
    if (application.parent) {
      application.matrix.premultiply(application.parent.matrixWorld);
    }
    // Split up transforamtion into position, quaternion and scale
    application.matrix.decompose(application.position, application.quaternion, application.scale);

    this.applicationGroup.releaseApplication(id);

    super.setAppPose(id, new THREE.Vector3().fromArray(position),
      new THREE.Quaternion().fromArray(quaternion));
  }
}

onHighlightingUpdate(userID: string, isHighlighted: boolean, appID: string, entityType: string, entityID: string) {

  const applicationObject3D = this.applicationGroup.getApplication(appID);

  if (!applicationObject3D) return;

  if (!isHighlighted) {
    Highlighting.removeHighlighting(applicationObject3D);
    return;
  }

  const user = this.idToRemoteUser.get(userID);

  if (!user || !user.color) return;

  // Highlight entities in the respective user color
  applicationObject3D.setHighlightingColor(user.color);

  const drawableComm = this.drawableClassCommunications
    .get(applicationObject3D.dataModel.pid);

  // Apply highlighting
  if (entityType === 'ComponentMesh' || entityType === 'ClazzMesh') {
    const boxMesh = applicationObject3D.getBoxMeshbyModelId(entityID);
    if (boxMesh instanceof ComponentMesh || boxMesh instanceof ClazzMesh) {
      if (drawableComm) {
        Highlighting.highlight(boxMesh, applicationObject3D, drawableComm);
      }
    }
  } else {
    // The target and source class id of communication
    const classIds = new Set<string>(entityID.split('###'));

    applicationObject3D.getCommMeshes().forEach((commMesh) => {
      if (classIds.has(commMesh.dataModel.sourceClass.id)
        && classIds.has(commMesh.dataModel.targetClass.id)) {
        if (drawableComm) {
          Highlighting.highlight(commMesh, applicationObject3D, drawableComm);
        }
      }
    });
  }
}

/**
* Updates the state of given user to spectating or connected.
* Hides them if spectating.
*
* @param {number} userID - The user's id.
* @param {boolean} isSpectating - True, if the user is now spectating, else false.
*/
onSpectatingUpdate(userID: string, isSpectating: boolean) {
  const remoteUser = this.idToRemoteUser.get(userID);

  if (!remoteUser) return;

  remoteUser.state = isSpectating ? 'spectating' : 'online';

  const remoteUserHexColor = `#${remoteUser.color.getHexString()}`;
  if (isSpectating) {
    remoteUser.setVisible(false);
    if (this.spectateUser.spectatedUser && this.spectateUser.spectatedUser.ID === userID) {
      this.spectateUser.deactivate();
    }
    this.messageBox.enqueueMessage({ title: remoteUser.userName, text: ' is now spectating', color: remoteUserHexColor }, 2000);
  } else {
    remoteUser.setVisible(true);
    this.messageBox.enqueueMessage({ title: remoteUser.userName, text: ' stopped spectating', color: remoteUserHexColor }, 2000);
  }
}

// #endregion REMOTE EVENT HANDLER

// #region UTIL

sendPoses() {
  const { camera, controller1, controller2 } = this.localUser;

  const poses = Helper.getPoses(camera, controller1, controller2);

  this.sender.sendPoseUpdate(poses.camera, poses.controller1, poses.controller2);
}

sendLandscapePosition() {
  const controllers = [this.localUser.controller1, this.localUser.controller2];

  controllers.forEach(controller => {
    if (controller) {
      const grabbedObject = controller.grabbedObject;
      if (grabbedObject instanceof LandscapeObject3D) {
        const position = new THREE.Vector3();
        this.landscapeObject3D.updateMatrixWorld();
        this.landscapeObject3D.getWorldPosition(position);
        const quaternion = new THREE.Quaternion();
        this.landscapeObject3D.getWorldQuaternion(quaternion);
        this.sender.sendLandscapeUpdate(position, quaternion, this.landscapeOffset);
      }
    }
  });
}

sendInitialControllerConnectState() {
  if (this.localUser.isOnline) {
    const connect: { controller1?: string, controller2?: string } = {};
    if (this.localUser.controller1?.connected) {
      connect.controller1 = this.localUser.controller1.controllerModel.motionController?.assetUrl;
    }
    if (this.localUser.controller2?.connected) {
      connect.controller2 = this.localUser.controller2.controllerModel.motionController?.assetUrl;
    }
    this.sender.sendControllerUpdate(connect, {});
  }
}

resetAll() {
  // Do not allow to reset everything for collaborative work
  if (this.localUser.isOnline) {
    this.showHint('Reset all is disabled in online mode');
    return;
  }

  super.resetAll();
}

/**
 * Set user name tag to be directly above their head
 * and set rotation such that it looks toward our camera.
 */
updateUserNameTags() {
  this.idToRemoteUser.forEach((user) => {
    const dummyPlane = user.getObjectByName('dummyNameTag');
    if (user.state === 'online' && user.nameTag && user.camera && dummyPlane && this.localUser.camera) {
      user.nameTag.position.setFromMatrixPosition(dummyPlane.matrixWorld);
      user.nameTag.lookAt(this.localUser.camera.getWorldPosition(new THREE.Vector3()));
    }
  });
}

/**
 * Uses the addApplication Task of vr-rendering to add an application to the scene.
 * Additionally, a callback function is given to send an update to the backend.
 */
addApplication(applicationModel: Application, origin: THREE.Vector3) {
  if (applicationModel.packages.length === 0) {
    this.showHint('No data available');
    return;
  }

  if (!this.applicationGroup.hasApplication(applicationModel.pid)) {
    perform(super.addApplicationTask, applicationModel, origin,
      ((applicationObject3D: ApplicationObject3D) => {
        if (this.localUser.isOnline) {
          this.sender.sendAppOpened(applicationObject3D);
        }
      }));
  } else {
    this.showHint('Application already opened');
  }
}

highlightAppEntity(object: THREE.Object3D, application: ApplicationObject3D) {
  if (this.localUser.color) {
    application.setHighlightingColor(this.localUser.color);
  }

  super.highlightAppEntity(object, application);

  if (this.localUser.isOnline) {
    if (object instanceof ComponentMesh || object instanceof ClazzMesh) {
      this.sender.sendHighlightingUpdate(application.dataModel.pid, object.constructor.name,
        object.dataModel.id, object.highlighted);
    } else if (object instanceof ClazzCommunicationMesh) {
      const { sourceClass, targetClass } = object.dataModel;

      // this is necessary, since drawable class communications are created on
      // client side, thus their ids do not match, since they are uuids
      let combinedId: string;
      if (sourceClass.id < targetClass.id) {
        combinedId = `${sourceClass.id}###${targetClass.id}`;
      } else {
        combinedId = `${targetClass.id}###${sourceClass.id}`;
      }

      this.sender.sendHighlightingUpdate(application.dataModel.pid, object.constructor.name,
        combinedId, object.highlighted);
    }
  }
}

removeApplication(application: ApplicationObject3D) {
  if (this.applicationGroup.isApplicationGrabbed(application.dataModel.pid)) {
    this.showHint('Application is grabbed');
    return;
  }

  super.removeApplication(application);

  if (this.localUser.isOnline) {
    this.sender.sendAppClosed(application.dataModel.pid);
  }
}

removeAllApplications() {
  this.applicationGroup.clear();

  const filterAppsFn = (object: THREE.Object3D) => !(object instanceof ApplicationObject3D);

  if (this.localUser.controller1) {
    this.localUser.controller1.filterIntersectableObjects(filterAppsFn);
  }
  if (this.localUser.controller2) {
    this.localUser.controller2.filterIntersectableObjects(filterAppsFn);
  }
}

toggleComponentAndUpdate(componentMesh: ComponentMesh, applicationObject3D: ApplicationObject3D) {
  super.toggleComponentAndUpdate(componentMesh, applicationObject3D);

  if (this.localUser.isOnline) {
    this.sender.sendComponentUpdate(applicationObject3D.dataModel.pid, componentMesh.dataModel.id,
      componentMesh.opened, false);
  }
}

closeAllComponentsAndUpdate(applicationObject3D: ApplicationObject3D) {
  super.closeAllComponentsAndUpdate(applicationObject3D);

  if (this.localUser.isOnline) {
    this.sender.sendComponentUpdate(applicationObject3D.dataModel.pid, '', false, true);
  }
}

// #endregion UTIL

/*
 * This overridden Ember Component lifecycle hook enables calling
 * ExplorViz's custom cleanup code.
 *
 * @method willDestroy
 */
willDestroy() {
  super.willDestroy();
  this.localUser.disconnect();
  this.spectateUser.reset();
}
}
