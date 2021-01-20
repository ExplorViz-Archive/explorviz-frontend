import WebSocketService from 'virtual-reality/services/web-socket';
import THREE from 'three';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { ComponentUpdateMessage } from './sendable/component_update';
import { AppClosedMessage } from './sendable/app_closed';
import { ObjectMovedMessage } from './sendable/object_moved';
import { UserPositionsMessage } from './sendable/user_positions';
import { HighlightingUpdateMessage } from './sendable/highlighting_update';
import { SpectatingUpdateMessage } from './sendable/spectating_update';
import { UserControllerMessage } from './sendable/user_controllers';
import { AppOpenedMessage } from './sendable/app_opened';
import { MenuDetachedMessage } from './sendable/request/menu_detached';
import { ObjectGrabbedMessage } from './sendable/request/object_grabbed';
import { ObjectReleasedMessage } from './sendable/object_released';

type Pose = {position: THREE.Vector3, quaternion: THREE.Quaternion};
export default class VrMessageSender {
  webSocket: WebSocketService;
  lastNonce: number;

  constructor(webSocket: WebSocketService) {
    this.webSocket = webSocket;
    this.lastNonce = 0;
  }

  /**
   * Gets the next request identifier.
   * 
   * Messages that await responses
   */
  private nextNonce() {
    return ++this.lastNonce;
  }

  /**
   * Sends position and rotation information of the local user's camera and
   * controllers.
   */
  sendPoseUpdate(camera: Pose, controller1: Pose, controller2: Pose) {
    this.webSocket.send<UserPositionsMessage>({
      event: 'user_positions',
      controller1: {
        position: controller1.position.toArray(),
        quaternion: controller1.quaternion.toArray(),
      },
      controller2: {
        position: controller2.position.toArray(),
        quaternion: controller2.quaternion.toArray(),
      },
      camera: {
        position: camera.position.toArray(),
        quaternion: camera.quaternion.toArray(),
      },
    });
  }

  /**
   * Send a request to the backend to grab the object with the given id.
   * 
   * @param objectId The id of the object to request to grab.
   * @return A locally unique identifier that is used by the backend to respond to this request. 
   */
  sendObjectGrabbed(objectId: string): number {
    const nonce = this.nextNonce();
    this.webSocket.send<ObjectGrabbedMessage>({
      event: 'object_grabbed',
      nonce, objectId
    });
    return nonce;
  }

  /**
   * Sends the position and rotation of a grabbed object to the backend.
   * 
   * @param objectId The id of the grabbed object.
   * @param position The new position of the grabbed object in world coordinates.
   * @param quaternion The new rotation of the grabbed object in world coordinates.
   */
  sendObjectMoved(objectId: string, position: THREE.Vector3, quaternion: THREE.Quaternion) {
    this.webSocket.send<ObjectMovedMessage>({
      event: 'object_moved', 
      objectId, 
      position: position.toArray(), 
      quaternion: quaternion.toArray()
    });
  }

  /**
   * Sends a message to the backend that notifies it that the object with the
   * given id has been released and can be grabbed by another user.
   * 
   * @param objectId The id of the object to request to grab.
   */
  sendObjectReleased(objectId: string) {
    this.webSocket.send<ObjectReleasedMessage>({
      event: 'object_released', 
      objectId
    });
  }

  /**
   * Informs the backend that an application was closed by this user.
   * 
   * @param {string} appID ID of the closed application
   */
  sendAppClosed(appID: string) {
    this.webSocket.send<AppClosedMessage>({
      event: 'app_closed',
      id: appID,
    });
  }

  /**
   * Informs the backend that a component was opened or closed by this user.
   * 
   * @param {string} appID ID of the app which is a parent to the component
   * @param {string} componentID ID of the component which was opened or closed
   * @param {boolean} isOpened Tells whether the component is now open or closed (current state)
   */
  sendComponentUpdate(appID: string, componentID: string, isOpened: boolean,
    isFoundation: boolean) {
    this.webSocket.send<ComponentUpdateMessage>({
      event: 'component_update',
      appID,
      componentID,
      isOpened,
      isFoundation,
    });
  }

  /**
   * Informs the backend that an entity (clazz or component) was highlighted
   * or unhighlighted.
   * 
   * @param {string} appID ID of the parent application of the entity
   * @param {string} entityType Tells whether a clazz/component or communication was updated
   * @param {string} entityID ID of the highlighted/unhighlighted component/clazz
   * @param {boolean} isHighlighted Tells whether the entity has been highlighted or not
   */
  sendHighlightingUpdate(appID: string, entityType: string,
    entityID: string, isHighlighted: boolean) {
    this.webSocket.send<HighlightingUpdateMessage>({
      event: 'hightlighting_update',
      appID,
      entityType,
      entityID,
      isHighlighted,
    });
  }

  /**
   * Informs backend that this user entered or left spectating mode and
   * additionally adds who is spectating who.
   */
  sendSpectatingUpdate(isSpectating: boolean, spectatedUser: string|null) {
    this.webSocket.send<SpectatingUpdateMessage>({
      event: 'spectating_update',
      isSpectating,
      spectatedUser,
    });
  }

  /**
   * Informs the backend if a controller was connected/disconnected.
   */
  sendControllerUpdate(connect: any, disconnect: any) {
    this.webSocket.send<UserControllerMessage>({
      event: 'user_controllers',
      connect,
      disconnect,
    });
  }

  /**
   * Informs the backend that an app was opened by this user.
   * 
   * @param ApplicationObject3D Opened application
   */
  sendAppOpened(application: ApplicationObject3D) {
    const position = new THREE.Vector3();
    application.getWorldPosition(position);

    const quaternion = new THREE.Quaternion();
    application.getWorldQuaternion(quaternion);

    this.webSocket.send<AppOpenedMessage>({
      event: 'app_opened',
      id: application.dataModel.pid,
      position: position.toArray(),
      quaternion: quaternion.toArray(),
    });
  }

  sendMenuDetached(detachId: string, position: THREE.Vector3, quaternion: THREE.Quaternion) {
    const nonce = this.nextNonce();
    this.webSocket.send<MenuDetachedMessage>({
      event: 'menu_detached',
      nonce: nonce,
      detachId: detachId,
      position: position.toArray(),
      quaternion: quaternion.toArray(), 
    });
    return nonce;
  }
}
