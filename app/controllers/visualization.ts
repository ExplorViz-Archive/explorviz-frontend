import Controller from '@ember/controller';
import {
  action,
  set,
} from '@ember/object';
import { inject as service } from '@ember/service';
import PlotlyTimeline from 'explorviz-frontend/components/visualization/page-setup/timeline/plotly-timeline';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import CollaborativeService from 'collaborative-mode/services/collaborative-service';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import TimestampRepository, { Timestamp } from 'explorviz-frontend/services/repos/timestamp-repository';
import { tracked } from '@glimmer/tracking';
import { Application, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import debugLogger from 'ember-debug-logger';
import { CollaborativeEvents } from 'collaborative-mode/utils/collaborative-data';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import ElkConstructor from 'elkjs/lib/elk-api';
import THREE from 'three';
import VrMessageReceiver, { VrMessageListener } from 'virtual-reality/services/vr-message-receiver';
import { ForwardedMessage } from 'virtual-reality/utils/vr-message/receivable/forwarded';
import { InitialLandscapeMessage, INITIAL_LANDSCAPE_EVENT } from 'virtual-reality/utils/vr-message/receivable/landscape';
import { MenuDetachedForwardMessage } from 'virtual-reality/utils/vr-message/receivable/menu-detached-forward';
import { SelfConnectedMessage, SELF_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/self_connected';
import { UserConnectedMessage, USER_CONNECTED_EVENT } from 'virtual-reality/utils/vr-message/receivable/user_connected';
import { UserDisconnectedMessage } from 'virtual-reality/utils/vr-message/receivable/user_disconnect';
import { AppOpenedMessage } from 'virtual-reality/utils/vr-message/sendable/app_opened';
import { ComponentUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/component_update';
import { HighlightingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/highlighting_update';
import { MousePingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/mouse-ping-update';
import { ObjectMovedMessage } from 'virtual-reality/utils/vr-message/sendable/object_moved';
import { PingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/ping_update';
import { AppClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/app_closed';
import { DetachedMenuClosedMessage } from 'virtual-reality/utils/vr-message/sendable/request/detached_menu_closed';
import { SpectatingUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/spectating_update';
import { TimestampUpdateMessage } from 'virtual-reality/utils/vr-message/sendable/timetsamp_update';
import { UserControllerConnectMessage } from 'virtual-reality/utils/vr-message/sendable/user_controller_connect';
import { UserControllerDisconnectMessage } from 'virtual-reality/utils/vr-message/sendable/user_controller_disconnect';
import { UserPositionsMessage } from 'virtual-reality/utils/vr-message/sendable/user_positions';
import VrTimestampService from 'virtual-reality/services/vr-timestamp';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import WebSocketService from 'virtual-reality/services/web-socket';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';
import RemoteVrUser from 'virtual-reality/utils/vr-multi-user/remote-vr-user';
import { SerializedVrRoom } from 'virtual-reality/utils/vr-multi-user/serialized-vr-room';

export interface LandscapeData {
  structureLandscapeData: StructureLandscapeData;
  dynamicLandscapeData: DynamicLandscapeData;
  application?: Application;
}

export const earthTexture = new THREE.TextureLoader().load('images/earth-map.jpg');

/**
 * TODO
 *
 * @class Visualization-Controller
 * @extends Ember.Controller
 *
 * @module explorviz
 * @submodule visualization
 */
export default class VisualizationController extends Controller implements VrMessageListener {
  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @service('collaborative-service') collaborativeService!: CollaborativeService;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('heatmap-configuration') heatmapConf!: HeatmapConfiguration;

  @service('landscape-token') landscapeTokenService!: LandscapeTokenService;

  @service('reload-handler') reloadHandler!: ReloadHandler;

  plotlyTimelineRef!: PlotlyTimeline;

  @tracked
  selectedTimestampRecords: Timestamp[] = [];

  @tracked
  font!: THREE.Font; // set by the route

  @tracked
  showDataSelection = false;

  @tracked
  components: string[] = [];

  @tracked
  showAR: boolean = false;

  @tracked
  showVR: boolean = false;

  @tracked
  showTimeline: boolean = true;

  @tracked
  landscapeData: LandscapeData | null = null;

  @tracked
  visualizationPaused = false;

  @tracked
  timelineTimestamps: Timestamp[] = [];

  @tracked
  elk = new ElkConstructor({
    workerUrl: './assets/web-workers/elk-worker.min.js',
  });

  debug = debugLogger();

  get showLandscapeView() {
    return (this.landscapeData !== null && this.landscapeData.application === undefined
      && !this.showVR)
      || this.landscapeData === null;
  }

  get isLandscapeExistentAndEmpty() {
    return this.landscapeData !== null
      && this.landscapeData.structureLandscapeData.nodes.length === 0;
  }

  get allLandscapeDataExistsAndNotEmpty() {
    return this.landscapeData !== null
      && this.landscapeData.structureLandscapeData.nodes.length > 0;
  }

  get showApplicationView() {
    return this.landscapeData !== null && this.landscapeData.application !== undefined;
  }

  @action
  updateTimestampList() {
    const currentToken = this.landscapeTokenService.token!.value;
    this.timelineTimestamps = this.timestampRepo.getTimestamps(currentToken) ?? [];
  }

  @action
  receiveNewLandscapeData(structureData: StructureLandscapeData,
    dynamicData: DynamicLandscapeData) {
    if (!this.visualizationPaused) {
      this.heatmapConf.latestClazzMetricScores = [];
      this.updateLandscape(structureData, dynamicData);
    }
  }

  updateLandscape(structureData: StructureLandscapeData,
    dynamicData: DynamicLandscapeData) {
    let application;
    if (this.landscapeData !== null) {
      application = this.landscapeData.application;
      if (application !== undefined) {
        const newApplication = VisualizationController.getApplicationFromLandscapeById(
          application.id, structureData,
        );

        if (newApplication) {
          application = newApplication;
        }
      }
    }
    this.landscapeData = {
      structureLandscapeData: structureData,
      dynamicLandscapeData: dynamicData,
      application,
    };
  }

  private static getApplicationFromLandscapeById(id: string,
    structureData: StructureLandscapeData) {
    let foundApplication: Application | undefined;
    structureData.nodes.forEach((node) => {
      node.applications.forEach((application) => {
        if (application.id === id) {
          foundApplication = application;
        }
      });
    });

    return foundApplication;
  }

  @action
  openLandscapeView() {
    this.receiveOpenLandscapeView();
    this.collaborativeService.send(CollaborativeEvents.OpenLandscapeView, {});
  }

  @action
  receiveOpenLandscapeView() {
    this.closeDataSelection();
    this.showAR = false;
    this.showVR = false;
    if (this.landscapeData !== null) {
      this.landscapeData = {
        ...this.landscapeData,
        application: undefined,
      };
    }
  }

  @action
  showApplication(appId: string) {
    this.closeDataSelection();
    if (this.landscapeData !== null) {
      this.landscapeData = {
        ...this.landscapeData,
        application: VisualizationController.getApplicationFromLandscapeById(appId,
          this.landscapeData.structureLandscapeData),
      };
      this.collaborativeService.send(CollaborativeEvents.ApplicationOpened, { id: appId });
    }
  }

  @action
  switchToAR() {
    if (!this.showVR) {
      this.pauseVisualizationUpdating();
      this.closeDataSelection();
      this.showAR = true;
    }
  }

  @action
  switchToVR() {
    if (!this.showVR) {
      this.pauseVisualizationUpdating();
      this.closeDataSelection();
      this.showVR = true;
    }
  }

  @action
  resetView() {
    this.plotlyTimelineRef.continueTimeline(this.selectedTimestampRecords);
  }

  @action
  resetLandscapeListenerPolling() {
    if (this.landscapeListener.timer !== null) {
      clearTimeout(this.landscapeListener.timer);
    }
  }

  @action
  closeDataSelection() {
    this.showDataSelection = false;
    this.components = [];
  }

  @action
  openDataSelection() {
    this.showDataSelection = true;
  }

  @action
  addComponent(component: string) {
    if (this.components.includes(component)) {
      // remove it and readd it in the code below,
      // so it again appears on top inside the sidebar
      // This will not reset the component
      this.removeComponent(component);
    }

    this.components = [component, ...this.components];
  }

  @action
  removeComponent(path: string) {
    if (this.components.length === 0) { return; }

    const index = this.components.indexOf(path);
    // Remove existing sidebar component
    if (index !== -1) {
      const components = [...this.components];
      components.splice(index, 1);
      this.components = components;
    }
  }

  @action
  async timelineClicked(timestampRecordArray: Timestamp[]) {
    if (this.selectedTimestampRecords.length > 0
      && timestampRecordArray[0] === this.selectedTimestampRecords[0]) {
      return;
    }
    this.pauseVisualizationUpdating();
    try {
      const [structureData, dynamicData] = await
        this.reloadHandler.loadLandscapeByTimestamp(timestampRecordArray[0].timestamp);

      this.updateLandscape(structureData, dynamicData);
      set(this, 'selectedTimestampRecords', timestampRecordArray);
    } catch (e) {
      this.debug('Landscape couldn\'t be requested!', e);
      AlertifyHandler.showAlertifyMessage('Landscape couldn\'t be requested!');
      this.resumeVisualizationUpdating();
    }
  }

  @action
  getTimelineReference(plotlyTimelineRef: PlotlyTimeline) {
    // called from within the plotly timeline component
    set(this, 'plotlyTimelineRef', plotlyTimelineRef);
  }

  @action
  toggleTimeline() {
    this.showTimeline = !this.showTimeline;
  }

  @action
  toggleVisualizationUpdating() {
    // TODO: need to notify the timeline
    if (this.visualizationPaused) {
      this.resumeVisualizationUpdating();
    } else {
      this.pauseVisualizationUpdating();
    }
  }

  resumeVisualizationUpdating() {
    if (this.visualizationPaused) {
      this.visualizationPaused = false;
      set(this, 'selectedTimestampRecords', []);
      this.plotlyTimelineRef.resetHighlighting();
      AlertifyHandler.showAlertifyMessage('Visualization resumed!');
    }
  }

  pauseVisualizationUpdating() {
    if (!this.visualizationPaused) {
      this.visualizationPaused = true;
      AlertifyHandler.showAlertifyMessage('Visualization paused!');
    }
  }

  initRendering() {
    this.landscapeData = null;
    this.selectedTimestampRecords = [];
    this.visualizationPaused = false;
    this.showAR = false;
    this.showVR = false;
    this.closeDataSelection();
    this.landscapeListener.initLandscapePolling();
    this.updateTimestampList();
    this.initWebSocket();
    this.webSocket.on(SELF_CONNECTED_EVENT, this, this.onSelfConnected);
    this.webSocket.on(USER_CONNECTED_EVENT, this, this.onUserConnected);
    this.webSocket.on(INITIAL_LANDSCAPE_EVENT, this, this.onInitialLandscape);
  }

  willDestroy() {
    this.resetLandscapeListenerPolling();
    this.webSocket.off(SELF_CONNECTED_EVENT, this, this.onSelfConnected);
    this.webSocket.off(USER_CONNECTED_EVENT, this, this.onUserConnected);
    this.webSocket.off(INITIAL_LANDSCAPE_EVENT, this, this.onInitialLandscape);
  }

  @service('vr-timestamp')
  private timestampService!: VrTimestampService;

  @service('repos/timestamp-repository')
  private timestampRepo!: TimestampRepository;

  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('vr-message-receiver')
  private receiver!: VrMessageReceiver;

  @service('web-socket')
  private webSocket!: WebSocketService;

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  private async initWebSocket() {
    this.debug('Initializing websocket...');

  }

  // collaboration start
  // user handling
  /**
   * After succesfully connecting to the backend, create and spawn other users.
   */
  onSelfConnected({ self, users }: SelfConnectedMessage): void {
    this.debug('Self connected stuff');
    this.debug('Self connected stuff' + self.name);
    this.debug('Self connected stuff' + users);
    // Create User model for all users and add them to the users map by
    // simulating the event of a user connecting.
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      this.onUserConnected(
        {
          event: USER_CONNECTED_EVENT,
          id: userData.id,
          name: userData.name,
          color: userData.color,
          position: userData.position,
          quaternion: userData.quaternion,
        },
        false,
      );
    }

    // Initialize local user.
    this.localUser.connected({
      id: self.id,
      name: self.name,
      color: new THREE.Color(...self.color),
    });
  }

  onUserConnected(
    {
      id, name, color, position, quaternion,
    }: UserConnectedMessage,
    showConnectMessage = true,
  ): void {
    const remoteUser = new RemoteVrUser({
      userName: name,
      userId: id,
      color: new THREE.Color(...color),
      state: 'online',
      localUser: this.localUser,
    });
    this.remoteUsers.addRemoteUser(remoteUser, { position, quaternion });

    if (showConnectMessage) {
      AlertifyHandler.showAlertifySuccess(`User ${remoteUser.userName} connected.`);
    }
  }
  /**
   * Removes the user that disconnected and informs our user about it.
   *
   * @param {JSON} data - Contains the id of the user that disconnected.
   */
  onUserDisconnect({ id }: UserDisconnectedMessage) {
    // Remove user and show disconnect notification.
    const removedUser = this.remoteUsers.removeRemoteUserById(id);
    if (removedUser) {
      AlertifyHandler.showAlertifyError(`User ${removedUser.userName} disconnected.`);
    }
  }
  // user handling end


  async onInitialLandscape({
    landscape,
    openApps,
    detachedMenus,
  }: InitialLandscapeMessage): Promise<void> {
    // await this.roomSerializer.restoreRoom({ landscape, openApps, detachedMenus });
    await this.restoreRoom({ landscape, openApps, detachedMenus })

    // this.landscapeMarker.add(this.vrLandscapeRenderer.landscapeObject3D);
    // this.arSettings.updateLandscapeOpacity();

    // this.vrApplicationRenderer.getOpenApplications().forEach((applicationObject3D) => {
    //   this.addApplicationToMarker(applicationObject3D);
    // });
  }

  async restoreRoom(
    room: SerializedVrRoom) {
    this.pauseVisualizationUpdating();
    try {
      const [structureData, dynamicData] = await
        this.reloadHandler.loadLandscapeByTimestamp(room.landscape.timestamp);

      this.updateLandscape(structureData, dynamicData);
      // TODO is this used?
      // set(this, 'selectedTimestampRecords', timestampRecordArray);
    } catch (e) {
      this.debug('Landscape couldn\'t be requested!', e);
      AlertifyHandler.showAlertifyMessage('Landscape couldn\'t be requested!');
      this.resumeVisualizationUpdating();
    }
  }

  onMenuDetached(msg: MenuDetachedForwardMessage): void {
    // vr only
  }
  onUserPositions(msg: ForwardedMessage<UserPositionsMessage>): void {
    // vr only
  }
  onUserControllerConnect(msg: ForwardedMessage<UserControllerConnectMessage>): void {
    // vr only
  }
  onUserControllerDisconnect(msg: ForwardedMessage<UserControllerDisconnectMessage>): void {
    // vr only
  }
  onAppOpened(msg: ForwardedMessage<AppOpenedMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onAppClosed(msg: ForwardedMessage<AppClosedMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onDetachedMenuClosed(msg: ForwardedMessage<DetachedMenuClosedMessage>): void {
    // vr only
  }
  onPingUpdate(msg: ForwardedMessage<PingUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onMousePingUpdate(msg: ForwardedMessage<MousePingUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onTimestampUpdate(msg: ForwardedMessage<TimestampUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onObjectMoved(msg: ForwardedMessage<ObjectMovedMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onComponentUpdate(msg: ForwardedMessage<ComponentUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onHighlightingUpdate(msg: ForwardedMessage<HighlightingUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  onSpectatingUpdate(msg: ForwardedMessage<SpectatingUpdateMessage>): void {
    // throw new Error('Method not implemented.');
  }
  // collaboration end

  onSelfDisconnected(event?: any) {
    if (this.localUser.isConnecting) {
      AlertifyHandler.showAlertifyMessage('Collaboration backend service not responding');
    } else if (event) {
      switch (event.code) {
        case 1000: // Normal Closure
          AlertifyHandler.showAlertifyMessage('Successfully disconnected');
          break;
        case 1006: // Abnormal closure
          AlertifyHandler.showAlertifyMessage('Collaboration backend service closed abnormally');
          break;
        default:
          AlertifyHandler.showAlertifyMessage('Unexpected disconnect');
      }
    }

    // Remove remote users.
    this.remoteUsers.removeAllRemoteUsers();

    // // Reset highlighting colors.
    // this.webglrenderer.getOpenApplications().forEach((application) => {
    //   application.setHighlightingColor(
    //     this.configuration.applicationColors.highlightedEntityColor,
    //   );
    // });

    this.localUser.disconnect();
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  // tslint:disable-next-line: interface-name
  interface Registry {
    'visualizationController': VisualizationController;
  }
}
