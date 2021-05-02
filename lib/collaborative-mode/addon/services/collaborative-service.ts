import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import {
  Perspective,
  instanceOfIdentifiableMesh,
  CursorPosition, CollaborativeEvents,
} from 'collaborative-mode/utils/collaborative-data';
import THREE from 'three';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import adjustForObjectRotation from 'collaborative-mode/utils/collaborative-util';
import CollaborativeSettingsService from 'explorviz-frontend/services/collaborative-settings-service';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';
import ENV from 'explorviz-frontend/config/environment';

const { collaborativeService } = ENV.backendAddresses;

export default class CollaborativeService extends Service.extend(Evented) {
  // @ts-expect-error
  @service('websockets')
  socketService!: any;

  @service('landscape-token')
  landscapeTokenService!: LandscapeTokenService;

  socketRef: any = null;

  socketUrl: string = '';

  @service('collaborative-settings-service')
  settings!: CollaborativeSettingsService;

  openSocket(username: string) {
    if (this.socketRef) {
      this.reconnect();
    } else {
      this.socketUrl = `${collaborativeService}/v2/collaborative/${username}`;
      const socket = this.socketService.socketFor(this.socketUrl);
      socket.on('open', this.myOpenHandler, this);
      socket.on('close', this.myCloseHandler, this);
      socket.on('message', this.myMessageHandler, this);
      this.socketRef = socket;
    }
  }

  reconnect() {
    AlertifyHandler.showAlertifyMessage('Trying to reconnect...');
    this.socketRef?.reconnect();
  }

  closeSocket() {
    this.socketRef?.close();
  }

  myOpenHandler() {
    this.settings.connected = true;
  }

  myCloseHandler() {
    this.settings.connected = false;
    this.settings.meeting = undefined;
    this.settings.meetings.clear();
  }

  myMessageHandler(event: any) {
    const result = JSON.parse(event.data);

    this.trigger(result.event, result.data);
  }

  sendDoubleClick(mesh: THREE.Mesh) {
    this.sendClick(CollaborativeEvents.DoubleClick, mesh);
  }

  sendSingleClick(mesh: THREE.Mesh) {
    this.sendClick(CollaborativeEvents.SingleClick, mesh);
  }

  sendClick(action: string, mesh: THREE.Mesh) {
    if (instanceOfIdentifiableMesh(mesh)) {
      this.send(action, { id: mesh.colabId });
    }
  }

  sendPerspective(data: Perspective) {
    this.send(CollaborativeEvents.Perspective, data);
  }

  sendMouseMove(point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    this.sendMouse(CollaborativeEvents.MouseMove, point, quaternion, mesh);
  }

  sendMouseOut() {
    this.send(CollaborativeEvents.MouseOut, {});
  }

  sendMouseStop(point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    this.sendMouse(CollaborativeEvents.MouseStop, point, quaternion, mesh);
  }

  sendMouse(event: string, point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    const vectorWithoutObjectRotation = adjustForObjectRotation(point.toArray(),
      quaternion.clone().conjugate());
    const payload: CursorPosition = {
      point: vectorWithoutObjectRotation.toArray(),
    };
    if (mesh && instanceOfIdentifiableMesh(mesh)) {
      payload.id = mesh.colabId;
    }
    this.send(event, payload);
  }

  send(event: string, data: any = {}) {
    const content = JSON.stringify(
      {
        event,
        data,
      },
    );
    this.socketRef?.send(content);
  }

  willDestroy() {
    const socket = this.socketRef;
    if (socket) {
      socket.off('open', this.myOpenHandler);
      socket.off('close', this.myCloseHandler);
      socket.off('message', this.myMessageHandler);
    }
    this.socketRef = null;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-service': CollaborativeService;
  }
}
