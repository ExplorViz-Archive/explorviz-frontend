import { action, set } from '@ember/object';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';
import { tracked } from '@glimmer/tracking';

interface Args {
  isLandscapeView: Boolean
  removeComponent(componentPath: string): void
  updateView(): void
}

export default class ColorPicker extends Component<Args> {
  @service('configuration')
  configuration!: Configuration;

  // Bound to color inputs
  @tracked
  appColors = {
    foundation: '#c7c7c7', // grey
    componentOdd: '#169e2b', // dark green
    componentEven: '#00bb41', // light green
    clazz: '#3e14a0', // purple-blue
    highlightedEntity: '#ff0000', // red
    componentText: '#ffffff', // white
    clazzText: '#ffffff', // white
    foundationText: '#000000', // black
    communication: '#f49100', // orange
    communicationArrow: '#000000', // black
    background: '#ffffff', // white
  };

  // Bound to color inputs
  @tracked
  landscapeColors = {
    system: '#c7c7c7', // grey
    nodegroup: '#169e2b', // dark green
    node: '#00bb41', // green
    application: '#3e14a0', // purple-blue
    communication: '#f49100', // orange
    systemText: '#000000', // black
    nodeText: '#ffffff', // white
    applicationText: '#ffffff', // white
    collapseSymbol: '#000000', // black
    background: '#ffffff', // white
  };

  @action
  applyColorScheme(scheme: string) {
    if (scheme === 'default') {
      this.applyDefaultColors();
    } else if (scheme === 'impaired') {
      this.applyVisuallyImpairedColors();
    }
  }

  /**
   * Updates the colors in the configuration with respect to the color input values.
   * Triggers a update of the view.
   */
  @action
  updateColors() {
    // Update application color configuration with colorpicker values
    if (this.args.isLandscapeView) {
      this.configuration.landscapeColors.system.set(this.landscapeColors.system);
      this.configuration.landscapeColors.nodegroup.set(this.landscapeColors.nodegroup);
      this.configuration.landscapeColors.node.set(this.landscapeColors.node);
      this.configuration.landscapeColors.application.set(this.landscapeColors.application);
      this.configuration.landscapeColors.communication.set(this.landscapeColors.communication);
      this.configuration.landscapeColors.systemText.set(this.landscapeColors.systemText);
      this.configuration.landscapeColors.nodeText.set(this.landscapeColors.nodeText);
      this.configuration.landscapeColors.applicationText.set(this.landscapeColors.applicationText);
      this.configuration.landscapeColors.collapseSymbol.set(this.landscapeColors.collapseSymbol);
      this.configuration.landscapeColors.background.set(this.landscapeColors.background);
    // Update landscape color configuration with colorpicker values
    } else {
      this.configuration.applicationColors.foundation.set(this.appColors.foundation);
      this.configuration.applicationColors.componentOdd.set(this.appColors.componentOdd);
      this.configuration.applicationColors.componentEven.set(this.appColors.componentEven);
      this.configuration.applicationColors.clazz.set(this.appColors.clazz);
      this.configuration.applicationColors.highlightedEntity.set(this.appColors.highlightedEntity);
      this.configuration.applicationColors.componentText.set(this.appColors.componentText);
      this.configuration.applicationColors.clazzText.set(this.appColors.clazzText);
      this.configuration.applicationColors.foundationText.set(this.appColors.foundationText);
      this.configuration.applicationColors.communication.set(this.appColors.communication);
      this.configuration.applicationColors.communicationArrow
        .set(this.appColors.communicationArrow);
      this.configuration.applicationColors.background.set(this.appColors.background);
    }

    this.args.updateView();
  }

  @action
  close(this: ColorPicker) {
    this.args.removeComponent('color-picker');
  }

  /**
   * Sets color values to default.
   * Triggers update of color configuration and colors of current view.
   */
  applyDefaultColors() {
    if (this.args.isLandscapeView) {
      set(this.landscapeColors, 'system', '#c7c7c7'); // grey
      set(this.landscapeColors, 'nodegroup', '#169e2b'); // dark green
      set(this.landscapeColors, 'node', '#00bb41'); // green
      set(this.landscapeColors, 'application', '#3e14a0'); // purple-blue
      set(this.landscapeColors, 'communication', '#f49100'); // orange
      set(this.landscapeColors, 'systemText', '#000000'); // black
      set(this.landscapeColors, 'nodeText', '#ffffff'); // white
      set(this.landscapeColors, 'applicationText', '#ffffff'); // white
      set(this.landscapeColors, 'collapseSymbol', '#000000'); // black
      set(this.landscapeColors, 'background', '#ffffff'); // white
    } else {
      set(this.appColors, 'foundation', '#c7c7c7'); // grey
      set(this.appColors, 'componentOdd', '#169e2b'); // dark green
      set(this.appColors, 'componentEven', '#00bb41'); // light green
      set(this.appColors, 'clazz', '#3e14a0'); // purple-blue
      set(this.appColors, 'highlightedEntity', '#ff0000'); // red
      set(this.appColors, 'componentText', '#ffffff'); // white
      set(this.appColors, 'clazzText', '#ffffff'); // white
      set(this.appColors, 'foundationText', '#000000'); // black
      set(this.appColors, 'communication', '#f49100'); // orange
      set(this.appColors, 'communicationArrow', '#000000'); // black
      set(this.appColors, 'background', '#ffffff'); // white
    }

    this.updateColors();
  }

  /**
   * Updates color values such that they better suit visually impaired users.
   * Triggers update of color configuration and colors of current view.
   */
  applyVisuallyImpairedColors() {
    if (this.args.isLandscapeView) {
      set(this.landscapeColors, 'system', '#c7c7c7'); // grey
      set(this.landscapeColors, 'nodegroup', '#015a6e'); // blue
      set(this.landscapeColors, 'node', '#0096be'); // light blue
      set(this.landscapeColors, 'application', '#5f5f5f'); // dark grey
      set(this.landscapeColors, 'communication', '#f49100'); // orange
      set(this.landscapeColors, 'systemText', '#000000'); // black
      set(this.landscapeColors, 'nodeText', '#ffffff'); // white
      set(this.landscapeColors, 'applicationText', '#ffffff'); // white
      set(this.landscapeColors, 'collapseSymbol', '#000000'); // black
      set(this.landscapeColors, 'background', '#ffffff'); // white
    } else {
      set(this.appColors, 'foundation', '#c7c7c7'); // grey
      set(this.appColors, 'componentOdd', '#015a6e'); // blue
      set(this.appColors, 'componentEven', '#0096be'); // light blue
      set(this.appColors, 'clazz', '#5f5f5f'); // dark grey
      set(this.appColors, 'highlightedEntity', '#ff0000'); // red
      set(this.appColors, 'componentText', '#ffffff'); // white
      set(this.appColors, 'clazzText', '#ffffff'); // white
      set(this.appColors, 'foundationText', '#000000'); // black
      set(this.appColors, 'communication', '#f49100'); // orange
      set(this.appColors, 'communicationArrow', '#000000'); // black
      set(this.appColors, 'background', '#ffffff'); // white
    }

    this.updateColors();
  }
}
