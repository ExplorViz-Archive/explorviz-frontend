import Component from '@glimmer/component';
import { computed } from '@ember/object';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import { inject as service } from '@ember/service';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';

interface PingButtonArgs {
  handlePing(): void
}

export default class PingButton extends Component<PingButtonArgs> {
  @service('local-vr-user')
  localUser!: LocalVrUser;

  @service('remote-vr-users')
  // @ts-ignore since it is used in template
  private remoteUsers!: RemoteVrUserService;

  @computed('remoteUsers.idToRemoteUser')
  get userIsAlone() {
    const numberOfOtherUsers = Array.from(this.remoteUsers.getAllRemoteUsers()).length;

    return numberOfOtherUsers === 0;
  }
}
