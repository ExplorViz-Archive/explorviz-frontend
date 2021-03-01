import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { Perspective, IdentifiableMesh, CursorPosition, CollaborativeEvents } from 'collaborative-mode/utils/collaborative-data';
import THREE from 'three';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import adjustForObjectRotation from 'collaborative-mode/utils/collaborative-util';

export default class CollaborativeService extends Service.extend(Evented
  // anything which *must* be merged to prototype here
) {
  // @ts-expect-error
  @service('websockets')
  socketService!: any;

  socketRef = null;

  socketUrl: String = "";

  username: string = "";

  async openSocket(sessionId: String, username: String) {
    this.username = username.toString();
    this.socketUrl = `ws://localhost:8080/v2/collaborative/${sessionId}/${username}`;
    const socket = this.socketService.socketFor(this.socketUrl);
    socket.on('open', this.myOpenHandler, this);
    socket.on('close', this.myCloseHandler, this);
    socket.on('message', this.myMessageHandler, this);

    this.set('socketRef', socket);
  }

  async closeSocket() {
    this.socketService.closeSocketFor(this.socketUrl);
  }

  // @ts-expect-error
  myOpenHandler(event: any) {
    AlertifyHandler.showAlertifyMessage('Collaborative Mode active!');
  }

  // @ts-expect-error
  myCloseHandler(event: any) {
    AlertifyHandler.showAlertifyMessage('Collaborative Mode stopped!');
  }

  myMessageHandler(event: any) {
    console.log("Message: " + event.data)
    const result = JSON.parse(event.data);
    
    this.trigger(result.action, result.payload, result.from);
  }

  sendDoubleClick(mesh: THREE.Mesh) {
    this.sendClick(CollaborativeEvents.DoubleClick, mesh);
  }

  sendSingleClick(mesh: THREE.Mesh) {
    this.sendClick(CollaborativeEvents.SingleClick, mesh);
  }

  sendClick(action: String, mesh: THREE.Mesh) {
    if (this.instanceOfIdentifiableMesh(mesh)) {
      this.send(action, { id: mesh.colabId });
    }
  }

  sendPerspective(payload: Perspective, to?: string) {
    this.send(CollaborativeEvents.Perspective, payload, to);
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

  sendMouse(action: String, point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    const vectorWithoutObjectRotation = adjustForObjectRotation(point.toArray(), quaternion.clone().conjugate());
    const payload: CursorPosition = {
      point: vectorWithoutObjectRotation.toArray()
    }
    if (mesh && this.instanceOfIdentifiableMesh(mesh)) {
      payload.id = mesh.colabId;
    }
    this.send(action, payload);
  }

  send(action: String, payload: any, to?: string) {
    const content = JSON.stringify(
      {
        action: action,
        to: to,
        from: this.username,
        payload: payload
      }
    )
  // @ts-expect-error
    this.socketRef?.send(content);
  }

  instanceOfIdentifiableMesh(object: any): object is IdentifiableMesh {
    return 'colabId' in object;
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-service': CollaborativeService;
  }
}
