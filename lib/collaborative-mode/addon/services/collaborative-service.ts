import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { Perspective, IdentifiableMesh, CursorPosition } from 'collaborative-mode/utils/collaborative-data';
import THREE from 'three';

export default class CollaborativeService extends Service.extend(Evented
  // anything which *must* be merged to prototype here
) {
  // @ts-expect-error
  @service('websockets') socketService!: any;

  pollingTimer: NodeJS.Timeout | null = null;
  writingTimer: NodeJS.Timeout | null = null;
  socketRef = null;

  disableControlTimer: NodeJS.Timeout | null = null;
  disableControl: boolean = false;

  async openSocket() {
    const randomValue = Math.floor(Math.random() * Math.floor(100));
    const socket = this.socketService.socketFor('ws://localhost:8080/v2/collaborative/fib/someone' + randomValue);
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  }

  myOpenHandler(event: any) {
    console.log(`On open event has been called: ${event}`);
  }

  myMessageHandler(event: any) {
    // console.log(`Message: ${event.data}`);
    const result = JSON.parse(event.data);
    
    this.trigger(result.action, result.payload);

      // this.disableControl = true
      // if (this.disableControlTimer) {
      //   clearTimeout(this.disableControlTimer)
      // }
      // this.disableControlTimer = setTimeout(() => {
      //   this.disableControl = false
      //   console.log(`Timer expired`);
      // }, 1000);

      // result.rotation = new THREE.Euler(result.rotation._x, result.rotation._y, result.rotation._z)
      // this.lastPerspective = result
      // this.trigger('newPerspective', result);
  }

  myCloseHandler(event: any) {
    console.log(`On close event has been called: ${event}`);
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

  sendMouseMove(mouse: CursorPosition) {
    this.send('mouseMove', mouse);
  }

  sendMouseStop(mouse: CursorPosition) {
    this.send('mouseStop', mouse);
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
  // normal class body definition here


  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'collaborative-service': CollaborativeService;
  }
}
