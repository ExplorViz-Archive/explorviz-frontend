import { inject as service } from '@ember/service';
import WebSocketService from 'virtual-reality/services/web-socket';
import SpectateUser from 'virtual-reality/services/spectate-user';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import DeltaTime from 'virtual-reality/services/delta-time';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import THREE, { Vector3 } from 'three';
import * as EntityManipulation from 'explorviz-frontend/utils/application-rendering/entity-manipulation';
import HardwareModels from 'virtual-reality/utils/vr-multi-user/hardware-models';
import VrRendering from 'virtual-reality/components/vr-rendering';
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import * as Helper from 'virtual-reality/utils/vr-helpers/multi-user-helper';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import MessageBoxMenu from 'virtual-reality/utils/vr-menus/ui-menu/message-box-menu';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import * as Highlighting from 'explorviz-frontend/utils/application-rendering/highlighting';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import NameTagMesh from 'virtual-reality/utils/view-objects/vr/name-tag-mesh';
import MainMenu from 'virtual-reality/utils/vr-menus/ui-menu/main-menu';
import GrabMenu, { isGrabbableObject, findGrabbableObject } from 'virtual-reality/utils/vr-menus/ui-less-menu/grab-menu';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { perform } from 'ember-concurrency-ts';
import { getApplicationInLandscapeById } from 'explorviz-frontend/utils/landscape-structure-helpers';
import MultiUserMenu from 'virtual-reality/utils/vr-menus/ui-menu/multi-user-menu';
import { MenuDetachedEvent, MENU_DETACH_EVENT_TYPE } from 'virtual-reality/utils/vr-menus/menu-group';

