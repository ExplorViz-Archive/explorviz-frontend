import Component from '@glimmer/component';
import { Application } from 'explorviz-frontend/services/landscape-listener';

interface Args {
  application: Application
}

export default class ApplicationPopup extends Component<Args> {
}
