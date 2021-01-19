import { inject as service } from '@ember/service';
import WebSocketService from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import THREE from 'three';
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
import GrabMenu, { isGrabbableObject } from 'virtual-reality/utils/vr-menus/pseudo-menu/grab-menu';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { perform } from 'ember-concurrency-ts';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import MultiUserMenu from 'virtual-reality/utils/vr-menus/multi-user-menu';
import Receiver, { MessageListener } from 'virtual-reality/utils/receiver';
import { MenuDistachedEvent } from 'virtual-reality/utils/vr-menus/menu-group';

export default class VrMultiUser extends VrRendering implements MessageListener {
  // #region CLASS FIELDS AND GETTERS

  debug = debugLogger('VrMultiUser');

  @service('web-socket')
  webSocket!: WebSocketService;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('delta-time')
  time!: DeltaTime;

  @service('spectate-user')
  spectateUser!: SpectateUser;

  // Used to format and send messages to the backend
  sender!: Sender;

  // Used to subscribe to response for requested.
  receiver!: Receiver;

  remoteUserGroup: THREE.Group;

  idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  // Contains clonable objects of HMD, camera and controllers for other users
  hardwareModels: HardwareModels;

  messageBox!: MessageBoxMenu;

  detachedMenus!: THREE.Group;


  getRemoteUsers() {
    return this.idToRemoteUser;
  }

  // #endregion CLASS FIELDS AND GETTERS

  // #region INIT

  constructor(owner: any, args: any) {
    super(owner, args);

    this.remoteUserGroup = new THREE.Group();
    this.detachedMenus = new THREE.Group();
    this.hardwareModels = new HardwareModels();

  }

  initRendering() {
    super.initRendering();

    this.scene.add(this.remoteUserGroup);

    this.messageBox = new MessageBoxMenu(this.camera);

    this.sender = new Sender(this.webSocket);
    this.receiver = new Receiver(this.webSocket, this);
    this.webSocket.socketCloseCallback = this.onDisconnect.bind(this);

    this.localUser.state = 'offline';

    $.getJSON('config/config_multiuser.json').then(bind(this.webSocket, this.webSocket.applyConfiguration));
  }

  initControllers() {
    super.initControllers();

    let listener = (event: MenuDistachedEvent) => {
      let menuContainer = event.menuContainer;
      this.detachedMenus.add(menuContainer);
      this.scene.add(menuContainer);
      const position = new THREE.Vector3;
      const quaternion = new THREE.Quaternion;
      menuContainer.menu.getWorldPosition(position);
      menuContainer.menu.getWorldQuaternion(quaternion);
      const nonce = this.sender.sendMenuDetached(menuContainer.menu.getDetachId(), position, quaternion);
      this.receiver.awaitResponse(nonce, (response: { objectId: string }) => {
        menuContainer.grabId = response.objectId;
      });
    };

    if (this.localUser.controller1) {
      this.localUser.controller1.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller1.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
      this.localUser.controller1.menuGroup.addEventListener('menu_distached', listener);
      this.localUser.controller1.intersectableObjects.push(this.detachedMenus);
    }

    if (this.localUser.controller2) {
      this.localUser.controller2.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller2.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
      this.localUser.controller2.menuGroup.addEventListener('menu_distached', listener);
      this.localUser.controller2.intersectableObjects.push(this.detachedMenus);
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

  grabIntersectedObject(controller: VRController) {
    if (!controller.intersectedObject || !controller.ray) return;

    const { object: { parent: object } } = controller.intersectedObject;
    if (object && isGrabbableObject(object)) {
      controller.menuGroup.openMenu(new GrabMenu(object, this.sender, this.receiver));
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

  // #endregion INPUT EVENTS

  // #region REMOTE EVENT HANDLER

  onDisconnect(event?: any) {
    if (this.localUser.state === 'connecting') {
      super.showHint('VR service not responding');
    } else if (event) {
      switch (event.code) {
        case 1000: // Normal Closure
          super.showHint('Successfully disconnected');
          break;
        case 1006: // Abnormal closure
          super.showHint('VR service closed abnormally');
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
  onSelfConnected(
    self: { id: string, name: string, color: number[] },
    users: {
      id: string, name: string, color: number[],
      controllers: { controller1: string, controller2: string }
    }[]
  ): void {
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

  onUserConnected(
    id: string,
    name: string,
    color: number[],
    showConnectMessage = true
  ): void {
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
  onUserPositions(
    userID: string,
    camera: { position: number[], quaternion: number[] },
    controller1: { position: number[], quaternion: number[] },
    controller2: { position: number[], quaternion: number[] }
  ): void {

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
  onUserControllers(
    userID: string,
    connect: { controller1: string, controller2: string },
    disconnect: { controller1: string, controller2: string }
  ): void {

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

  onInitialLandscape(
    openApps: {
      id: string,
      position: number[],
      quaternion: number[],
      openComponents: string[],
      highlightedComponents: {
        userID: string,
        appID: string,
        entityType: string,
        entityID: string,
        isHighlighted: boolean
      }[]
    }[],
    landscape: {
      position: number[],
      quaternion: number[]
    }
  ): void {

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

    this.landscapeObject3D.position.fromArray(landscape.position);
    this.landscapeObject3D.quaternion.fromArray(landscape.quaternion);
  }

  onAppOpened(
    id: string,
    position: number[],
    quaternion: number[]
  ): void {
    const { structureLandscapeData } = this.args.landscapeData;
    const application = getApplicationInLandscapeById(structureLandscapeData, id);

    if (application) {
      super.addApplication(application, new THREE.Vector3().fromArray(position));

      this.setAppPose(id, new THREE.Vector3().fromArray(position),
        new THREE.Quaternion().fromArray(quaternion));
    }
  }

  onAppClosed(id: string): void {
    const application = this.applicationGroup.getApplication(id);

    if (application !== undefined) {
      super.removeApplication(application);
    }
  }

  onObjectMoved(
    objectId: string,
    position: number[],
    quaternion: number[]
  ): void {
    // The moved object can be any of the intersectable objects.
    for (let object of this.interaction.raycastObjects) {
      if (isGrabbableObject(object) && object.getGrabId() == objectId) {
        object.position.fromArray(position);
        object.quaternion.fromArray(quaternion);
        break;
      }
    }
  }

  onComponentUpdate(
    isFoundation: boolean,
    appID: string,
    componentID: string
  ): void {
    const applicationObject3D = this.applicationGroup.getApplication(appID);
    if (!applicationObject3D) return;

    const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentID);

    if (isFoundation) {
      EntityManipulation.closeAllComponents(applicationObject3D);
    } else if (componentMesh instanceof ComponentMesh) {
      super.toggleComponentAndUpdate(componentMesh, applicationObject3D);
    }
  }

  onHighlightingUpdate(
    userID: string,
    isHighlighted: boolean,
    appID: string,
    entityType: string,
    entityID: string
  ): void {
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
  onSpectatingUpdate(userID: string, isSpectating: boolean): void {
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
    const poses = Helper.getPoses(
      this.localUser.camera,
      this.localUser.controller1,
      this.localUser.controller2
    );
    this.sender.sendPoseUpdate(poses.camera, poses.controller1, poses.controller2);
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
