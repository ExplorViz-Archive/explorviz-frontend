import Component from '@glimmer/component';
import Application from 'explorviz-frontend/models/application';

interface Args {
  application: Application
}

export default class ApplicationPopup extends Component<Args> {
  get lastUsage() {
    return new Date(this.args.application.get('lastUsage')).toLocaleString();
  }
}
