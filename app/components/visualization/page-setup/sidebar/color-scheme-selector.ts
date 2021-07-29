import Component from '@glimmer/component';

interface Args {
  colorSchemes: { name: string, action: () => void }
}

export default class ColorSchemeSelector extends Component<Args> {

}
