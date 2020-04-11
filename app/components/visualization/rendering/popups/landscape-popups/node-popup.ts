import Component from '@glimmer/component';
import Node from 'explorviz-frontend/models/node';
import round from 'explorviz-frontend/utils/helpers/number-helpers';

interface Args {
  node: Node
}

export default class NodePopup extends Component<Args> {
  get displayName() {
    const { node } = this.args;
    if (node.get('name') && node.get('name').length > 0 && !node.get('name').startsWith('<')) {
      return node.get('name');
    }
    return node.get('ipAddress');
  }

  get cpuUtilization() {
    return `${round(this.args.node.get('cpuUtilization') * 100, 0)}%`;
  }

  get freeRAM() {
    const formatFactor = (1024 * 1024 * 1024);
    return round(this.args.node.get('freeRAM') / formatFactor, 2).toFixed(2);
  }

  get totalRam() {
    const formatFactor = (1024 * 1024 * 1024);
    return round((this.args.node.get('usedRAM') + this.args.node.get('freeRAM')) / formatFactor, 2).toFixed(2);
  }
}
