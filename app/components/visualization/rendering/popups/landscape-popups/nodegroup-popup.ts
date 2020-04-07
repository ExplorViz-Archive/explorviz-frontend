import Component from '@glimmer/component';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import { round } from 'explorviz-frontend/utils/helpers/number-helpers';

interface Args {
  nodeGroup: NodeGroup
}

export default class NodeGroupPopup extends Component<Args> {
  get numberOfApplications() {
    let applicationCount = 0;

    const nodes = this.args.nodeGroup.get('nodes');

    nodes.forEach((node) => {
      applicationCount += node.get('applications').get('length');
    });

    return applicationCount;
  }

  get averageCPUUtilization() {
    let avgNodeCPUUtil = 0.0;

    const nodes = this.args.nodeGroup.get('nodes');
    const nodeCount = nodes.get('length');

    nodes.forEach((node) => {
      avgNodeCPUUtil += node.get('cpuUtilization');
    });

    const avgCpuUtilization = round((avgNodeCPUUtil * 100) / nodeCount, 0);

    return `${avgCpuUtilization}%`;
  }
}
