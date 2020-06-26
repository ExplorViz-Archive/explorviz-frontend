import { action } from '@ember/object';
import Component from '@glimmer/component';

interface ColorPickerArgs {
  isLandscapeView: Boolean,
}

export default class ColorPicker extends Component<ColorPickerArgs> {
  @action
  showColorPicker() {
    console.log('IsLandscape: ', this.args.isLandscapeView);
  }
}
