import Component from '@glimmer/component';
import { Class } from 'explorviz-frontend/services/landscape-listener';

interface Args {
  clazz: Class
}

export default class ClazzPopup extends Component<Args> {
  get name() {
    return this.args.clazz.name;
  }

/*   get calledOps() {
    const clazzCommunications = this.args.clazz.get('clazzCommunications');
    const operationCount = clazzCommunications.get('length');
    return operationCount;
  } */
}
