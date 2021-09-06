import Component from '@glimmer/component';
import { ColorScheme } from 'explorviz-frontend/services/user-settings';

interface Args {
  colorSchemes: { name: string, action: () => void };
  applyColorScheme(colorScheme: ColorScheme): void;
}

export default class ColorSchemeSelector extends Component<Args> {

}
