import Service, { inject as service } from '@ember/service';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import config from 'explorviz-frontend/config/environment';
import THREE from 'three';
import { Position } from 'virtual-reality/utils/vr-message/util/position';
import { Quaternion } from 'virtual-reality/utils/vr-message/util/quaternion';
import { Scale } from 'virtual-reality/utils/vr-message/util/Scale';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import VrTimestampService from 'virtual-reality/utils/vr-timestamp';

type RoomId = string;

export type RoomListRecord = {
  id: RoomId,
  name: string
};

function isRoomId(roomId: any): roomId is RoomId {
  return typeof roomId === 'string';
}

type InitialRoomPayload = {
  landscape: {
    landscapeToken: string,
    timestamp: number,
    position: Position,
    quaternion: Quaternion,
    scale: Scale
  }
}

type InjectedValues = {
  vrLandscapeRenderer: VrLandscapeRenderer,
  vrTimestampService: VrTimestampService
};

export default class VrRoomService extends Service {
  @service('ajax')
  private ajax!: AjaxServiceClass;

  private vrLandscapeRenderer!: VrLandscapeRenderer;

  private vrTimestampService!: VrTimestampService;

  injectValues({
    vrLandscapeRenderer,
    vrTimestampService,
  }: InjectedValues) {
    this.vrLandscapeRenderer = vrLandscapeRenderer;
    this.vrTimestampService = vrTimestampService;
  }

  async listRooms(): Promise<RoomListRecord[]> {
    const url = `${config.APP.API_ROOT}/v2/vr/rooms`;
    const roomIds = await this.ajax.request(url);
    if (Array.isArray(roomIds) && roomIds.every(isRoomId)) {
      return roomIds.map((roomId) => {
        return { id: roomId, name: `Room ${roomId}` };
      });
    }
    throw 'invalid data';
  }

  createRoom(): Promise<string> {
    const url = `${config.APP.API_ROOT}/v2/vr/room`;
    return this.ajax.post(url, {data: this.buildInitialRoomPayload()});
  }

  private buildInitialRoomPayload(): InitialRoomPayload {
    const landscapeObject3D = this.vrLandscapeRenderer.landscapeObject3D;
    return {
      landscape: {
        landscapeToken: landscapeObject3D.dataModel.landscapeToken,
        timestamp: this.vrTimestampService.timestamp,
        position: landscapeObject3D.getWorldPosition(new THREE.Vector3()).toArray(),
        quaternion: landscapeObject3D.getWorldQuaternion(new THREE.Quaternion()).toArray(),
        scale: landscapeObject3D.scale.toArray()
      }
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-room': VrRoomService;
  }
}
