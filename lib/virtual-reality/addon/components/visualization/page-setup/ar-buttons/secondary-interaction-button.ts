import Component from '@glimmer/component';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import { inject as service } from '@ember/service';

interface SecondaryInteractionButtonArgs {
  handleSecondaryCrosshairInteraction(): void
}

export default class SecondaryInteractionButton extends Component<SecondaryInteractionButtonArgs> {
  @service('local-vr-user')
  localUser!: LocalVrUser;
}
