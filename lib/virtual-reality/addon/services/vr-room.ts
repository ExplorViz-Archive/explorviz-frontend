import Service, { inject as service } from '@ember/service';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import ENV from 'explorviz-frontend/config/environment';
import THREE from 'three';
import { DetachableMenu, isDetachableMenu } from 'virtual-reality/utils/vr-menus/detachable-menu';
import DetachedMenuGroupContainer from 'virtual-reality/utils/vr-menus/detached-menu-group-container';
import { InitialRoomApp, InitialRoomDetachedMenu, InitialRoomLandscape, InitialRoomPayload } from 'virtual-reality/utils/vr-payload/initial-room';
import VrApplicationRenderer from 'virtual-reality/utils/vr-rendering/vr-application-renderer';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import VrTimestampService from 'virtual-reality/utils/vr-timestamp';

const { vrService } = ENV.backendAddresses;

type RoomId = string;

export type RoomListRecord = {
  id: RoomId,
  name: string
};

function isRoomId(roomId: any): roomId is RoomId {
  return typeof roomId === 'string';
}

type InjectedValues = {
  detachedMenuGroups: DetachedMenuGroupContainer,
  vrApplicationRenderer: VrApplicationRenderer,
  vrLandscapeRenderer: VrLandscapeRenderer,
  vrTimestampService: VrTimestampService
};

export default class VrRoomService extends Service {
  @service('ajax')
  private ajax!: AjaxServiceClass;

  private detachedMenuGroups!: DetachedMenuGroupContainer;
  private vrApplicationRenderer!: VrApplicationRenderer;
  private vrLandscapeRenderer!: VrLandscapeRenderer;
  private vrTimestampService!: VrTimestampService;

  injectValues({
    detachedMenuGroups,
    vrApplicationRenderer,
    vrLandscapeRenderer,
    vrTimestampService,
  }: InjectedValues) {
    this.detachedMenuGroups = detachedMenuGroups;
    this.vrApplicationRenderer = vrApplicationRenderer;
    this.vrLandscapeRenderer = vrLandscapeRenderer;
    this.vrTimestampService = vrTimestampService;
  }

  async listRooms(): Promise<RoomListRecord[]> {
    const url = `${vrService}/v2/vr/rooms`;
    const roomIds = await this.ajax.request(url);
    if (Array.isArray(roomIds) && roomIds.every(isRoomId)) {
      return roomIds.map((roomId) => {
        return { id: roomId, name: `Room ${roomId}` };
      });
    }
    throw 'invalid data';
  }

  createRoom(): Promise<string> {
    const url = `${vrService}/v2/vr/room`;
    return this.ajax.post(url, {
      contentType: "application/json",
      data: JSON.stringify(this.buildInitialRoomPayload())
    });
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
      timestamp: this.vrTimestampService.timestamp,
      position: landscapeObject3D.getWorldPosition(new THREE.Vector3()).toArray(),
      quaternion: landscapeObject3D.getWorldQuaternion(new THREE.Quaternion()).toArray(),
      scale: landscapeObject3D.scale.toArray()
    };
  }

  private buildInitialOpenApps(): InitialRoomApp[] {
    const applicationGroup = this.vrApplicationRenderer.applicationGroup;
    return Array.from(applicationGroup.openedApps.values()).map((application) => {
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
