import { action } from '@ember/object';
import Component from '@glimmer/component';

interface ShareLandscapeArgs {
  addComponent(componentPath: string): void
}

export default class ShareLandscapeOpener extends Component<ShareLandscapeArgs> {
  @action
  showShareLandscape() {
    this.args.addComponent('share-landscape');
  }
}