import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import { ForwardedMessage, FORWARDED_EVENT } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { UserControllerMessage, USER_CONTROLLER_EVENT } from 'virtual-reality/utils/vr-message/sendable/user_controllers';
import { UserDisconnectedMessage, USER_DISCONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { HighlightingUpdateMessage, HIGHLIGHTING_UPDATE_EVENT } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import { SpectatingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/spectating_update';
import { isMenuDetachedResponse, MenuDetachedResponse } from 'virtual-reality/utils/vr-message/receivable/response/menu-detached';
import { SelfConnectedMessage } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import { UserPositionsMessage } from 'virtual-reality/utils/vr-message/sendable/user_positions';
import { InitialLandscapeMessage } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { ObjectMovedMessage } from 'virtual-reality/utils/vr-message/sendable/object_moved';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import CloseIcon from 'virtual-reality/utils/view-objects/vr/close-icon';
import { MenuDetachedForwardMessage } from 'virtual-reality/utils/vr-message/receivable/menu-detached-forward';
import DetailInfoMenu from 'virtual-reality/utils/vr-menus/ui-menu/detail-info-menu';
import { isEntityMesh } from 'virtual-reality/utils/vr-helpers/detail-info-composer';
import { DetachedMenuClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/detached_menu_closed';
import { isObjectClosedResponse, ObjectClosedResponse } from 'virtual-reality/utils/vr-message/receivable/response/object-closed';
import { DetachableMenu } from 'virtual-reality/utils/vr-menus/detachable-menu';
import { GrabbableMenuContainer } from 'virtual-reality/utils/vr-menus/grabbable-menu-container';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping-update';
import GrabbedObjectService from 'virtual-reality/services/grabbed-object';
import PingMenu from 'virtual-reality/utils/vr-menus/ui-less-menu/ping-menu';

export default class VrMultiUser extends VrRendering implements VrMessageListener {
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

  @service('vr-message-sender')
  sender!: VrMessageSender;

  @service('vr-message-receiver')
  receiver!: VrMessageReceiver;
  
  @service('grabbed-object')
  grabbedObjectService!: GrabbedObjectService;

  remoteUserGroup: THREE.Group;

  idToRemoteUser: Map<string, RemoteVrUser> = new Map();

  // Contains clonable objects of HMD, camera and controllers for other users
  hardwareModels: HardwareModels;

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
    this.initWebSocket();
  }

  initWebSocket() {
    this.webSocket.socketCloseCallback = this.onDisconnect.bind(this);
    this.receiver.addMessageListener(this);
    this.localUser.state = 'offline';
    $.getJSON('config/config_multiuser.json').then(bind(this.webSocket, this.webSocket.applyConfiguration));
  }

  initScene() {
    super.initScene();
    this.scene.add(this.remoteUserGroup);
  }

  initControllers() {
    super.initControllers();

    let menuDetachListener = ({menu}: MenuDetachedEvent) => {
      // Notify backend about detached menu.
      const nonce = this.sender.sendMenuDetached(menu);

      // Wait for backend to assign an id to the detached menu.
      this.receiver.awaitResponse({
        nonce,
        responseType: isMenuDetachedResponse, 
        onResponse: (response: MenuDetachedResponse) => {
          this.addDetachedMenu(menu, response.objectId);
        },
        onOffline: () => {
          this.addDetachedMenu(menu, null);
        }
      });
    };

    if (this.localUser.controller1) {
      this.localUser.controller1.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller1.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
      this.localUser.controller1.menuGroup.addEventListener(MENU_DETACH_EVENT_TYPE, menuDetachListener);
    }

    if (this.localUser.controller2) {
      this.localUser.controller2.eventCallbacks.connected = this.onControllerConnected.bind(this);
      this.localUser.controller2.eventCallbacks.disconnected = this
        .onControllerDisconnected.bind(this);
      this.localUser.controller2.menuGroup.addEventListener(MENU_DETACH_EVENT_TYPE, menuDetachListener);
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
    this.grabbedObjectService.sendObjectPositions();

    this.updateRemoteUsers();
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

  openPingMenu(controller: VRController) {
    controller.menuGroup.openMenu(new PingMenu(this.scene, this.sender));
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

    let object: THREE.Object3D|null = controller.intersectedObject.object;
    while (object) {
      if (isGrabbableObject(object)) {
        controller.menuGroup.openMenu(new GrabMenu(object, this.grabbedObjectService, this.time));
        break;
      } else {
        object = object.parent;
      }
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
  onSelfConnected({ self, users }: SelfConnectedMessage): void {
    // Create User model for all users and add them to the users map by
    // simulating the event of a user connecting.
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      this.onUserConnected({
        event: USER_CONNECTED_EVENT,
        id: userData.id,
        name: userData.name,
        color: userData.color
      }, false);
      this.onUserControllers({
        event: FORWARDED_EVENT,
        userID: userData.id, 
        originalMessage: {
          event: USER_CONTROLLER_EVENT,
          connect : userData.controllers, 
          disconnect: null
        }
      });
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
    { id, name, color }: UserConnectedMessage,
    showConnectMessage = true
  ): void {
    // If a user triggers multiple connects, simulate a disconnect first
    if (this.idToRemoteUser.has(id)) {
      this.onUserDisconnect({
        event: USER_DISCONNECTED_EVENT,
        id
      });
    }

    const user = new RemoteVrUser({
      userName: name,
      userId: id,
      color: new THREE.Color().fromArray(color),
      state: 'online',
      localUser: this.localUser
    });
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
      this.messageMenuQueue.enqueueMenu(new MessageBoxMenu({
        title: 'User connected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
        time: 3.0,
      }));
    }
  }

  /**
   * Updates the specified user's camera and controller positions.
   *
   * @param {JSON} data - Data needed to update positions.
   */
  onUserPositions({
    userID,
    originalMessage: { camera, controller1, controller2 }
  }: ForwardedMessage<UserPositionsMessage>): void {
    const remoteUser = this.idToRemoteUser.get(userID);
    if (remoteUser) {
      if (controller1) { remoteUser.updateController1(controller1); }
      if (controller2) { remoteUser.updateController2(controller2); }
      if (camera) { remoteUser.updateCamera(camera); }
    }
  }

  onPingUpdate({
    userID,
    originalMessage: {controllerId, isPinging}
  }: ForwardedMessage<PingUpdateMessage>): void {
    const remoteUser = this.idToRemoteUser.get(userID);
    if (remoteUser) {
      if (controllerId === 0) {
        if (isPinging) {
          remoteUser.startPing1();
        } else {
          remoteUser.stopPing1();
        }
      }
      if (controllerId === 1) {
        if (isPinging) {
          remoteUser.startPing2();
        } else {
          remoteUser.stopPing2();
        }
      }
    }

  }

  /**
   * Handles the (dis-)connect of the specified user's controller(s).
   *
   * @param {JSON} data - Contains id and controller information.
   */
  onUserControllers({
    userID,
    originalMessage: { connect, disconnect }
  }: ForwardedMessage<UserControllerMessage>): void {

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
  onUserDisconnect({ id }: UserDisconnectedMessage) {
    // Do not spectate a disconnected user
    if (this.spectateUser.spectatedUser?.userId === id) {
      this.spectateUser.deactivate();
    }

    const user = this.idToRemoteUser.get(id);

    if (user) {
      // Remove user's 3d-objects
      user.removeAllObjects3D();
      this.remoteUserGroup.remove(user);
      this.idToRemoteUser.delete(id);

      // Show disconnect notification
      this.messageMenuQueue.enqueueMenu(new MessageBoxMenu({
        title: 'User disconnected',
        text: user.userName,
        color: `#${user.color.getHexString()}`,
        time: 3.0,
      }));
    }
  }

  onInitialLandscape({ detachedMenus, openApps, landscape }: InitialLandscapeMessage): void {
    this.removeAllApplications();
    this.detachedMenus.remove(...this.detachedMenus.children);

    const { structureLandscapeData } = this.args.landscapeData;

    openApps.forEach((app) => {
      const application = getApplicationInLandscapeById(structureLandscapeData, app.id);
      if (application) {
        perform(this.addApplicationTask, application,
          (applicationObject3D: ApplicationObject3D) => {
            applicationObject3D.position.fromArray(app.position);
            applicationObject3D.quaternion.fromArray(app.quaternion);
            applicationObject3D.scale.fromArray(app.scale);

            EntityManipulation.restoreComponentState(applicationObject3D,
              new Set(app.openComponents));

            this.addLabels(applicationObject3D);

            const drawableComm = this.drawableClassCommunications
              .get(applicationObject3D.dataModel.pid);

            if (drawableComm) {
              this.appCommRendering.addCommunication(applicationObject3D, drawableComm);
              Highlighting.updateHighlighting(applicationObject3D, drawableComm);
            }

            // Simulate a highlighting update for every initial highlighting
            // component.
            app.highlightedComponents.forEach((highlightingUpdate) => {
              this.onHighlightingUpdate({
                event: FORWARDED_EVENT,
                userID: highlightingUpdate.userID,
                originalMessage: {
                  event: HIGHLIGHTING_UPDATE_EVENT,
                  isHighlighted: highlightingUpdate.isHighlighted,
                  appID: highlightingUpdate.appID,
                  entityType: highlightingUpdate.entityType,
                  entityID: highlightingUpdate.entityID
                }
              });
            });
          });
      }
    });

    this.landscapeObject3D.position.fromArray(landscape.position);
    this.landscapeObject3D.quaternion.fromArray(landscape.quaternion);
    this.landscapeObject3D.scale.fromArray(landscape.scale);

    // initialize detached menus
    detachedMenus.forEach((detachedMenu) => {
      let object = this.findMeshByModelId(detachedMenu.entityType, detachedMenu.entityId);
      if (isEntityMesh(object)) {
        const menu = new DetailInfoMenu(object);
        menu.position.fromArray(detachedMenu.position);
        menu.quaternion.fromArray(detachedMenu.quaternion);
        menu.scale.fromArray(detachedMenu.scale);
        this.addDetachedMenu(menu, detachedMenu.objectId);
      }
    })
  }

  onAppOpened({
    originalMessage: { id, position, quaternion, scale }
  }: ForwardedMessage<AppOpenedMessage>): void {
    const { structureLandscapeData } = this.args.landscapeData;
    const application = getApplicationInLandscapeById(structureLandscapeData, id);

    if (application) {
      super.addApplication(application, (applicationObject3D: ApplicationObject3D) => {
        applicationObject3D.position.fromArray(position);
        applicationObject3D.quaternion.fromArray(quaternion);
        applicationObject3D.scale.fromArray(scale);
      });
    }
  }

  onAppClosed({
    originalMessage: { appID }
  }: ForwardedMessage<AppClosedMessage>): void {
    const application = this.applicationGroup.getApplication(appID);

    if (application !== undefined) {
      super.removeApplication(application);
    }
  }

  onDetachedMenuClosed({
    originalMessage: { menuId }
  }: ForwardedMessage<DetachedMenuClosedMessage>): void {
    for (let menu of this.detachedMenus.children) {
      if (isGrabbableObject(menu) && menu.getGrabId() === menuId) {
        this.detachedMenus.remove(menu);
        break;
      }
    }
  }

  onObjectMoved({
    originalMessage: { objectId, position, quaternion, scale }
  }: ForwardedMessage<ObjectMovedMessage>): void {
    // The moved object can be any of the intersectable objects.
    for (let object of this.interaction.raycastObjects) {
      let child = findGrabbableObject(object, objectId);
      if (child) {
        child.position.fromArray(position);
        child.quaternion.fromArray(quaternion);
        child.scale.fromArray(scale);
        return;
      }
    }
    console.error('Could not find moved object', objectId);
  }

  onComponentUpdate({
    originalMessage: { isFoundation, appID, componentID }
  }: ForwardedMessage<ComponentUpdateMessage>): void {
    const applicationObject3D = this.applicationGroup.getApplication(appID);
    if (!applicationObject3D) return;

    const componentMesh = applicationObject3D.getBoxMeshbyModelId(componentID);

    if (isFoundation) {
      EntityManipulation.closeAllComponents(applicationObject3D);
    } else if (componentMesh instanceof ComponentMesh) {
      super.toggleComponentAndUpdate(componentMesh, applicationObject3D);
    }
  }

  onHighlightingUpdate({
    userID,
    originalMessage: { isHighlighted, appID, entityType, entityID }
  }: ForwardedMessage<HighlightingUpdateMessage>): void {
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
  onSpectatingUpdate({
    userID,
    originalMessage: { isSpectating }
  }: ForwardedMessage<SpectatingUpdateMessage>): void {
    const remoteUser = this.idToRemoteUser.get(userID);

    if (!remoteUser) return;

    remoteUser.state = isSpectating ? 'spectating' : 'online';

    const remoteUserHexColor = `#${remoteUser.color.getHexString()}`;
    if (isSpectating) {
      remoteUser.setVisible(false);
      if (this.spectateUser.spectatedUser && this.spectateUser.spectatedUser.userId === userID) {
        this.spectateUser.deactivate();
      }
      this.messageMenuQueue.enqueueMenu(new MessageBoxMenu({
        title: remoteUser.userName, 
        text: ' is now spectating', 
        color: remoteUserHexColor,
        time: 3.0
      }));
    } else {
      remoteUser.setVisible(true);
      this.messageMenuQueue.enqueueMenu(new MessageBoxMenu({
        title: remoteUser.userName,
        text: ' stopped spectating',
        color: remoteUserHexColor,
        time: 3.0
      }));
    }
  }

  onMenuDetached({ objectId, entityType, detachId, position, quaternion, scale }: MenuDetachedForwardMessage) {
    let object = this.findMeshByModelId(entityType, detachId);
    if (isEntityMesh(object)) {
      const menu = new DetailInfoMenu(object);
      menu.position.fromArray(position);
      menu.quaternion.fromArray(quaternion);
      menu.scale.fromArray(scale);
      this.addDetachedMenu(menu, objectId);
    }
  }

  addDetachedMenu(menu: DetachableMenu, grabId: string|null) {
    // Put menu container at same position as menu.
    const menuContainer = new GrabbableMenuContainer(menu, grabId);
    this.detachedMenus.add(menuContainer);

    // Make detached menu closable.
    let closeIcon = new CloseIcon({
      texture: this.closeButtonTexture,
      onClose: () => this.removeDetachedMenu(menuContainer)
    });
    closeIcon.addToObject(menuContainer);
  }

  removeDetachedMenu(menuContainer: GrabbableMenuContainer) {
    // Remove the menu locally when it does not have an id (e.g., when we are 
    // offline).
    let menuId = menuContainer.getGrabId();
    if (!menuId) {
      this.detachedMenus.remove(menuContainer);
      return;
    }
    
    const nonce = this.sender.sendDetachedMenuClosed(menuId);
    this.receiver.awaitResponse({
      nonce,
      responseType: isObjectClosedResponse,
      onResponse: (response: ObjectClosedResponse) => {
        if (response.isSuccess) {
          this.detachedMenus.remove(menuContainer);
        } else {
          this.showHint('Could not close detached menu');
        }
      },
      onOffline: () => {
        this.detachedMenus.remove(menuContainer);
      }
    });
  }

  // #endregion REMOTE EVENT HANDLER

  // #region UTIL

  sendPoses() {
    const poses = Helper.getPoses(
      this.localUser.camera,
      this.localUser.controller1,
      this.localUser.controller2
    );
    let controller1 = this.localUser.controller1;
    let intersection1 = new Vector3();
    if (controller1) {
      controller1.updateIntersectedObject();
      let point = controller1.intersectedObject?.point;
      if (point) {
        intersection1 = point;
      }
    }
    let controller2 = this.localUser.controller2;
    let intersection2 = new Vector3();
    if (controller2) {
      controller2.updateIntersectedObject();
      let point = controller2.intersectedObject?.point;
      if (point) {
        intersection2 = point;
      }
    }

    this.sender.sendPoseUpdate(poses.camera, poses.controller1 , poses.controller2, intersection1, intersection2);
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
   * Updates animations of the remote user and sets user name tag to be 
   * directly above their head and set rotation such that it looks toward 
   * our camera.
   */
  updateRemoteUsers() {
    this.idToRemoteUser.forEach((user) => {
      // Update animations.
      user.update(this.time.getDeltaTime());
    });
  }

  /**
   * Uses the addApplication Task of vr-rendering to add an application to the scene.
   * Additionally, a callback function is given to send an update to the backend.
   */
  addApplication(applicationModel: Application, callback: (application: ApplicationObject3D) => void) {
    if (applicationModel.packages.length === 0) {
      this.showHint('No data available');
      return;
    }

    if (!this.applicationGroup.hasApplication(applicationModel.pid)) {
      perform(super.addApplicationTask, applicationModel, (applicationObject3D: ApplicationObject3D) => {
        callback(applicationObject3D);
        this.sender.sendAppOpened(applicationObject3D);
      });
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
    const nonce = this.sender.sendAppClosed(application.dataModel.pid);

    this.receiver.awaitResponse({
      nonce,
      responseType: isObjectClosedResponse,
      onResponse: (response: ObjectClosedResponse) => {
        if (response.isSuccess) {
          super.removeApplication(application);
        } else {
          this.showHint('Could not close application');
        }
      },
      onOffline: () => {
        super.removeApplication(application);
      }
    });
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
    this.receiver.removeMessageListener(this);
  }

}
