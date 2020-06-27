import { action, set } from '@ember/object';
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

  @action
  applyColorScheme(scheme: string) {
    if (scheme === 'default') {
      this.applyDefaultColors();
    } else if (scheme === 'impaired') {
      this.applyVisuallyImpairedColors();
    }
  }

  @action
  close(this: ColorPicker) {
    this.args.removeComponent('color-picker');
  }

  /**
   * Sets colors for the current view to default values
   */
  applyDefaultColors() {
    if (this.args.isLandscapeView) {
      this.configuration.resetLandscapeColors();
    } else {
      this.configuration.resetApplicationColors();
    }
  }

  /**
   * Sets color values for current view towards more visually impaired ones
   */
  applyVisuallyImpairedColors() {
    if (this.args.isLandscapeView) {
      set(this.configuration, 'landscapeColors', {
        system: '#c7c7c7', // grey
        nodegroup: '#015a6e', // blue
        node: '#0096be', // light blue
        application: '#5f5f5f', // dark grey
        communication: '#f49100', // orange
        systemText: '#000000', // black
        nodeText: '#ffffff', // white
        applicationText: '#ffffff', // white
        collapseSymbol: '#000000', // black
        background: '#ffffff', // white
      });
    } else {
      set(this.configuration, 'applicationColors', {
        foundation: '#c7c7c7', // grey
        componentOdd: '#015a6e', // blue
        componentEven: '#0096be', // light blue
        clazz: '#5f5f5f', // dark grey
        highlightedEntity: '#ff0000', // red
        componentText: '#ffffff', // white
        clazzText: '#ffffff', // white
        foundationText: '#000000', // black
        communication: '#f49100', // orange
        communicationArrow: '#000000', // black
        background: '#ffffff', // white
      });
    }
  }
}
