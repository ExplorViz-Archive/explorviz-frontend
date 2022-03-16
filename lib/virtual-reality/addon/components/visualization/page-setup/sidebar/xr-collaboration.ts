import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import VrRoomService from 'virtual-reality/services/vr-room';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { tracked } from '@glimmer/tracking';
import { RoomListRecord } from 'virtual-reality/utils/vr-payload/receivable/room-list';
import VrTimestampService from 'virtual-reality/services/vr-timestamp';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';
import LocalUser from 'collaborative-mode/services/local-user';

interface XrCollaborationArgs {
  removeComponent(componentPath: string): void
}

export default class ArSettingsSelector extends Component<XrCollaborationArgs> {
  @service('local-user')
  localUser!: LocalUser;

  @service('vr-room')
  roomService!: VrRoomService;

  @service('vr-timestamp')
  // @ts-ignore since it is used in template
  private timestampService!: VrTimestampService;

  @service('remote-vr-users')
  // @ts-ignore since it is used in template
  private remoteUsers!: RemoteVrUserService;

  @tracked
  rooms: RoomListRecord[] = [];

  @computed('remoteUsers.idToRemoteUser')
  get users() {
    const users = [];
    if (this.localUser.color) {
      users.push({ name: this.localUser.userName, style: `color:#${this.localUser.color.getHexString()}` });
    }
    const remoteUsers = Array.from(this.remoteUsers.getAllRemoteUsers()).map(
      (user) => ({ name: user.userName, style: `color:#${user.color.getHexString()}` }),
    );

    return users.concat(remoteUsers);
  }

  constructor(owner: any, args: XrCollaborationArgs) {
    super(owner, args);

    this.loadRooms(false);
  }

  @action
  close() {
    this.args.removeComponent('xr-collaboration');
  }

  @action
  hostRoom() {
    this.localUser.hostRoom();
    AlertifyHandler.showAlertifySuccess('Hosting new Room.');
  }

  @action
  leaveSession() {
    AlertifyHandler.showAlertifyWarning('Disconnected from Room');
    this.localUser.disconnect();
  }

  @action
  async loadRooms(alert = true) {
    if (alert) {
      AlertifyHandler.showAlertifySuccess('Reloading Rooms');
    }
    const rooms = await this.roomService.listRooms();
    this.rooms = rooms;
  }

  @action
  joinRoom(room: RoomListRecord) {
    AlertifyHandler.showAlertifySuccess(`Join Room: ${room.roomName}`);
    this.localUser.joinRoom(room.roomId);
  }
}
