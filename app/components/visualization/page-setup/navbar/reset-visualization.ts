import { action } from '@ember/object';
import GlimmerComponent from '@glimmer/component';

interface Args {
  resetView(): void,
}

export default class ResetVisualization extends GlimmerComponent<Args> {
  @action
  resetView() {
    this.args.resetView();
  }
}
