import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';

interface Args {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
}

export default class ColorPicker extends Component<Args> {
  @service('configuration')
  configuration!: Configuration;
}
