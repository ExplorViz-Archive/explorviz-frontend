import Service, { inject as service } from '@ember/service';
import ENV from 'explorviz-frontend/config/environment';
import Auth from 'explorviz-frontend/services/auth';
import THREE from 'three';
import DetachedMenuGroupsService from 'virtual-reality/services/detached-menu-groups';
import VrApplicationRenderer from 'virtual-reality/services/vr-application-renderer';
import VrTimestampService from 'virtual-reality/services/vr-timestamp';
import { DetachableMenu, isDetachableMenu } from 'virtual-reality/utils/vr-menus/detachable-menu';
import { InitialRoomApp, InitialRoomDetachedMenu, InitialRoomLandscape, InitialRoomPayload } from 'virtual-reality/utils/vr-payload/initial-room';
import VrLandscapeRenderer from "./vr-landscape-renderer";

const { vrService } = ENV.backendAddresses;

type RoomId = string;

export type RoomListRecord = {
  id: RoomId,
  name: string
};

function isRoomId(roomId: any): roomId is RoomId {
  return typeof roomId === 'string';
}

export default class VrRoomService extends Service {
  @service('auth') private auth!: Auth;
  @service('detached-menu-groups') private detachedMenuGroups!: DetachedMenuGroupsService;
  @service('vr-application-renderer') private vrApplicationRenderer!: VrApplicationRenderer;
  @service('vr-landscape-renderer') private vrLandscapeRenderer!: VrLandscapeRenderer;
  @service('vr-timestamp') private timestampService!: VrTimestampService;

  async listRooms(): Promise<RoomListRecord[]> {
    const url = `${vrService}/v2/vr/rooms`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.auth.accessToken}`,
      }
    });
    const roomIds = await response.json();
    if (Array.isArray(roomIds) && roomIds.every(isRoomId)) {
      return roomIds.map((roomId) => {
        return { id: roomId, name: `Room ${roomId}` };
      });
    }
    throw 'invalid data';
  }

  async createRoom(): Promise<string> {
    const url = `${vrService}/v2/vr/room`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.buildInitialRoomPayload())
    });
    return await response.json() as string;
  }

  private buildInitialRoomPayload(): InitialRoomPayload {
    return {
      landscape: this.buildInitialRoomLandscape(),
      openApps: this.buildInitialOpenApps(),
      detachedMenus: this.buildInitialDetachedMenus(),
    }
  }

  private buildInitialRoomLandscape(): InitialRoomLandscape {
    const landscapeObject3D = this.vrLandscapeRenderer.landscapeObject3D;
    return {
      landscapeToken: landscapeObject3D.dataModel.landscapeToken,
      timestamp: this.timestampService.timestamp,
      position: landscapeObject3D.getWorldPosition(new THREE.Vector3()).toArray(),
      quaternion: landscapeObject3D.getWorldQuaternion(new THREE.Quaternion()).toArray(),
      scale: landscapeObject3D.scale.toArray()
    };
  }

  private buildInitialOpenApps(): InitialRoomApp[] {
    return this.vrApplicationRenderer.getOpenApplications().map((application) => {
      return {
        id: application.dataModel.instanceId,
        position: application.getWorldPosition(new THREE.Vector3()).toArray(),
        quaternion: application.getWorldQuaternion(new THREE.Quaternion()).toArray(),
        scale: application.scale.toArray(),
        openComponents: Array.from(application.openComponentIds),
      };
    });
  }

  private buildInitialDetachedMenus(): InitialRoomDetachedMenu[] {
    return this.detachedMenuGroups.getDetachedMenus()
      .filter((detachedMenuGroup) => isDetachableMenu(detachedMenuGroup.currentMenu))
      .map((detachedMenuGroup) => {
        const detachedMenu = detachedMenuGroup.currentMenu as DetachableMenu;
        return {
          entityId: detachedMenu.getDetachId(),
          entityType: detachedMenu.getEntityType(),
          position: detachedMenuGroup.getWorldPosition(new THREE.Vector3()).toArray(),
          quaternion: detachedMenuGroup.getWorldQuaternion(new THREE.Quaternion()).toArray(),
          scale: detachedMenuGroup.scale.toArray()
        };
      });
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-room': VrRoomService;
  }
}
