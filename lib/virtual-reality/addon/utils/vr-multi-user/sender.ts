import WebSocket from 'virtual-reality/services/web-socket';
import {
  Vector3 as V3, Quaternion as Q, Color,
} from 'three';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

type Pose = {position: THREE.Vector3, quaternion: THREE.Quaternion};
export default class Sender {
  webSocket: WebSocket;

  constructor(webSocket: WebSocket) {
    this.webSocket = webSocket;
  }

  sendPoseUpdate(camera: Pose, controller1: Pose, controller2: Pose) {
    const positionObj = {
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
      time: Date.now(),
    };

    this.webSocket.enqueueIfOpen(positionObj);
  }

  /**
 * Send update of position + quaternion of the
 * landscape (vrEnvironment)
 */
  sendLandscapeUpdate(deltaPosition: V3, quaternion: Q, environmentOffset: V3) {
    const landscapeObj = {
      event: 'landscape_position',
      deltaPosition: deltaPosition.toArray(),
      offset: environmentOffset.toArray(),
      quaternion: quaternion.toArray(),
    };
    this.webSocket.enqueueIfOpen(landscapeObj);
  }

  /**
 * Send update of position + quaternion of the
 * landscape (vrEnvironment)
 */
  sendAppPositionUpdate(appId: string, direction: V3, length: number) {
    const applicationObj = {
      event: 'app_position',
      appId,
      direction: direction.toArray(),
      length,
    };
    this.webSocket.enqueueIfOpen(applicationObj);
  }

  /**
 * Send the backend the information that a system was
 * closed or opened by this user
 * @param {string} id ID of system which was opened/closed
 * @param {boolean} isOpen State of the system
 */
  sendSystemUpdate(id: string, isOpen: boolean) {
    const systemObj = {
      event: 'system_update',
      id,
      isOpen,
    };
    this.webSocket.enqueueIfOpen(systemObj);
  }

  /**
 * Send the backend the information that a nodegroup was
 * closed or opened by this user
 * @param {string} id ID of nodegroup which was opened/closed
 * @param {boolean} isOpen State of the nodegroup
 */
  sendNodegroupUpdate(id: string, isOpen: boolean) {
    const nodeGroupObj = {
      event: 'nodegroup_update',
      id,
      isOpen,
    };
    this.webSocket.enqueueIfOpen(nodeGroupObj);
  }

  /**
 * Inform the backend that an application was closed
 * by this user
 * @param {string} appID ID of the closed application
 */
  sendAppClosed(appID: string) {
    const appObj = {
      event: 'app_closed',
      id: appID,
    };
    this.webSocket.enqueueIfOpen(appObj);
  }

  /**
 * Informs the backend that this user holds/moves an application
 * @param {string} appID ID of the bound app
 * @param {Vector3} appPosition Position of the app (x, y, z)
 * @param {Quaternion} appQuaternion Quaternion of the app (x, y, z, w)
 * @param {boolean} isBoundToController1 Tells if app is hold by left controller
 * @param {Vector3} controllerPosition Position of the controller which holds the application
 * @param {Quaternion} controllerQuaternion Quaternion of the controller which holds the application
 */
  sendAppBinded(appID: string, appPosition: V3, appQuaternion: Q, isBoundToController1: boolean,
    controllerPosition: V3, controllerQuaternion: Q) {
    const appObj = {
      event: 'app_binded',
      appID,
      appPosition: appPosition.toArray(),
      appQuaternion: appQuaternion.toArray(),
      isBoundToController1,
      controllerPosition: controllerPosition.toArray(),
      controllerQuaternion: controllerQuaternion.toArray(),
    };
    this.webSocket.enqueueIfOpen(appObj);
  }

  /**
 * Informs the backend that an application is no stringer bound but released
 * @param {string} appID ID of the bound app
 * @param {Vector3} position Position of the app (x, y, z)
 * @param {Quaternion} quaternion Quaternion of the app (x, y, z, w)
 */
  sendAppReleased(appID: string, position: V3, quaternion: Q) {
    const appObj = {
      event: 'app_released',
      id: appID,
      position: position.toArray(),
      quaternion: quaternion.toArray(),
    };
    this.webSocket.enqueueIfOpen(appObj);
  }

  /**
 * Informs the backend that a component was opened or closed by this user
 * @param {string} appID ID of the app which is a parent to the component
 * @param {string} componentID ID of the component which was opened or closed
 * @param {boolean} isOpened Tells whether the component is now open or closed (current state)
 */
  sendComponentUpdate(appID: string, componentID: string, isOpened: boolean,
    isFoundation: boolean) {
    const appObj = {
      event: 'component_update',
      appID,
      componentID,
      isOpened,
      isFoundation,
    };
    this.webSocket.enqueueIfOpen(appObj);
  }

  /**
 * Informs the backend that an entity (clazz or component) was highlighted
 * or unhighlighted
 * @param {boolean} isHighlighted Tells whether the entity has been highlighted or not
 * @param {string} appID ID of the parent application of the entity
 * @param {string} entityID ID of the highlighted/unhighlighted component/clazz
 * @param {string} color Original color of the entity as hex value
 */
  sendHighlightingUpdate(userID: string, isHighlighted: boolean, appID: string, entityID: string,
    sourceClazzID: string, targetClazzID: string, color: any) {
    // TODO update method documentation

    const hightlightObj = {
      event: 'hightlighting_update',
      userID,
      appID,
      entityID,
      sourceClazzID,
      targetClazzID,
      isHighlighted,
      color: color instanceof Color ? color.getStyle() : color,
    };
    this.webSocket.enqueueIfOpen(hightlightObj);
  }

  /**
 * Informs backend that this user entered or left spectating mode
 * and additionally adds who is spectating who
 */
  sendSpectatingUpdate(userID: string, state: string, spectatedUser: string|null) {
    const spectateObj = {
      event: 'spectating_update',
      userID,
      isSpectating: state === 'spectating',
      spectatedUser,
    };
    this.webSocket.enqueueIfOpen(spectateObj);
  }

  /**
 * Informs the backend if a controller was connected/disconnected
 */
  sendControllerUpdate(connect: any, disconnect: any) {
    const controllerObj = {
      event: 'user_controllers',
      connect,
      disconnect,
    };

    this.webSocket.enqueueIfOpen(controllerObj);
  }

  /**
 * Inform the backend that an app was opened by this
 * user
 * @param ApplicationObject3D Opened application
 */
  sendAppOpened(application: ApplicationObject3D) {
    const position = new V3();
    application.getWorldPosition(position);

    const quaternion = new Q();
    application.getWorldQuaternion(quaternion);

    const appObj = {
      event: 'app_opened',
      id: application.dataModel.id,
      position: position.toArray(),
      quaternion: quaternion.toArray(),
    };

    this.webSocket.enqueueIfOpen(appObj);
  }
}
