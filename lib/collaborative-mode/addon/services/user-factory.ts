import Service, { inject as service } from '@ember/service';
import RemoteUser from 'collaborative-mode/utils/remote-user';
import THREE from 'three';
import HmdService from 'virtual-reality/services/hmd-service';
import { Color } from 'virtual-reality/utils/vr-message/util/color';
import { Position } from 'virtual-reality/utils/vr-message/util/position';
import { Quaternion } from 'virtual-reality/utils/vr-message/util/quaternion';

export default class UserFactory extends Service.extend({
}) {
  @service('hmd-service')
  hmdService!: HmdService;

  // TODO set to true if it is a real VR user
  displayHmd = false;

  createUser({ userName, userId, color, position, quaternion }: {
    userName: string;
    userId: string;
    color: Color;
    position: Position;
    quaternion: Quaternion
  }): RemoteUser {

    const remoteUser = new RemoteUser({
      userName: userName,
      userId: userId,
      color: new THREE.Color(...color),
      state: 'online',
    });
    if (this.displayHmd) {
      this.hmdService.headsetModel.then((hmd) => remoteUser.initCamera(hmd.clone(true), { position, quaternion }));
    }
    return remoteUser
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'user-factory': UserFactory;
  }
}
