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

  colorSchemes = [
    { name: 'Classic (Initial)', identifier: 'classic' },
    { name: 'Pastel', identifier: 'pastel' },
    { name: 'Blue', identifier: 'blue' },
    { name: 'Dark', identifier: 'dark' },
  ];

  @action
  applyColorScheme(scheme: string) {
    this.configuration.applyColorSchemeByName(scheme);

    this.args.updateView();
  }
}
