import { action } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';

interface ColorSchemeSelectorArgs {
  updateView(): void
}

export default class ColorSchemeSelector extends Component<ColorSchemeSelectorArgs> {
  @service('configuration')
  configuration!: Configuration;

  @action
  applyColorScheme(scheme: string) {
    this.configuration.applyColorSchemeByName(scheme);

    this.args.updateView();
  }
}
