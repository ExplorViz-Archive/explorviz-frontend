import Component from '@glimmer/component';
import System from 'explorviz-frontend/models/system';

interface Args {
  system: System
}

export default class SystemPopup extends Component<Args> {
  get name() {
    return this.args.system.get('name')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  get nodeCount() {
    let count = 0;

    // Calculate node count
    const nodeGroups = this.args.system.get('nodegroups');

    nodeGroups.forEach((nodeGroup) => {
      count += nodeGroup.get('nodes').get('length');
    });

    return count;
  }

  get applicationCount() {
    let count = 0;

    // Calculate node and application count
    const nodeGroups = this.args.system.get('nodegroups');

    nodeGroups.forEach((nodeGroup) => {
      const nodes = nodeGroup.get('nodes');

      nodes.forEach((node) => {
        count += node.get('applications').get('length');
      });
    });

    return count;
  }
}
