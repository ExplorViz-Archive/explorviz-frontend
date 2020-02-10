import Component from '@glimmer/component';
import Clazz from 'explorviz-frontend/models/clazz';

interface Args {
  clazz: Clazz
}

export default class ClazzPopup extends Component<Args> {
  get name() {
    return this.args.clazz.get('name');
  }

  get activeInstances() {
    return this.args.clazz.get('instanceCount');
  }

  get calledOps() {
    const clazzCommunications = this.args.clazz.get('clazzCommunications');
    const operationCount = clazzCommunications.get('length');
    return operationCount;
  }
}
