import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { Perspective, IdentifiableMesh, CursorPosition } from 'collaborative-mode/utils/collaborative-data';
import THREE from 'three';
import CollaborativeSettingsService from './collaborative-settings-service';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import adjustForObjectRotation from 'collaborative-mode/utils/collaborative-util';
import collaborativeMode from 'lib/collaborative-mode';

export default class CollaborativeService extends Service.extend(Evented
  // anything which *must* be merged to prototype here
) {
  // @ts-expect-error
  @service('websockets') socketService!: any;

  @service('collaborative-settings-service') settings!: CollaborativeSettingsService;

  socketRef = null;

  randomValue = Math.floor(Math.random() * Math.floor(100));

  async openSocket() {
    const socket = this.socketService.socketFor('ws://localhost:8080/v2/collaborative/fib/someone' + this.randomValue);
    socket.on('open', this.myOpenHandler, this);
    socket.on('close', this.myCloseHandler, this);
    socket.on('message', this.myMessageHandler, this);

    this.set('socketRef', socket);
  }

  async closeSocket() {
    this.socketService.closeSocketFor('ws://localhost:8080/v2/collaborative/fib/someone' + this.randomValue);
  }

  myOpenHandler(event: any) {
    AlertifyHandler.showAlertifyMessage('Collaborative Mode active!');
  }

  myCloseHandler(event: any) {
    AlertifyHandler.showAlertifyMessage('Collaborative Mode stopped!');
  }

  myMessageHandler(event: any) {
    if (event.data.startsWith("User")) {
      AlertifyHandler.showAlertifyMessage(event.data);
      return
    }
    const result = JSON.parse(event.data);

    const handlerEnabled = this.settings.get(result.action)
    if ( handlerEnabled == null || handlerEnabled == true) {
      this.trigger(result.action, result.payload);
    }
  }

  sendDoubleClick(mesh: THREE.Mesh) {
    this.sendClick('doubleClick', mesh);
  }

  sendSingleClick(mesh: THREE.Mesh) {
    this.sendClick('singleClick', mesh);
  }
  
  sendClick(action: String, mesh: THREE.Mesh) {
    if (this.instanceOfIdentifiableMesh(mesh)) {
      this.send(action, { id: mesh.colabId });
    }
  }

  sendPanning(delta: { x: number, y: number }, event: any) {
    this.send('panning', { delta: delta, event: event });
  }

  sendPerspective(payload: Perspective) {
    this.send('perspective', payload);
  }

  sendMouseMove(point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    this.sendMouse('mouseMove', point, quaternion, mesh);
  }

  sendMouseStop(point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    this.sendMouse('mouseStop', point, quaternion, mesh);
  }

  sendMouse(action: String, point: THREE.Vector3, quaternion: THREE.Quaternion, mesh?: THREE.Mesh) {
    const vectorWithoutObjectRotation = adjustForObjectRotation(point.toArray(), quaternion.clone().conjugate());
    const payload: CursorPosition = {
      point: vectorWithoutObjectRotation.toArray()
    }
    if (mesh && this.instanceOfIdentifiableMesh(mesh)) {
      payload.id = mesh.colabId;
    }
    this.send(action,  payload);
  }
  
  sendMouseWheel(delta: number) {
    this.send('mouseWheel', { delta: delta});
  }

  send(action: String, payload: any) {
      const content = JSON.stringify(
        {
          action: action,
          payload: payload
        }
      )
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
